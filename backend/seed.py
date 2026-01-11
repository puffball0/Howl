"""Seed database with initial data."""
import sys
sys.path.insert(0, '.')

from app.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.trip import Trip
from app.models.trip_member import TripMember
from app.utils.security import get_password_hash
from datetime import datetime
import uuid

def seed_data():
    db = SessionLocal()
    
    # Create tables just in case
    Base.metadata.create_all(bind=engine)
    
    # Check if trips exist
    if db.query(Trip).count() > 0:
        print("Trips already exist. Skipping seed.")
        db.close()
        return

    print("Seeding data...")

    # 1. Create or get "Host" user
    host_user = db.query(User).filter(User.email == "host@howl.app").first()
    if not host_user:
        hashed_pwd = get_password_hash("password123")
        host_user = User(
            email="host@howl.app",
            password_hash=hashed_pwd,
            display_name="Sarah & The Pack",
            avatar_url="https://i.pravatar.cc/150?u=sarah",
            bio="Adventure enthusiast and community builder.",
            location="San Francisco, CA"
        )
        db.add(host_user)
        db.commit()
        db.refresh(host_user)

    # 2. Create some public trips
    trips = [
        {
            "title": "Bali Digital Nomad Retreat",
            "location": "Ubud, Bali",
            "duration": "7 Days",
            "dates": "Oct 12 - 19, 2026",
            "image_url": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
            "description": "Join us for a week of coworking, yoga, and exploring the jungles of Ubud. Perfect for remote workers looking for community.",
            "tags": ["Coworking", "Nature", "Wellness"],
            "max_members": 12,
            "vibe": "Chill / Productive"
        },
        {
            "title": "Swiss Alps Hiking Adventure",
            "location": "Zermatt, Switzerland",
            "duration": "5 Days",
            "dates": "Sep 5 - 10, 2026",
            "image_url": "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=800&q=80",
            "description": "Challenging hikes with breathtaking views of the Matterhorn. For experienced hikers only.",
            "tags": ["Hiking", "Mountains", "Adventure"],
            "max_members": 8,
            "vibe": "Active / Intense"
        },
        {
            "title": "Tokyo City Exploration",
            "location": "Tokyo, Japan",
            "duration": "10 Days",
            "dates": "Nov 1 - 10, 2026",
            "image_url": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
            "description": "Food, tech, and culture in the heart of Tokyo. We'll hit all the major districts and some hidden gems.",
            "tags": ["Culture", "Food", "Urban"],
            "max_members": 6,
            "vibe": "Fast-paced"
        }
    ]

    for t in trips:
        trip = Trip(
            creator_id=host_user.id,
            title=t["title"],
            location=t["location"],
            duration=t["duration"],
            dates=t["dates"],
            image_url=t["image_url"],
            description=t["description"],
            tags=t["tags"],
            max_members=t["max_members"],
            vibe=t["vibe"],
            join_type="instant"
        )
        db.add(trip)
        db.commit()
        db.refresh(trip)
        
        # Add host as member
        member = TripMember(
            trip_id=trip.id,
            user_id=host_user.id,
            role="leader"
        )
        db.add(member)
    
    db.commit()
    print("Seed completed! Created user and trips.")
    db.close()

if __name__ == "__main__":
    seed_data()
