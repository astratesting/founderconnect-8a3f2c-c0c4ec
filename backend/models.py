import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, Text, Enum as SAEnum, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import ARRAY as PG_ARRAY
from sqlalchemy import JSON
import enum

from database import Base


class MatchStatus(str, enum.Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"


class MatchAction(str, enum.Enum):
    like = "like"
    pass_ = "pass"


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    hashed_password: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    clerk_id: Mapped[Optional[str]] = mapped_column(String, unique=True, nullable=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    profile: Mapped[Optional["Profile"]] = relationship("Profile", back_populates="user", uselist=False)
    sent_messages: Mapped[List["Message"]] = relationship("Message", back_populates="sender")
    match_history: Mapped[List["MatchHistory"]] = relationship("MatchHistory", back_populates="user")


class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    bio: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    avatar_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    location: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    linkedin_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    github_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    # Stored as JSON arrays (compatible with SQLite and Postgres)
    skills: Mapped[Optional[list]] = mapped_column(JSON, default=list)
    interests: Mapped[Optional[list]] = mapped_column(JSON, default=list)
    looking_for: Mapped[Optional[list]] = mapped_column(JSON, default=list)

    industry: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    experience_years: Mapped[int] = mapped_column(Integer, default=0)
    role_type: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # technical/business/hybrid
    startup_idea: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    stage: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # idea/mvp/seed/growth

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user: Mapped["User"] = relationship("User", back_populates="profile")


class Match(Base):
    __tablename__ = "matches"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user1_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"), nullable=False, index=True)
    user2_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"), nullable=False, index=True)
    score: Mapped[float] = mapped_column(Float, default=0.0)
    status: Mapped[MatchStatus] = mapped_column(SAEnum(MatchStatus), default=MatchStatus.pending)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    messages: Mapped[List["Message"]] = relationship("Message", back_populates="match")


class Message(Base):
    __tablename__ = "messages"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    match_id: Mapped[str] = mapped_column(String, ForeignKey("matches.id"), nullable=False, index=True)
    sender_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    match: Mapped["Match"] = relationship("Match", back_populates="messages")
    sender: Mapped["User"] = relationship("User", back_populates="sent_messages")


class MatchHistory(Base):
    __tablename__ = "match_history"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"), nullable=False, index=True)
    target_user_id: Mapped[str] = mapped_column(String, nullable=False)
    action: Mapped[MatchAction] = mapped_column(SAEnum(MatchAction), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped["User"] = relationship("User", back_populates="match_history")


# ── Pydantic schemas ──────────────────────────────────────────────────────────

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    name: str = Field(min_length=1, max_length=100)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str


class ProfileBase(BaseModel):
    name: str
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    location: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    skills: List[str] = []
    interests: List[str] = []
    looking_for: List[str] = []
    industry: Optional[str] = None
    experience_years: int = 0
    role_type: Optional[str] = None
    startup_idea: Optional[str] = None
    stage: Optional[str] = None


class ProfileCreate(ProfileBase):
    pass


class ProfileUpdate(ProfileBase):
    name: Optional[str] = None


class ProfileOut(ProfileBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserOut(BaseModel):
    id: str
    email: str
    created_at: datetime
    profile: Optional[ProfileOut] = None

    class Config:
        from_attributes = True


class MatchOut(BaseModel):
    id: str
    user1_id: str
    user2_id: str
    score: float
    status: MatchStatus
    created_at: datetime
    other_profile: Optional[ProfileOut] = None

    class Config:
        from_attributes = True


class MessageCreate(BaseModel):
    content: str = Field(min_length=1, max_length=5000)


class MessageOut(BaseModel):
    id: str
    match_id: str
    sender_id: str
    content: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


class MatchActionRequest(BaseModel):
    action: str = Field(pattern="^(like|pass)$")


class SuggestionOut(BaseModel):
    user_id: str
    profile: ProfileOut
    score: float
    score_breakdown: dict
