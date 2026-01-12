import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    """User model for authentication and profile data."""
    
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=True)  # Nullable for OAuth users
    
    # Profile
    display_name = Column(String(100), nullable=True)
    avatar_url = Column(Text, nullable=True)
    location = Column(String(200), nullable=True)
    bio = Column(Text, nullable=True)
    
    # Onboarding data
    age_range = Column(String(20), nullable=True)
    personality = Column(String(50), nullable=True)
    interests = Column(JSON, default=list)
    onboarding_completed = Column(Boolean, default=False)
    
    # OAuth
    oauth_provider = Column(String(50), nullable=True)  # 'google', 'apple', or null
    oauth_id = Column(String(255), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    created_trips = relationship("Trip", back_populates="creator", foreign_keys="Trip.creator_id")
    trip_memberships = relationship("TripMember", back_populates="user")
    join_requests = relationship("JoinRequest", back_populates="user")
    messages = relationship("Message", back_populates="sender")
    
    def __repr__(self):
        return f"<User {self.email}>"
