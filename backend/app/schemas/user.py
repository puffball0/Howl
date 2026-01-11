from pydantic import BaseModel, EmailStr
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class UserBase(BaseModel):
    """Base user schema."""
    email: EmailStr
    display_name: Optional[str] = None


class UserCreate(UserBase):
    """Schema for creating a user."""
    password: str


class UserUpdate(BaseModel):
    """Schema for updating user profile."""
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    personality: Optional[str] = None
    interests: Optional[List[str]] = None


class UserOnboarding(BaseModel):
    """Schema for completing onboarding."""
    display_name: str
    age_range: str
    location: str
    personality: str
    interests: List[str]


class UserProfile(BaseModel):
    """Schema for user profile response."""
    id: UUID
    email: EmailStr
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    age_range: Optional[str] = None
    personality: Optional[str] = None
    interests: List[str] = []
    onboarding_completed: bool = False
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserPublic(BaseModel):
    """Schema for public user info (e.g., trip members)."""
    id: UUID
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    
    class Config:
        from_attributes = True
