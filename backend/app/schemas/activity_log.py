from pydantic import BaseModel, Field
from datetime import datetime


class ActivityLogBase(BaseModel):
    """Base activity log schema"""
    action: str = Field(..., max_length=200, description="Action performed")
    target_type: str = Field(..., max_length=50, description="Type of target: 'lead', 'client', 'claim'")
    target_id: int = Field(..., description="ID of the target entity")


class ActivityLogCreate(ActivityLogBase):
    """Schema for creating a new activity log"""
    user_id: int = Field(..., description="ID of the user who performed the action")


class ActivityLogResponse(ActivityLogBase):
    """Schema for activity log response"""
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

