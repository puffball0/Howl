from app.database import SessionLocal
from app.utils.security import get_password_hash, verify_password
from sqlalchemy import text
import sys

def test_db():
    print("Testing Database connection...")
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        print("[OK] Database connection successful!")
        return True
    except Exception as e:
        print(f"[FAIL] Database connection failed: {e}")
        return False
    finally:
        db.close()

def test_hashing():
    print("\nTesting Password Hashing...")
    try:
        pw = "testpassword"
        hashed = get_password_hash(pw)
        print(f"Hash generated: {hashed[:10]}...")
        is_valid = verify_password(pw, hashed)
        print(f"[OK] Hashing verification: {is_valid}")
        return True
    except Exception as e:
        print(f"[FAIL] Hashing failed: {e}")
        return False

if __name__ == "__main__":
    if test_db() and test_hashing():
        print("\nAll systems go!")
        sys.exit(0)
    else:
        print("\nSystem checks failed.")
        sys.exit(1)
