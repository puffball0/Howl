from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class MessageCreate(BaseModel):
    """Schema for creating a message."""
    content: str


class MessageResponse(BaseModel):
    """Schema for message response."""
    id: UUID
    trip_id: UUID
    sender_id: UUID
    sender_name: Optional[str] = None
    sender_avatar: Optional[str] = None
    content: str
    created_at: datetime
    is_me: bool = False
    
    class Config:
        from_attributes = True


class MessageList(BaseModel):
    """Schema for list of messages."""
    messages: List[MessageResponse]
    total: int


class WebSocketMessage(BaseModel):
    """Schema for WebSocket messages."""
    type: str  # 'message', 'join', 'leave', 'typing'
    content: Optional[str] = None
    user_id: Optional[str] = None
    user_name: Optional[str] = None
