from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database import get_db
from app.models.user import User
from app.models.trip import Trip
from app.models.trip_member import TripMember
from app.models.join_request import JoinRequest
from app.schemas.user import UserProfile, UserUpdate, UserOnboarding
from app.schemas.trip import TripList
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.get("/me", response_model=UserProfile)
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Get current user's profile."""
    return UserProfile(
        id=current_user.id,
        email=current_user.email,
        display_name=current_user.display_name,
        avatar_url=current_user.avatar_url,
        location=current_user.location,
        bio=current_user.bio,
        age_range=current_user.age_range,
        personality=current_user.personality,
        interests=current_user.interests or [],
        onboarding_completed=current_user.onboarding_completed,
        created_at=current_user.created_at
    )


@router.put("/me", response_model=UserProfile)
async def update_profile(
    update_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user's profile."""
    update_dict = update_data.model_dump(exclude_unset=True)
    
    for key, value in update_dict.items():
        setattr(current_user, key, value)
    
    db.commit()
    db.refresh(current_user)
    
    return UserProfile(
        id=current_user.id,
        email=current_user.email,
        display_name=current_user.display_name,
        avatar_url=current_user.avatar_url,
        location=current_user.location,
        bio=current_user.bio,
        age_range=current_user.age_range,
        personality=current_user.personality,
        interests=current_user.interests or [],
        onboarding_completed=current_user.onboarding_completed,
        created_at=current_user.created_at
    )


@router.post("/me/onboarding", response_model=UserProfile)
async def complete_onboarding(
    onboarding_data: UserOnboarding,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Complete user onboarding."""
    current_user.display_name = onboarding_data.display_name
    current_user.age_range = onboarding_data.age_range
    current_user.location = onboarding_data.location
    current_user.personality = onboarding_data.personality
    current_user.interests = onboarding_data.interests
    current_user.onboarding_completed = True
    
    db.commit()
    db.refresh(current_user)
    
    return UserProfile(
        id=current_user.id,
        email=current_user.email,
        display_name=current_user.display_name,
        avatar_url=current_user.avatar_url,
        location=current_user.location,
        bio=current_user.bio,
        age_range=current_user.age_range,
        personality=current_user.personality,
        interests=current_user.interests or [],
        onboarding_completed=current_user.onboarding_completed,
        created_at=current_user.created_at
    )


@router.get("/me/trips")
async def get_my_trips(
    status: str = "all",  # 'upcoming', 'pending', 'past', 'all'
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's trips categorized by status."""
    now = datetime.utcnow()
    
    # Get all trips user is a member of
    memberships = db.query(TripMember).filter(TripMember.user_id == current_user.id).all()
    trip_ids = [m.trip_id for m in memberships]
    
    trips = db.query(Trip).filter(Trip.id.in_(trip_ids)).all() if trip_ids else []
    
    # Get pending join requests
    pending_requests = db.query(JoinRequest).filter(
        JoinRequest.user_id == current_user.id,
        JoinRequest.status == "pending"
    ).all()
    pending_trip_ids = [r.trip_id for r in pending_requests]
    pending_trips = db.query(Trip).filter(Trip.id.in_(pending_trip_ids)).all() if pending_trip_ids else []
    
    def format_trip(trip, trip_status):
        member_count = db.query(TripMember).filter(TripMember.trip_id == trip.id).count()
        return {
            "id": str(trip.id),
            "title": trip.title,
            "location": trip.location,
            "date": trip.dates or "",
            "image_url": trip.image_url or "/images/trip-beach.png",
            "status": trip_status,
            "member_count": member_count
        }
    
    result = {
        "upcoming": [format_trip(t, "Confirmed") for t in trips],
        "pending": [format_trip(t, "Waiting Approval") for t in pending_trips],
        "past": []  # Would need proper date parsing to determine past trips
    }
    
    return result
    
    
from fastapi import File, UploadFile
import shutil
import os
from app.config import get_settings

settings = get_settings()

@router.post("/me/avatar", response_model=UserProfile)
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload user avatar image."""
    # Ensure uploads directory exists
    os.makedirs("uploads", exist_ok=True)
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    filename = f"{current_user.id}_{int(datetime.utcnow().timestamp())}{file_extension}"
    file_path = f"uploads/{filename}"
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Update user profile
    # Construct full URL
    base_url = settings.backend_url # e.g. http://localhost:8000
    avatar_url = f"{base_url}/static/{filename}"
    
    current_user.avatar_url = avatar_url
    db.commit()
    db.refresh(current_user)
    
    return UserProfile(
        id=current_user.id,
        email=current_user.email,
        display_name=current_user.display_name,
        avatar_url=current_user.avatar_url,
        location=current_user.location,
        bio=current_user.bio,
        age_range=current_user.age_range,
        personality=current_user.personality,
        interests=current_user.interests or [],
        onboarding_completed=current_user.onboarding_completed,
        created_at=current_user.created_at
    )
