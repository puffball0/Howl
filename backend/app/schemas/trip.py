from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class TripPlanCreate(BaseModel):
    """Schema for creating a trip plan item."""
    day_range: str
    title: str
    detail: Optional[str] = None
    order: int = 0


class TripPlanResponse(BaseModel):
    """Schema for trip plan response."""
    id: UUID
    day_range: str
    title: str
    detail: Optional[str] = None
    order: int
    
    class Config:
        from_attributes = True


class TripBase(BaseModel):
    """Base trip schema."""
    title: str
    location: str
    duration: Optional[str] = None
    dates: Optional[str] = None
    max_members: int = 8
    image_url: Optional[str] = None
    description: Optional[str] = None
    age_limit: str = "All Ages"
    gender: str = "All Genders"
    vibe: Optional[str] = None
    join_type: str = "instant"
    tags: List[str] = []


class TripCreate(TripBase):
    """Schema for creating a trip."""
    plans: Optional[List[TripPlanCreate]] = []


class TripUpdate(BaseModel):
    """Schema for updating a trip."""
    title: Optional[str] = None
    location: Optional[str] = None
    duration: Optional[str] = None
    dates: Optional[str] = None
    max_members: Optional[int] = None
    image_url: Optional[str] = None
    description: Optional[str] = None
    age_limit: Optional[str] = None
    gender: Optional[str] = None
    vibe: Optional[str] = None
    join_type: Optional[str] = None
    tags: Optional[List[str]] = None


class MemberInfo(BaseModel):
    """Schema for trip member info."""
    id: UUID
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    role: str = "member"
    
    class Config:
        from_attributes = True


class LeaderInfo(BaseModel):
    """Schema for trip leader info."""
    name: str
    avatar: Optional[str] = None


class TripRestrictions(BaseModel):
    """Schema for trip restrictions."""
    ageLimit: str
    gender: str
    vibe: Optional[str] = None
    joinType: str


class TripList(BaseModel):
    """Schema for trip list item."""
    id: UUID
    title: str
    location: str
    duration: Optional[str] = None
    image_url: Optional[str] = None
    tags: List[str] = []
    member_count: int = 0
    max_members: int = 8
    is_member: bool = False
    
    class Config:
        from_attributes = True


class TripDetail(BaseModel):
    """Schema for detailed trip response."""
    id: UUID
    title: str
    location: str
    duration: Optional[str] = None
    dates: Optional[str] = None
    max_members: int
    image_url: Optional[str] = None
    description: Optional[str] = None
    tags: List[str] = []
    plans: List[TripPlanResponse] = []
    members: List[MemberInfo] = []
    leader: Optional[LeaderInfo] = None
    restrictions: TripRestrictions
    member_count: int = 0
    is_member: bool = False
    is_leader: bool = False
    created_at: datetime
    
    class Config:
        from_attributes = True


class JoinRequestCreate(BaseModel):
    """Schema for join request."""
    message: Optional[str] = None


class JoinRequestResponse(BaseModel):
    """Schema for join request response."""
    id: UUID
    user_id: UUID
    user_name: Optional[str] = None
    user_avatar: Optional[str] = None
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True
