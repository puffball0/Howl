from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.database import get_db
from app.models.user import User
from app.models.message import Message
from app.models.trip import Trip
from app.models.trip_member import TripMember
from app.schemas.message import MessageCreate, MessageResponse, MessageList
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/api/messages", tags=["Messages"])


@router.get("/trips/{trip_id}", response_model=MessageList)
async def get_trip_messages(
    trip_id: UUID,
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get message history for a trip (must be a member)."""
    # Check if user is a member
    membership = db.query(TripMember).filter(
        TripMember.trip_id == trip_id,
        TripMember.user_id == current_user.id
    ).first()
    
    if not membership:
        raise HTTPException(status_code=403, detail="Not a member of this trip")
    
    # Get messages
    messages_query = db.query(Message, User).join(User, Message.sender_id == User.id).filter(
        Message.trip_id == trip_id
    ).order_by(Message.created_at.asc())
    
    total = messages_query.count()
    messages = messages_query.offset(skip).limit(limit).all()
    
    result = []
    for msg, sender in messages:
        result.append(MessageResponse(
            id=msg.id,
            trip_id=msg.trip_id,
            sender_id=msg.sender_id,
            sender_name=sender.display_name,
            sender_avatar=sender.avatar_url,
            content=msg.content,
            created_at=msg.created_at,
            is_me=msg.sender_id == current_user.id
        ))
    
    return MessageList(messages=result, total=total)


@router.post("/trips/{trip_id}", response_model=MessageResponse)
async def send_message(
    trip_id: UUID,
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send a message to trip chat (fallback for non-WebSocket)."""
    # Check if user is a member
    membership = db.query(TripMember).filter(
        TripMember.trip_id == trip_id,
        TripMember.user_id == current_user.id
    ).first()
    
    if not membership:
        raise HTTPException(status_code=403, detail="Not a member of this trip")
    
    # Create message
    new_message = Message(
        trip_id=trip_id,
        sender_id=current_user.id,
        content=message_data.content
    )
    
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    
    return MessageResponse(
        id=new_message.id,
        trip_id=new_message.trip_id,
        sender_id=new_message.sender_id,
        sender_name=current_user.display_name,
        sender_avatar=current_user.avatar_url,
        content=new_message.content,
        created_at=new_message.created_at,
        is_me=True
    )
