from pydantic import BaseModel, Field
from datetime import datetime


class ClientCommentBase(BaseModel):
    """Base client comment schema"""
    comment: str = Field(..., description="Comment text")


class ClientCommentCreate(ClientCommentBase):
    """Schema for creating a new client comment"""
    client_id: int = Field(..., description="ID of the client this comment belongs to")
    user_id: int = Field(..., description="ID of the user who authored this comment")


class ClientCommentResponse(ClientCommentBase):
    """Schema for client comment response"""
    id: int
    client_id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

