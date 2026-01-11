import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class JoinRequest(Base):
    """Join request for trips that require approval."""
    
    __tablename__ = "join_requests"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trip_id = Column(UUID(as_uuid=True), ForeignKey("trips.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Status: 'pending', 'approved', 'rejected'
    status = Column(String(20), default="pending")
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    trip = relationship("Trip", back_populates="join_requests")
    user = relationship("User", back_populates="join_requests")
    
    def __repr__(self):
        return f"<JoinRequest {self.user_id} for {self.trip_id}: {self.status}>"
