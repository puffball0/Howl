from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database import get_db
from app.models.user import User
from app.models.trip import Trip
from app.models.trip_member import TripMember
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/api/calendar", tags=["Calendar"])


@router.get("/events")
async def get_calendar_events(
    month: int = None,
    year: int = 2026,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get calendar events (trips) for the user."""
    # Get all trip memberships
    memberships = db.query(TripMember).filter(TripMember.user_id == current_user.id).all()
    trip_ids = [m.trip_id for m in memberships]
    
    if not trip_ids:
        return []
    
    trips = db.query(Trip).filter(Trip.id.in_(trip_ids)).all()
    
    # Format for calendar
    events = []
    for trip in trips:
        # Parse dates if available (simplified parsing)
        # In production, you'd want proper date parsing
        events.append({
            "id": str(trip.id),
            "title": trip.title,
            "location": trip.location,
            "dates": trip.dates,
            "color": "bg-howl-orange" if events else "bg-blue-500",  # Alternate colors
            "vibe": trip.vibe
        })
    
    return events


@router.get("/trips-by-month")
async def get_trips_by_month(
    month: int,
    year: int = 2026,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get trips for a specific month for calendar display."""
    # Get all user's trips
    memberships = db.query(TripMember).filter(TripMember.user_id == current_user.id).all()
    trip_ids = [m.trip_id for m in memberships]
    
    if not trip_ids:
        return []
    
    trips = db.query(Trip).filter(Trip.id.in_(trip_ids)).all()
    
    # This is a simplified version - in production you'd parse dates properly
    # and only return trips for the requested month
    
    colors = ["bg-howl-orange", "bg-blue-500", "bg-green-500", "bg-purple-500"]
    
    result = []
    for i, trip in enumerate(trips):
        result.append({
            "id": str(trip.id),
            "title": trip.title,
            "location": trip.location,
            "dates": [],  # Would parse from trip.dates
            "month": month,  # Would extract from trip.dates
            "color": colors[i % len(colors)],
            "vibe": trip.vibe
        })
    
    return result
