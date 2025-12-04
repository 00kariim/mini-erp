from pydantic import BaseModel, Field
from datetime import datetime


class ClaimFileBase(BaseModel):
    """Base claim file schema"""
    file_path: str = Field(..., max_length=500, description="Path to the file (PDF/JPG/PNG)")


class ClaimFileCreate(ClaimFileBase):
    """Schema for creating a new claim file"""
    claim_id: int = Field(..., description="ID of the claim this file belongs to")


class ClaimFileResponse(ClaimFileBase):
    """Schema for claim file response"""
    id: int
    claim_id: int
    uploaded_at: datetime

    class Config:
        from_attributes = True

