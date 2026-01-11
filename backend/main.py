from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import get_settings
from app.database import engine, Base
from app.routers import auth_router, users_router, trips_router, messages_router, groups_router, calendar_router
from app.websocket.chat import websocket_chat_endpoint

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events."""
    # Startup: Create database tables
    Base.metadata.create_all(bind=engine)
    print("Howl Backend Started!")
    print(f"API Docs: {settings.backend_url}/docs")
    yield
    # Shutdown
    print("Howl Backend Shutting Down...")


# Create FastAPI application
app = FastAPI(
    title="Howl API",
    description="Backend API for Howl - Adventure Trip Planning App",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow ALL origins for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
from fastapi.staticfiles import StaticFiles
import os

# Create uploads directory if not exists
os.makedirs("uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="uploads"), name="static")

# Include routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(trips_router)
app.include_router(messages_router)
app.include_router(groups_router)
app.include_router(calendar_router)


# WebSocket endpoint for real-time chat
@app.websocket("/ws/chat/{trip_id}")
async def websocket_endpoint(websocket: WebSocket, trip_id: str):
    try:
        await websocket_chat_endpoint(websocket, trip_id)
    except Exception as e:
        # print(f"WS: Error in main endpoint: {e}")
        pass


# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "app": "Howl API", "version": "1.0.0"}


# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to Howl API",
        "docs": "/docs",
        "health": "/health"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
