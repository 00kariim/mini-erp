from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.models.lead import LeadStatus
from .lead_comment import LeadCommentResponse


class LeadBase(BaseModel):
    """Base lead schema with common fields"""
    first_name: str = Field(..., max_length=100, description="Lead's first name")
    last_name: str = Field(..., max_length=100, description="Lead's last name")
    email: str = Field(..., max_length=100, description="Lead's email address")
    phone: Optional[str] = Field(None, max_length=20, description="Lead's phone number")
    status: LeadStatus = Field(LeadStatus.NEW, description="Lead status")


class LeadCreate(LeadBase):
    """Schema for creating a new lead"""
    assigned_operator_id: Optional[int] = Field(None, description="ID of the operator assigned to this lead")


class LeadUpdate(BaseModel):
    """Schema for updating a lead (all fields optional)"""
    first_name: Optional[str] = Field(None, max_length=100, description="Lead's first name")
    last_name: Optional[str] = Field(None, max_length=100, description="Lead's last name")
    email: Optional[str] = Field(None, max_length=100, description="Lead's email address")
    phone: Optional[str] = Field(None, max_length=20, description="Lead's phone number")
    status: Optional[LeadStatus] = Field(None, description="Lead status")
    assigned_operator_id: Optional[int] = Field(None, description="ID of the operator assigned to this lead")


class LeadResponse(LeadBase):
    """Schema for lead response"""
    id: int
    assigned_operator_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    comments: Optional[List[LeadCommentResponse]] = None

    class Config:
        from_attributes = True

