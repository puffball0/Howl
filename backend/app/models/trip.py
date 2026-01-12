import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class Trip(Base):
    """Trip/Pack model for adventure trips."""
    
    __tablename__ = "trips"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    creator_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Basic info
    title = Column(String(200), nullable=False)
    location = Column(String(200), nullable=False)
    duration = Column(String(50), nullable=True)
    dates = Column(String(100), nullable=True)
    max_members = Column(Integer, default=8)
    image_url = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    
    # Restrictions
    age_limit = Column(String(50), default="All Ages")
    gender = Column(String(50), default="All Genders")
    vibe = Column(String(100), nullable=True)
    join_type = Column(String(20), default="instant")  # 'instant' or 'request'
    
    # Tags for filtering
    tags = Column(JSON, default=list)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    creator = relationship("User", back_populates="created_trips", foreign_keys=[creator_id])
    members = relationship("TripMember", back_populates="trip", cascade="all, delete-orphan")
    plans = relationship("TripPlan", back_populates="trip", cascade="all, delete-orphan", order_by="TripPlan.order")
    join_requests = relationship("JoinRequest", back_populates="trip", cascade="all, delete-orphan")
    messages = relationship("Message", back_populates="trip", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Trip {self.title}>"
