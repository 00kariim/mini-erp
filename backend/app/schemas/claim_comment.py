from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class ClaimCommentBase(BaseModel):
    """Base claim comment schema"""
    comment: str = Field(..., description="Comment text")


class ClaimCommentCreate(ClaimCommentBase):
    """Schema for creating a new claim comment"""
    claim_id: int = Field(..., description="ID of the claim this comment belongs to")
    user_id: int = Field(..., description="ID of the user who authored this comment")


class ClaimCommentResponse(ClaimCommentBase):
    """Schema for claim comment response"""
    id: int
    claim_id: int
    user_id: int
    created_at: datetime
    username: Optional[str] = Field(default=None, description="Username of the comment author")

    class Config:
        from_attributes = True

