"""
Core business logic: matching algorithm, auth helpers, messaging.
"""
import os
import uuid
from datetime import datetime, timedelta
from typing import Optional

from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy import select, and_, or_, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models import User, Profile, Match, Message, MatchHistory, MatchStatus, MatchAction

SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))  # 7 days

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ── Auth ──────────────────────────────────────────────────────────────────────

def hash_password(password: str) -> str:
    return pwd_ctx.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_ctx.verify(plain, hashed)


def create_access_token(user_id: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode({"sub": user_id, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        return None


async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


async def get_user_by_id(db: AsyncSession, user_id: str) -> Optional[User]:
    result = await db.execute(
        select(User).options(selectinload(User.profile)).where(User.id == user_id)
    )
    return result.scalar_one_or_none()


async def create_user(db: AsyncSession, email: str, password: str, name: str) -> User:
    user = User(
        id=str(uuid.uuid4()),
        email=email,
        hashed_password=hash_password(password),
    )
    db.add(user)
    await db.flush()

    profile = Profile(
        id=str(uuid.uuid4()),
        user_id=user.id,
        name=name,
        skills=[],
        interests=[],
        looking_for=[],
    )
    db.add(profile)
    await db.commit()
    await db.refresh(user)
    return user


# ── Matching Algorithm ────────────────────────────────────────────────────────

def _jaccard(a: list, b: list) -> float:
    """Jaccard similarity between two lists."""
    set_a, set_b = {x.lower() for x in (a or [])}, {x.lower() for x in (b or [])}
    if not set_a and not set_b:
        return 0.0
    return len(set_a & set_b) / len(set_a | set_b)


def _complementary_skills(a: list, b: list) -> float:
    """Score for skills each has that the other lacks — higher is better (each brings something new)."""
    set_a, set_b = {x.lower() for x in (a or [])}, {x.lower() for x in (b or [])}
    if not set_a or not set_b:
        return 0.0
    unique_a = len(set_a - set_b)
    unique_b = len(set_b - set_a)
    total = len(set_a | set_b)
    return (unique_a + unique_b) / (2 * total) if total else 0.0


def _role_complement(role_a: Optional[str], role_b: Optional[str]) -> float:
    """technical + business = perfect complement; same role = neutral; hybrid matches both."""
    if not role_a or not role_b:
        return 0.5
    if role_a == role_b:
        return 0.3 if role_a != "hybrid" else 0.6
    if set([role_a, role_b]) == {"technical", "business"}:
        return 1.0
    if "hybrid" in (role_a, role_b):
        return 0.75
    return 0.5


def _experience_balance(exp_a: int, exp_b: int) -> float:
    """Close experience years = collaborative peers; large gap can be mentor/mentee."""
    diff = abs(exp_a - exp_b)
    if diff <= 2:
        return 1.0
    if diff <= 5:
        return 0.75
    if diff <= 10:
        return 0.5
    return 0.25


def _industry_match(ind_a: Optional[str], ind_b: Optional[str]) -> float:
    if not ind_a or not ind_b:
        return 0.5
    return 1.0 if ind_a.lower() == ind_b.lower() else 0.2


def _stage_match(stage_a: Optional[str], stage_b: Optional[str]) -> float:
    if not stage_a or not stage_b:
        return 0.5
    return 1.0 if stage_a.lower() == stage_b.lower() else 0.3


def compute_match_score(p1: Profile, p2: Profile) -> tuple[float, dict]:
    """
    Weighted scoring inspired by CoFoundersLab's compatibility algorithm.
    Returns (total_score_0_to_100, breakdown_dict).
    """
    weights = {
        "complementary_skills": 0.30,
        "shared_interests": 0.20,
        "role_complement": 0.20,
        "industry_alignment": 0.15,
        "experience_balance": 0.10,
        "stage_alignment": 0.05,
    }

    components = {
        "complementary_skills": _complementary_skills(p1.skills, p2.skills),
        "shared_interests": _jaccard(p1.interests, p2.interests),
        "role_complement": _role_complement(p1.role_type, p2.role_type),
        "industry_alignment": _industry_match(p1.industry, p2.industry),
        "experience_balance": _experience_balance(p1.experience_years, p2.experience_years),
        "stage_alignment": _stage_match(p1.stage, p2.stage),
    }

    raw = sum(weights[k] * v for k, v in components.items())
    score = round(raw * 100, 1)
    breakdown = {k: round(v * 100, 1) for k, v in components.items()}
    return score, breakdown


# ── Suggestions ───────────────────────────────────────────────────────────────

async def get_suggestions(db: AsyncSession, current_user_id: str, limit: int = 20) -> list[dict]:
    """Return ranked list of profiles the current user hasn't acted on yet."""
    # Get IDs already acted on
    acted = await db.execute(
        select(MatchHistory.target_user_id).where(MatchHistory.user_id == current_user_id)
    )
    acted_ids = {row[0] for row in acted.fetchall()}
    acted_ids.add(current_user_id)

    # Load current user's profile
    current_profile_result = await db.execute(
        select(Profile).where(Profile.user_id == current_user_id)
    )
    current_profile = current_profile_result.scalar_one_or_none()
    if not current_profile:
        return []

    # Load all other profiles
    candidates = await db.execute(
        select(Profile).where(Profile.user_id.notin_(acted_ids))
    )
    profiles = candidates.scalars().all()

    scored = []
    for p in profiles:
        score, breakdown = compute_match_score(current_profile, p)
        scored.append({"user_id": p.user_id, "profile": p, "score": score, "score_breakdown": breakdown})

    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored[:limit]


# ── Match actions ─────────────────────────────────────────────────────────────

async def record_action(db: AsyncSession, user_id: str, target_id: str, action: str) -> Optional[Match]:
    """Record like/pass; create mutual match if both liked each other."""
    history = MatchHistory(
        id=str(uuid.uuid4()),
        user_id=user_id,
        target_user_id=target_id,
        action=MatchAction.like if action == "like" else MatchAction.pass_,
    )
    db.add(history)

    mutual_match = None
    if action == "like":
        # Check if target already liked current user
        reverse = await db.execute(
            select(MatchHistory).where(
                MatchHistory.user_id == target_id,
                MatchHistory.target_user_id == user_id,
                MatchHistory.action == MatchAction.like,
            )
        )
        if reverse.scalar_one_or_none():
            # Compute score
            p1_res = await db.execute(select(Profile).where(Profile.user_id == user_id))
            p2_res = await db.execute(select(Profile).where(Profile.user_id == target_id))
            p1 = p1_res.scalar_one_or_none()
            p2 = p2_res.scalar_one_or_none()
            score = 0.0
            if p1 and p2:
                score, _ = compute_match_score(p1, p2)

            mutual_match = Match(
                id=str(uuid.uuid4()),
                user1_id=user_id,
                user2_id=target_id,
                score=score,
                status=MatchStatus.accepted,
            )
            db.add(mutual_match)

    await db.commit()
    return mutual_match


# ── Messaging ─────────────────────────────────────────────────────────────────

async def get_match_for_users(db: AsyncSession, match_id: str, user_id: str) -> Optional[Match]:
    result = await db.execute(
        select(Match).where(
            Match.id == match_id,
            or_(Match.user1_id == user_id, Match.user2_id == user_id),
        )
    )
    return result.scalar_one_or_none()


async def get_messages(db: AsyncSession, match_id: str, limit: int = 50, offset: int = 0) -> list[Message]:
    result = await db.execute(
        select(Message)
        .where(Message.match_id == match_id)
        .order_by(Message.created_at.asc())
        .limit(limit)
        .offset(offset)
    )
    return result.scalars().all()


async def create_message(db: AsyncSession, match_id: str, sender_id: str, content: str) -> Message:
    msg = Message(
        id=str(uuid.uuid4()),
        match_id=match_id,
        sender_id=sender_id,
        content=content,
    )
    db.add(msg)
    await db.commit()
    await db.refresh(msg)
    return msg


async def mark_messages_read(db: AsyncSession, match_id: str, reader_id: str):
    result = await db.execute(
        select(Message).where(
            Message.match_id == match_id,
            Message.sender_id != reader_id,
            Message.is_read == False,
        )
    )
    for msg in result.scalars().all():
        msg.is_read = True
    await db.commit()


# ── User matches list ─────────────────────────────────────────────────────────

async def get_user_matches(db: AsyncSession, user_id: str) -> list[dict]:
    result = await db.execute(
        select(Match).where(
            or_(Match.user1_id == user_id, Match.user2_id == user_id),
            Match.status == MatchStatus.accepted,
        ).order_by(Match.created_at.desc())
    )
    matches = result.scalars().all()

    enriched = []
    for m in matches:
        other_id = m.user2_id if m.user1_id == user_id else m.user1_id
        profile_res = await db.execute(select(Profile).where(Profile.user_id == other_id))
        other_profile = profile_res.scalar_one_or_none()
        enriched.append({"match": m, "other_profile": other_profile})
    return enriched
