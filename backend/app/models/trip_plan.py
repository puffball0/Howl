import uuid
from sqlalchemy import Column, String, Integer, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class TripPlan(Base):
    """Trip plan/itinerary items."""
    
    __tablename__ = "trip_plans"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trip_id = Column(UUID(as_uuid=True), ForeignKey("trips.id", ondelete="CASCADE"), nullable=False)
    
    # Plan details
    day_range = Column(String(20), nullable=False)  # e.g., "1-2", "3-5"
    title = Column(String(200), nullable=False)
    detail = Column(Text, nullable=True)
    order = Column(Integer, default=0)
    
    # Relationships
    trip = relationship("Trip", back_populates="plans")
    
    def __repr__(self):
        return f"<TripPlan Day {self.day_range}: {self.title}>"
