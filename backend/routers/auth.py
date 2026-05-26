from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import UserCreate, UserLogin, TokenResponse, UserOut
from services.core import (
    create_user,
    get_user_by_email,
    get_user_by_id,
    verify_password,
    create_access_token,
    decode_token,
)

router = APIRouter(prefix="/auth", tags=["auth"])
bearer_scheme = HTTPBearer()


async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> str:
    user_id = decode_token(credentials.credentials)
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    return user_id


async def get_current_user(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    user = await get_user_by_id(db, user_id)
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: UserCreate, db: AsyncSession = Depends(get_db)):
    existing = await get_user_by_email(db, payload.email)
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
    user = await create_user(db, payload.email, payload.password, payload.name)
    token = create_access_token(user.id)
    return TokenResponse(access_token=token, user_id=user.id)


@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLogin, db: AsyncSession = Depends(get_db)):
    user = await get_user_by_email(db, payload.email)
    if not user or not user.hashed_password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token(user.id)
    return TokenResponse(access_token=token, user_id=user.id)


@router.get("/me", response_model=UserOut)
async def me(user=Depends(get_current_user)):
    return user
