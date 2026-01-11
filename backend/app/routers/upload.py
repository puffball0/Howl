from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os
import uuid
from app.config import get_settings

router = APIRouter(prefix="/api", tags=["Upload"])
settings = get_settings()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload a file and get the public URL."""
    try:
        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1]
        filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, filename)

        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Return public URL
        # Assuming static files are mounted at /static
        # and served from the uploads directory
        # The frontend can construct the full URL if needed, or we return relative
        return {"url": f"{settings.backend_url}/static/{filename}"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not upload file: {str(e)}")
