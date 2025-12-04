from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class RoleBase(BaseModel):
    """Base role schema with common fields"""
    name: str = Field(..., max_length=50, description="Role name")
    description: Optional[str] = Field(None, description="Optional description of the role")


class RoleCreate(RoleBase):
    """Schema for creating a new role"""
    pass


class RoleUpdate(BaseModel):
    """Schema for updating a role (all fields optional)"""
    name: Optional[str] = Field(None, max_length=50, description="Role name")
    description: Optional[str] = Field(None, description="Optional description of the role")


class RoleResponse(RoleBase):
    """Schema for role response"""
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

