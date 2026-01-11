from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import get_settings

settings = get_settings()

# Fix SQLAlchemy compatibility with some providers (like Render/Neon) 
# and handle common copy-paste errors (whitespace, quotes)
database_url = settings.database_url

if database_url:
    database_url = database_url.strip().strip('"').strip("'")
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)

print(f"DEBUG: Connecting to DB URL starting with: {database_url[:15] if database_url else 'None'}...")

if not database_url:
    # Fail gracefully-ish or use sqlite for memory? No, must fail but with clear message.
    print("ERROR: Database URL is empty or None!")
    # We fallback to the default default if empty string is passed effectively
    database_url = "postgresql://postgres:password@localhost:5432/howl"

# Create database engine
try:
    engine = create_engine(
        database_url,
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20,
        pool_recycle=300
    )
except Exception as e:
    print(f"CRITICAL DB ERROR: {e}")
    raise e

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()


def get_db():
    """Dependency to get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
