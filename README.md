# Howl
> **Stop wandering alone. Find your pack.**

**[Explore Howl Live](https://howlyourpack.vercel.app)**

Howl is an adventure trip-planning application designed to help travelers find their perfect "pack" and coordinate adventurous journeys.

**Features:**
- **Trip Exploration**: Discover curated trips or create your own with custom join requirements.
- **Real-time Coordination**: Integrated WebSocket-based group chats for every trip.
- **Adventure Timeline**: Visual calendar integration to track your upcoming migrations.
- **Personalized Matching:** Weighted algorithm suggests trips aligned with your travel personality.
- **Collaborative Planning:** Shared itineraries, interactive calendars, and trip-specific restrictions (age, gender, vibe).
- **Trip Hub:** Multi-day itineraries, custom restrictions, and a dedicated workspace for each adventure.
- **Adventure Calendar:** Unified view of upcoming trips to manage schedules and overlaps.


## Running the Project
### 1. Database Setup
Ensure you have **PostgreSQL** installed and running.
```powershell
# Create the database
psql -U postgres -c "CREATE DATABASE howl;"
# Move into backend directory
cd backend
# Run migrations to create tables
alembic upgrade head
# (Optional) Seed the database with initial data
python seed.py
```

### 2. Running the Backend 
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Start the server
python main.py
```

### 3. Running the Frontend
Open a new terminal:
```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

## Tech Stack
### Frontend
- **Framework**: React
- **Core**: TypeScript, Tailwind CSS
- **Motion**: Framer Motion transitions
- **Icons**: Lucide React
### Backend
- **Framework** FastAPI (Python)
- **Database**: PostgreSQL 
- **Sync**: Real-time WebSockets for live communication
