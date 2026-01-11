from fastapi import WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from typing import Dict, List, Set
from uuid import UUID
import json
from datetime import datetime
from app.database import SessionLocal
from app.models.user import User
from app.models.message import Message
from app.models.trip_member import TripMember
from app.utils.security import verify_access_token


class ConnectionManager:
    """Manages WebSocket connections for all chat rooms."""
    
    def __init__(self):
        # Dictionary mapping trip_id to set of connections
        self.active_connections: Dict[str, List[WebSocket]] = {}
        # Dictionary mapping connection to user info
        self.connection_users: Dict[WebSocket, dict] = {}
    
    async def connect(self, websocket: WebSocket, trip_id: str, user_info: dict):
        """Register a new WebSocket connection."""
        # Note: websocket.accept() should be called before calling this
        
        if trip_id not in self.active_connections:
            self.active_connections[trip_id] = []
        
        self.active_connections[trip_id].append(websocket)
        self.connection_users[websocket] = user_info
        
        # Notify others that user joined
        await self.broadcast_to_trip(trip_id, {
            "type": "user_joined",
            "user_id": user_info["user_id"],
            "user_name": user_info["user_name"],
            "timestamp": datetime.utcnow().isoformat()
        }, exclude=websocket)
    
    def disconnect(self, websocket: WebSocket, trip_id: str):
        """Remove a WebSocket connection."""
        if trip_id in self.active_connections:
            if websocket in self.active_connections[trip_id]:
                self.active_connections[trip_id].remove(websocket)
            
            # Clean up empty rooms
            if not self.active_connections[trip_id]:
                del self.active_connections[trip_id]
        
        user_info = self.connection_users.pop(websocket, None)
        return user_info
    
    async def broadcast_to_trip(self, trip_id: str, message: dict, exclude: WebSocket = None):
        """Broadcast a message to all connections in a trip."""
        if trip_id not in self.active_connections:
            return
        
        for connection in self.active_connections[trip_id]:
            if connection != exclude:
                try:
                    await connection.send_json(message)
                except Exception:
                    pass  # Connection might be closed
    
    async def send_personal_message(self, websocket: WebSocket, message: dict):
        """Send a message to a specific connection."""
        await websocket.send_json(message)
    
    def get_online_users(self, trip_id: str) -> List[dict]:
        """Get list of online users in a trip."""
        if trip_id not in self.active_connections:
            return []
        
        users = []
        for conn in self.active_connections[trip_id]:
            if conn in self.connection_users:
                users.append(self.connection_users[conn])
        
        return users


# Global connection manager
manager = ConnectionManager()


async def authenticate_websocket(websocket: WebSocket) -> dict:
    """Authenticate a WebSocket connection using JWT token."""
    try:
        # Try to get token from query params
        token = websocket.query_params.get("token")
        
        if not token:
            # Try to get from first message
            # For this flow, we assume connection is already accepted if we are here via another route
            # But duplicate logic exists in websocket_chat_endpoint
            return None
        
        # Verify token
        payload = verify_access_token(token)
        if not payload:
            return None
        
        # Get user from database
        db = SessionLocal()
        try:
            user_id = payload.get("sub")
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                return None
            
            return {
                "user_id": str(user.id),
                "user_name": user.display_name or user.email,
                "user_avatar": user.avatar_url
            }
        finally:
            db.close()
            
    except Exception as e:
        print(f"WebSocket auth error: {e}")
        return None


async def verify_trip_membership(user_id: str, trip_id: str) -> bool:
    """Verify that a user is a member of a trip."""
    # print(f"Verifying membership for {user_id} in {trip_id}")
    db = SessionLocal()
    try:
        # Cast UUIDs explicitly if needed, but SQLAlchemy mostly handles it
        membership = db.query(TripMember).filter(
            TripMember.trip_id == trip_id,
            TripMember.user_id == user_id
        ).first()
        return membership is not None
    except Exception as e:
        print(f"Membership verification error: {e}")
        return False
    finally:
        db.close()


async def save_message(trip_id: str, user_id: str, content: str) -> dict:
    """Save a message to the database."""
    db = SessionLocal()
    try:
        message = Message(
            trip_id=trip_id,
            sender_id=user_id,
            content=content
        )
        db.add(message)
        db.commit()
        db.refresh(message)
        
        # Get sender info
        user = db.query(User).filter(User.id == user_id).first()
        
        return {
            "id": str(message.id),
            "trip_id": str(message.trip_id),
            "sender_id": str(message.sender_id),
            "sender_name": user.display_name if user else None,
            "sender_avatar": user.avatar_url if user else None,
            "content": message.content,
            "created_at": message.created_at.isoformat()
        }
    except Exception as e:
        print(f"Save message error: {e}")
        raise e
    finally:
        db.close()


async def websocket_chat_endpoint(websocket: WebSocket, trip_id: str):
    """WebSocket endpoint for real-time chat."""
    await websocket.accept()
    
    try:
        # Get token from query params
        token = websocket.query_params.get("token")
        
        if not token:
            print(f"WS Error: No token provided for trip {trip_id}")
            await websocket.close(code=4001, reason="No token provided")
            return
        
        # Verify token
        payload = verify_access_token(token)
        if not payload:
            print(f"WS Error: Invalid token for trip {trip_id}")
            await websocket.close(code=4001, reason="Invalid token")
            return
        
        user_id = payload.get("sub")
        
        # Verify trip membership
        is_member = await verify_trip_membership(user_id, trip_id)
        if not is_member:
            print(f"WS Error: User {user_id} is not member of trip {trip_id}")
            await websocket.close(code=4003, reason="Not a member of this trip")
            return
        
        # Get user info
        db = SessionLocal()
        try:
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                await websocket.close(code=4001, reason="User not found")
                return
                
            user_info = {
                "user_id": str(user.id),
                "user_name": user.display_name or user.email,
                "user_avatar": user.avatar_url
            }
        finally:
            db.close()
        
        # Connect
        await manager.connect(websocket, trip_id, user_info)
        
        # Send current online users
        online_users = manager.get_online_users(trip_id)
        await manager.send_personal_message(websocket, {
            "type": "online_users",
            "users": online_users
        })
        
        try:
            while True:
                # Receive message
                data = await websocket.receive_json()
                msg_type = data.get("type", "message")
                
                if msg_type == "message":
                    content = data.get("content", "").strip()
                    if content:
                        # Save to database
                        saved_msg = await save_message(trip_id, user_id, content)
                        
                        # Broadcast to all in room
                        await manager.broadcast_to_trip(trip_id, {
                            "type": "message",
                            **saved_msg
                        })
                
                elif msg_type == "typing":
                    # Broadcast typing indicator
                    await manager.broadcast_to_trip(trip_id, {
                        "type": "typing",
                        "user_id": user_info["user_id"],
                        "user_name": user_info["user_name"]
                    }, exclude=websocket)
                
                elif msg_type == "stop_typing":
                    await manager.broadcast_to_trip(trip_id, {
                        "type": "stop_typing",
                        "user_id": user_info["user_id"]
                    }, exclude=websocket)
        
        except WebSocketDisconnect:
            user_info = manager.disconnect(websocket, trip_id)
            if user_info:
                await manager.broadcast_to_trip(trip_id, {
                    "type": "user_left",
                    "user_id": user_info["user_id"],
                    "user_name": user_info["user_name"],
                    "timestamp": datetime.utcnow().isoformat()
                })
                
    except Exception as e:
        print(f"WebSocket unhandled error: {e}")
        try:
            await websocket.close(code=1011) # Internal error
        except:
            pass
