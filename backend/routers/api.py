import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, status, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import (
    Profile, Match, MatchStatus,
    ProfileCreate, ProfileUpdate, ProfileOut,
    MatchOut, MessageCreate, MessageOut,
    MatchActionRequest, SuggestionOut,
)
from services.core import (
    get_suggestions,
    record_action,
    get_match_for_users,
    get_messages,
    create_message,
    mark_messages_read,
    get_user_matches,
    compute_match_score,
)
from routers.auth import get_current_user_id, get_current_user

router = APIRouter(prefix="/api", tags=["api"])


# ── Profiles ──────────────────────────────────────────────────────────────────

@router.get("/profiles/me", response_model=ProfileOut)
async def get_my_profile(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Profile).where(Profile.user_id == user_id))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


@router.put("/profiles/me", response_model=ProfileOut)
async def update_my_profile(
    payload: ProfileUpdate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Profile).where(Profile.user_id == user_id))
    profile = result.scalar_one_or_none()
    if not profile:
        # Create if missing
        profile = Profile(id=str(uuid.uuid4()), user_id=user_id, name=payload.name or "")
        db.add(profile)

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)

    await db.commit()
    await db.refresh(profile)
    return profile


@router.get("/profiles/{user_id}", response_model=ProfileOut)
async def get_profile(
    user_id: str,
    _: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Profile).where(Profile.user_id == user_id))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


# ── Discovery & Matching ──────────────────────────────────────────────────────

@router.get("/suggestions", response_model=List[SuggestionOut])
async def suggestions(
    limit: int = Query(default=20, ge=1, le=100),
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    results = await get_suggestions(db, current_user_id, limit=limit)
    return [
        SuggestionOut(
            user_id=r["user_id"],
            profile=r["profile"],
            score=r["score"],
            score_breakdown=r["score_breakdown"],
        )
        for r in results
    ]


@router.post("/users/{target_id}/action")
async def action_on_user(
    target_id: str,
    payload: MatchActionRequest,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    if target_id == current_user_id:
        raise HTTPException(status_code=400, detail="Cannot act on yourself")

    mutual_match = await record_action(db, current_user_id, target_id, payload.action)
    if mutual_match:
        return {"result": "matched", "match_id": mutual_match.id}
    return {"result": "recorded", "action": payload.action}


@router.get("/matches", response_model=List[MatchOut])
async def list_matches(
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    enriched = await get_user_matches(db, current_user_id)
    out = []
    for e in enriched:
        m = e["match"]
        out.append(
            MatchOut(
                id=m.id,
                user1_id=m.user1_id,
                user2_id=m.user2_id,
                score=m.score,
                status=m.status,
                created_at=m.created_at,
                other_profile=e["other_profile"],
            )
        )
    return out


@router.get("/matches/{match_id}", response_model=MatchOut)
async def get_match(
    match_id: str,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    match = await get_match_for_users(db, match_id, current_user_id)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    other_id = match.user2_id if match.user1_id == current_user_id else match.user1_id
    profile_res = await db.execute(select(Profile).where(Profile.user_id == other_id))
    other_profile = profile_res.scalar_one_or_none()
    return MatchOut(
        id=match.id,
        user1_id=match.user1_id,
        user2_id=match.user2_id,
        score=match.score,
        status=match.status,
        created_at=match.created_at,
        other_profile=other_profile,
    )


# ── Messages ──────────────────────────────────────────────────────────────────

@router.get("/matches/{match_id}/messages", response_model=List[MessageOut])
async def list_messages(
    match_id: str,
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    match = await get_match_for_users(db, match_id, current_user_id)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    await mark_messages_read(db, match_id, current_user_id)
    return await get_messages(db, match_id, limit=limit, offset=offset)


@router.post("/matches/{match_id}/messages", response_model=MessageOut, status_code=201)
async def send_message(
    match_id: str,
    payload: MessageCreate,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    match = await get_match_for_users(db, match_id, current_user_id)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    if match.status != MatchStatus.accepted:
        raise HTTPException(status_code=403, detail="Cannot message — match not accepted")
    return await create_message(db, match_id, current_user_id, payload.content)


# ── Score breakdown ───────────────────────────────────────────────────────────

@router.get("/score/{target_user_id}")
async def score_against(
    target_user_id: str,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    p1_res = await db.execute(select(Profile).where(Profile.user_id == current_user_id))
    p2_res = await db.execute(select(Profile).where(Profile.user_id == target_user_id))
    p1 = p1_res.scalar_one_or_none()
    p2 = p2_res.scalar_one_or_none()
    if not p1 or not p2:
        raise HTTPException(status_code=404, detail="Profile not found")
    score, breakdown = compute_match_score(p1, p2)
    return {"score": score, "breakdown": breakdown}


# ── WebSocket real-time messaging ─────────────────────────────────────────────

class ConnectionManager:
    def __init__(self):
        # match_id → list of (user_id, websocket)
        self.active: dict[str, list[tuple[str, WebSocket]]] = {}

    async def connect(self, match_id: str, user_id: str, ws: WebSocket):
        await ws.accept()
        self.active.setdefault(match_id, []).append((user_id, ws))

    def disconnect(self, match_id: str, user_id: str, ws: WebSocket):
        if match_id in self.active:
            self.active[match_id] = [
                (uid, w) for uid, w in self.active[match_id] if w is not ws
            ]

    async def broadcast(self, match_id: str, data: dict, exclude_ws: Optional[WebSocket] = None):
        for uid, ws in list(self.active.get(match_id, [])):
            if ws is not exclude_ws:
                try:
                    await ws.send_json(data)
                except Exception:
                    pass


manager = ConnectionManager()


@router.websocket("/ws/{match_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    match_id: str,
    token: str = Query(...),
    db: AsyncSession = Depends(get_db),
):
    from services.core import decode_token
    user_id = decode_token(token)
    if not user_id:
        await websocket.close(code=4001)
        return

    match = await get_match_for_users(db, match_id, user_id)
    if not match or match.status != MatchStatus.accepted:
        await websocket.close(code=4003)
        return

    await manager.connect(match_id, user_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            content = (data.get("content") or "").strip()
            if not content:
                continue
            msg = await create_message(db, match_id, user_id, content[:5000])
            payload = {
                "id": msg.id,
                "match_id": msg.match_id,
                "sender_id": msg.sender_id,
                "content": msg.content,
                "is_read": msg.is_read,
                "created_at": msg.created_at.isoformat(),
            }
            # Echo to sender + broadcast to other party
            await websocket.send_json(payload)
            await manager.broadcast(match_id, payload, exclude_ws=websocket)
    except WebSocketDisconnect:
        manager.disconnect(match_id, user_id, websocket)
