from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.trip import Trip
from app.models.trip_member import TripMember
from app.models.message import Message
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/api/groups", tags=["Groups"])


@router.get("/")
async def get_my_groups(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all groups/packs the user is a member of."""
    # Get all trip memberships
    memberships = db.query(TripMember).filter(TripMember.user_id == current_user.id).all()
    trip_ids = [m.trip_id for m in memberships]
    
    if not trip_ids:
        return []
    
    trips = db.query(Trip).filter(Trip.id.in_(trip_ids)).all()
    
    result = []
    for trip in trips:
        # Get member count
        member_count = db.query(TripMember).filter(TripMember.trip_id == trip.id).count()
        
        # Get last message
        last_message = db.query(Message, User).join(User, Message.sender_id == User.id).filter(
            Message.trip_id == trip.id
        ).order_by(Message.created_at.desc()).first()
        
        last_msg_text = None
        last_msg_time = None
        
        if last_message:
            msg, sender = last_message
            sender_name = sender.display_name or "Someone"
            last_msg_text = f"{sender_name}: {msg.content[:50]}..."
            last_msg_time = msg.created_at.strftime("%I:%M %p")
        
        # Count unread messages (simplified - just show if there are recent messages)
        unread = 0
        if last_message:
            msg, _ = last_message
            # In a real app, you'd track last read timestamp
            unread = 0
        
        result.append({
            "id": str(trip.id),
            "title": trip.title,
            "location": trip.location,
            "members": f"{member_count} Members",
            "lastMessage": last_msg_text or "No messages yet",
            "time": last_msg_time or "",
            "unread": unread,
            "image": trip.image_url or "/images/trip-beach.png"
        })
    
    return result


@router.get("/{trip_id}")
async def get_group_details(
    trip_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get group details for chat header."""
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    
    if not trip:
        return {"error": "Trip not found"}
    
    member_count = db.query(TripMember).filter(TripMember.trip_id == trip_id).count()
    
    return {
        "id": str(trip.id),
        "title": trip.title,
        "location": trip.location,
        "member_count": member_count,
        "image": trip.image_url,
        "created_at": trip.created_at.isoformat()
    }
