from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.models.claim import ClaimStatus
from .claim_comment import ClaimCommentResponse


class ClaimBase(BaseModel):
    """Base claim schema with common fields"""
    description: str = Field(..., description="Claim description")
    status: ClaimStatus = Field(ClaimStatus.SUBMITTED, description="Claim status")


class ClaimCreate(ClaimBase):
    """Schema for creating a new claim"""
    client_id: int = Field(..., description="ID of the client who submitted this claim")
    assigned_operator_id: Optional[int] = Field(None, description="ID of the operator assigned to handle this claim")
    assigned_supervisor_id: Optional[int] = Field(None, description="ID of the supervisor assigned to oversee this claim")


class ClaimUpdate(BaseModel):
    """Schema for updating a claim (all fields optional)"""
    description: Optional[str] = Field(None, description="Claim description")
    status: Optional[ClaimStatus] = Field(None, description="Claim status")
    assigned_operator_id: Optional[int] = Field(None, description="ID of the operator assigned to handle this claim")
    assigned_supervisor_id: Optional[int] = Field(None, description="ID of the supervisor assigned to oversee this claim")


class ClaimResponse(ClaimBase):
    """Schema for claim response"""
    id: int
    client_id: int
    assigned_operator_id: Optional[int] = None
    assigned_supervisor_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    comments: Optional[List[ClaimCommentResponse]] = None

    class Config:
        from_attributes = True

