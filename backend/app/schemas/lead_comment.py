from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class LeadCommentBase(BaseModel):
    """Base lead comment schema"""
    comment: str = Field(..., description="Comment text")


class LeadCommentCreate(LeadCommentBase):
    """Schema for creating a new lead comment"""
    lead_id: int = Field(..., description="ID of the lead this comment belongs to")
    user_id: int = Field(..., description="ID of the user who authored this comment")


class LeadCommentResponse(LeadCommentBase):
    """Schema for lead comment response"""
    id: int
    lead_id: int
    user_id: int
    created_at: datetime
    username: Optional[str] = Field(default=None, description="Username of the comment author")

    class Config:
        from_attributes = True

