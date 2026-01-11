"""Test registration endpoint directly."""
import sys
sys.path.insert(0, '.')

from app.database import SessionLocal
from app.models.user import User
from app.utils.security import get_password_hash, create_access_token, create_refresh_token

def test_register():
    print("Testing full registration flow...")
    
    db = SessionLocal()
    try:
        # 1. Check if test user exists and delete
        existing = db.query(User).filter(User.email == "test@example.com").first()
        if existing:
            db.delete(existing)
            db.commit()
            print("Deleted existing test user")
        
        # 2. Hash password
        print("Hashing password...")
        hashed = get_password_hash("testpassword")
        print(f"Hash: {hashed[:20]}...")
        
        # 3. Create user
        print("Creating user...")
        new_user = User(
            email="test@example.com",
            password_hash=hashed,
            display_name="Test User"
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        print(f"User created with ID: {new_user.id}")
        
        # 4. Generate tokens
        print("Generating tokens...")
        access_token = create_access_token(data={"sub": str(new_user.id), "email": new_user.email})
        refresh_token = create_refresh_token(data={"sub": str(new_user.id)})
        print(f"Access token: {access_token[:30]}...")
        print(f"Refresh token: {refresh_token[:30]}...")
        
        print("\n[OK] Registration flow works!")
        return True
        
    except Exception as e:
        print(f"\n[FAIL] Error: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    success = test_register()
    sys.exit(0 if success else 1)
