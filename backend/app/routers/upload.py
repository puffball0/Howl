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
    """Upload a file and get the base64 URL (for serverless compatibility)."""
    try:
        # Read file content
        content = await file.read()
        
        # Encode to base64
        import base64
        encoded_string = base64.b64encode(content).decode("utf-8")
        
        # Create data URI
        # Default to image/jpeg if not detected, but UploadFile usually has content_type
        content_type = file.content_type or "image/jpeg"
        data_uri = f"data:{content_type};base64,{encoded_string}"

        return {"url": data_uri}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not process file: {str(e)}")
