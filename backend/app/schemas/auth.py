from pydantic import BaseModel, EmailStr
from typing import Optional


class UserRegister(BaseModel):
    """Schema for user registration."""
    email: EmailStr
    password: str
    display_name: Optional[str] = None


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


class Token(BaseModel):
    """Schema for JWT token response."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Schema for decoded token data."""
    user_id: Optional[str] = None
    email: Optional[str] = None


class RefreshToken(BaseModel):
    """Schema for refresh token request."""
    refresh_token: str


class OAuthCallback(BaseModel):
    """Schema for OAuth callback data."""
    code: str
    state: Optional[str] = None
