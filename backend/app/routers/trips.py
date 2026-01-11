from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from app.database import get_db
from app.models.user import User
from app.models.trip import Trip
from app.models.trip_member import TripMember
from app.models.trip_plan import TripPlan
from app.models.join_request import JoinRequest
from app.schemas.trip import (
    TripCreate, TripUpdate, TripDetail, TripList, 
    TripPlanResponse, MemberInfo, LeaderInfo, TripRestrictions,
    JoinRequestResponse
)
from app.utils.dependencies import get_current_user, get_optional_user

router = APIRouter(prefix="/api/trips", tags=["Trips"])


@router.get("/", response_model=List[TripList])
async def list_trips(
    search: Optional[str] = None,
    tags: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """List all trips with optional search and filtering."""
    query = db.query(Trip)
    
    if search:
        query = query.filter(
            (Trip.title.ilike(f"%{search}%")) | 
            (Trip.location.ilike(f"%{search}%"))
        )
    
    trips = query.offset(skip).limit(limit).all()
    
    result = []
    for trip in trips:
        member_count = db.query(TripMember).filter(TripMember.trip_id == trip.id).count()
        is_member = False
        if current_user:
            is_member = db.query(TripMember).filter(
                TripMember.trip_id == trip.id,
                TripMember.user_id == current_user.id
            ).first() is not None
            
        result.append(TripList(
            id=trip.id,
            title=trip.title,
            location=trip.location,
            duration=trip.duration,
            image_url=trip.image_url,
            tags=trip.tags or [],
            member_count=member_count,
            max_members=trip.max_members,
            is_member=is_member
        ))
    
    return result


@router.get("/suggested", response_model=List[TripList])
async def get_suggested_trips(
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get personalized trip suggestions based on user profile, interests, and past behavior.
    Uses a weighted scoring algorithm to rank trips.
    """
    # 1. Get all candidates (future trips, excluding ones user created or joined)
    # real-world optimization: filter by date > now
    all_trips = db.query(Trip).all()
    
    # Get user's joined trip IDs to exclude
    joined_trip_ids = [m.trip_id for m in db.query(TripMember).filter(TripMember.user_id == current_user.id).all()]
    
    candidates = []
    
    # User profile vectors
    user_interests = set([i.lower() for i in (current_user.interests or [])])
    user_personality = (current_user.personality or "").lower()
    user_location = (current_user.location or "").lower()
    
    for trip in all_trips:
        # Skip if already joined or created
        # Skip if already joined (we still want to skip joined, but maybe show created for now so you can see the sorting?)
        # Actually, let's keep hiding joined, but show created so you can verify the location sort even if you made the trips.
        if trip.id in joined_trip_ids: # or trip.creator_id == current_user.id:
            continue
            
        # Critical Data Integrity Check: Skip trips that are missing required fields
        # This prevents 422 errors if the DB has partial/junk data
        if not trip.title or not trip.location or trip.max_members is None:
            continue
            
        score = 0
        
        # Factor 1: Tag Overlap (High Weight)
        trip_tags = set([t.lower() for t in (trip.tags or [])])
        overlap = user_interests.intersection(trip_tags)
        score += len(overlap) * 10
        
        # Factor 2: Vibe/Personality Match (Medium Weight)
        trip_vibe = (trip.vibe or "").lower()
        if user_personality and trip_vibe:
            if user_personality in trip_vibe or trip_vibe in user_personality:
                score += 15
        
        # Factor 3: Location Proximity/Relevance (Low Weight)
        # Simple string match for now
        trip_loc = (trip.location or "").lower()
        if user_location and (user_location in trip_loc or trip_loc in user_location):
             # Boost local trips significantly as requested
             score += 30
             
        # Factor 4: Popularity (Tie-breaker)
        member_count = db.query(TripMember).filter(TripMember.trip_id == trip.id).count()
        score += member_count * 2
        
        candidates.append({
            "trip": trip,
            "score": score,
            "member_count": member_count
        })
    
    # Sort by score descending
    candidates.sort(key=lambda x: x["score"], reverse=True)
    
    # Return top N
    result = []
    for item in candidates[:limit]:
        trip = item["trip"]
        result.append(TripList(
            id=trip.id,
            title=trip.title or "Untitled Trip",
            location=trip.location or "Unknown Location",
            duration=trip.duration,
            image_url=trip.image_url,
            tags=trip.tags or [],
            member_count=item["member_count"],
            max_members=trip.max_members or 8,
            is_member=False
        ))
        
    return result


@router.post("/", response_model=TripDetail)
async def create_trip(
    trip_data: TripCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new trip."""
    # Create trip
    new_trip = Trip(
        creator_id=current_user.id,
        title=trip_data.title,
        location=trip_data.location,
        duration=trip_data.duration,
        dates=trip_data.dates,
        max_members=trip_data.max_members,
        image_url=trip_data.image_url,
        description=trip_data.description,
        age_limit=trip_data.age_limit,
        gender=trip_data.gender,
        vibe=trip_data.vibe,
        join_type=trip_data.join_type,
        tags=trip_data.tags
    )
    
    db.add(new_trip)
    db.commit()
    db.refresh(new_trip)
    
    # Add creator as leader
    leader_member = TripMember(
        trip_id=new_trip.id,
        user_id=current_user.id,
        role="leader"
    )
    db.add(leader_member)
    
    # Add trip plans if provided
    for i, plan in enumerate(trip_data.plans or []):
        trip_plan = TripPlan(
            trip_id=new_trip.id,
            day_range=plan.day_range,
            title=plan.title,
            detail=plan.detail,
            order=plan.order or i
        )
        db.add(trip_plan)
    
    db.commit()
    db.refresh(new_trip)
    
    return await get_trip_detail(new_trip.id, current_user, db)


@router.get("/{trip_id}", response_model=TripDetail)
async def get_trip_detail(
    trip_id: UUID,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """Get detailed trip information."""
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    # Get members
    members_query = db.query(TripMember, User).join(User).filter(TripMember.trip_id == trip_id).all()
    
    members = []
    leader = None
    is_member = False
    is_leader = False
    
    for membership, user in members_query:
        member_info = MemberInfo(
            id=user.id,
            display_name=user.display_name,
            avatar_url=user.avatar_url,
            role=membership.role
        )
        
        if membership.role == "leader":
            leader = LeaderInfo(
                name=user.display_name or user.email,
                avatar=user.avatar_url
            )
        
        members.append(member_info)
        
        if current_user and user.id == current_user.id:
            is_member = True
            if membership.role == "leader":
                is_leader = True
    
    # Get plans
    plans = db.query(TripPlan).filter(TripPlan.trip_id == trip_id).order_by(TripPlan.order).all()
    plans_response = [TripPlanResponse(
        id=p.id,
        day_range=p.day_range,
        title=p.title,
        detail=p.detail,
        order=p.order
    ) for p in plans]
    
    return TripDetail(
        id=trip.id,
        title=trip.title,
        location=trip.location,
        duration=trip.duration,
        dates=trip.dates,
        max_members=trip.max_members,
        image_url=trip.image_url,
        description=trip.description,
        tags=trip.tags or [],
        plans=plans_response,
        members=members,
        leader=leader,
        restrictions=TripRestrictions(
            ageLimit=trip.age_limit,
            gender=trip.gender,
            vibe=trip.vibe,
            joinType=trip.join_type
        ),
        member_count=len(members),
        is_member=is_member,
        is_leader=is_leader,
        created_at=trip.created_at
    )


@router.put("/{trip_id}", response_model=TripDetail)
async def update_trip(
    trip_id: UUID,
    trip_data: TripUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a trip (leader only)."""
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    # Check if user is the creator
    if trip.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the trip leader can update this trip")
    
    update_dict = trip_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(trip, key, value)
    
    db.commit()
    db.refresh(trip)
    
    return await get_trip_detail(trip_id, current_user, db)


@router.delete("/{trip_id}")
async def delete_trip(
    trip_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a trip (leader only)."""
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    if trip.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the trip leader can delete this trip")
    
    db.delete(trip)
    db.commit()
    
    return {"message": "Trip deleted successfully"}


@router.post("/{trip_id}/join")
async def join_trip(
    trip_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Join a trip or request to join."""
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    # Check if already a member
    existing_member = db.query(TripMember).filter(
        TripMember.trip_id == trip_id,
        TripMember.user_id == current_user.id
    ).first()
    
    if existing_member:
        raise HTTPException(status_code=400, detail="Already a member of this trip")
    
    # Check member count
    member_count = db.query(TripMember).filter(TripMember.trip_id == trip_id).count()
    if member_count >= trip.max_members:
        raise HTTPException(status_code=400, detail="Trip is full")
    
    if trip.join_type == "instant":
        # Instant join
        new_member = TripMember(
            trip_id=trip_id,
            user_id=current_user.id,
            role="member"
        )
        db.add(new_member)
        db.commit()
        
        return {"status": "joined", "message": "Successfully joined the trip"}
    else:
        # Request to join
        existing_request = db.query(JoinRequest).filter(
            JoinRequest.trip_id == trip_id,
            JoinRequest.user_id == current_user.id,
            JoinRequest.status == "pending"
        ).first()
        
        if existing_request:
            raise HTTPException(status_code=400, detail="Request already pending")
        
        new_request = JoinRequest(
            trip_id=trip_id,
            user_id=current_user.id,
            status="pending"
        )
        db.add(new_request)
        db.commit()
        
        return {"status": "requested", "message": "Join request sent"}


@router.get("/{trip_id}/requests", response_model=List[JoinRequestResponse])
async def get_join_requests(
    trip_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get pending join requests (leader only)."""
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    if trip.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the trip leader can view requests")
    
    requests = db.query(JoinRequest, User).join(User).filter(
        JoinRequest.trip_id == trip_id,
        JoinRequest.status == "pending"
    ).all()
    
    return [JoinRequestResponse(
        id=req.id,
        user_id=user.id,
        user_name=user.display_name,
        user_avatar=user.avatar_url,
        status=req.status,
        created_at=req.created_at
    ) for req, user in requests]


@router.post("/{trip_id}/requests/{request_id}/approve")
async def approve_request(
    trip_id: UUID,
    request_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Approve a join request (leader only)."""
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    
    if not trip or trip.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    join_request = db.query(JoinRequest).filter(JoinRequest.id == request_id).first()
    
    if not join_request or join_request.trip_id != trip_id:
        raise HTTPException(status_code=404, detail="Request not found")
    
    # Add as member
    new_member = TripMember(
        trip_id=trip_id,
        user_id=join_request.user_id,
        role="member"
    )
    db.add(new_member)
    
    # Update request status
    join_request.status = "approved"
    db.commit()
    
    return {"message": "Request approved"}


@router.post("/{trip_id}/requests/{request_id}/reject")
async def reject_request(
    trip_id: UUID,
    request_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Reject a join request (leader only)."""
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    
    if not trip or trip.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    join_request = db.query(JoinRequest).filter(JoinRequest.id == request_id).first()
    
    if not join_request or join_request.trip_id != trip_id:
        raise HTTPException(status_code=404, detail="Request not found")
    
    join_request.status = "rejected"
    db.commit()
    
    return {"message": "Request rejected"}


@router.get("/{trip_id}/members")
async def get_trip_members(
    trip_id: UUID,
    db: Session = Depends(get_db)
):
    """Get all members of a trip."""
    members = db.query(TripMember, User).join(User).filter(TripMember.trip_id == trip_id).all()
    
    return [
        {
            "id": str(user.id),
            "name": user.display_name or user.email,
            "avatar": user.avatar_url,
            "role": membership.role
        }
        for membership, user in members
    ]


@router.delete("/{trip_id}/members/{user_id}")
async def remove_member(
    trip_id: UUID,
    user_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove a member from trip (leader only, or self-leave)."""
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    # Allow self-removal or leader removal
    if current_user.id != user_id and trip.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Don't allow leader to remove themselves
    if user_id == trip.creator_id:
        raise HTTPException(status_code=400, detail="Leader cannot be removed")
    
    membership = db.query(TripMember).filter(
        TripMember.trip_id == trip_id,
        TripMember.user_id == user_id
    ).first()
    
    if not membership:
        raise HTTPException(status_code=404, detail="Member not found")
    
    db.delete(membership)
    db.commit()
    
    return {"message": "Member removed"}


@router.get("/search/similar")
async def search_similar_trips(
    destination: str,
    db: Session = Depends(get_db)
):
    """Search for similar trips by destination."""
    trips = db.query(Trip).filter(Trip.location.ilike(f"%{destination}%")).limit(5).all()
    
    result = []
    for trip in trips:
        member_count = db.query(TripMember).filter(TripMember.trip_id == trip.id).count()
        result.append({
            "id": str(trip.id),
            "title": trip.title,
            "location": trip.location,
            "date": trip.dates,
            "groupSize": f"{member_count}/{trip.max_members}",
            "restrictions": f"{trip.age_limit}, {trip.vibe}",
            "image": trip.image_url
        })
    
    return result
