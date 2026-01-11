# Howl Backend

FastAPI backend for the Howl adventure trip-planning application.

## Features

- 🔐 **Authentication**: JWT-based auth with email/password and Google OAuth
- 👤 **User Profiles**: Complete profile management with onboarding flow
- 🗺️ **Trips**: Create, search, join, and manage adventure trips
- 👥 **Groups**: Pack management with member roles
- 💬 **Real-time Chat**: WebSocket-based group messaging
- 📅 **Calendar**: Trip timeline visualization

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Auth**: JWT (python-jose) + OAuth (authlib)
- **Real-time**: WebSockets
- **Migrations**: Alembic

## Setup

### Prerequisites

- Python 3.10+
- PostgreSQL 13+

### Installation

1. Create a virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Linux/Mac
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create `.env` file (copy from `.env.example`):
```bash
copy .env.example .env
```

4. Update `.env` with your database credentials:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/howl
JWT_SECRET_KEY=your-secret-key
```

5. Create the database:
```bash
# In PostgreSQL
CREATE DATABASE howl;
```

6. Run the server:
```bash
python main.py
# or
uvicorn main:app --reload
```

## API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/google` - Google OAuth login

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update profile
- `POST /api/users/me/onboarding` - Complete onboarding
- `GET /api/users/me/trips` - Get user's trips

### Trips
- `GET /api/trips` - List/search trips
- `POST /api/trips` - Create trip
- `GET /api/trips/{id}` - Get trip details
- `POST /api/trips/{id}/join` - Join trip

### Groups & Chat
- `GET /api/groups` - Get user's groups
- `GET /api/messages/trips/{id}` - Get chat history
- `WS /ws/chat/{trip_id}` - WebSocket chat

### Calendar
- `GET /api/calendar/events` - Get calendar events

## WebSocket Usage

```javascript
const ws = new WebSocket(`ws://localhost:8000/ws/chat/${tripId}?token=${accessToken}`);

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Message:', data);
};

// Send message
ws.send(JSON.stringify({
  type: 'message',
  content: 'Hello pack!'
}));
```
