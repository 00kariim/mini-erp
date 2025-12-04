from __future__ import annotations

from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
from .role import RoleResponse


class UserBase(BaseModel):
    """Base user schema with common fields"""
    username: str = Field(..., max_length=50, description="Unique username")
    email: EmailStr = Field(..., description="Unique email address")
    is_active: bool = Field(True, description="Whether the user account is active")


class UserCreate(UserBase):
    """Schema for creating a new user"""
    password: str = Field(..., min_length=6, description="User password (will be hashed)")
    role_ids: Optional[List[int]] = Field(default=[], description="List of role IDs to assign to the user")


class UserUpdate(BaseModel):
    """Schema for updating a user (all fields optional)"""
    username: Optional[str] = Field(None, max_length=50, description="Unique username")
    email: Optional[EmailStr] = Field(None, description="Unique email address")
    password: Optional[str] = Field(None, min_length=6, description="User password (will be hashed)")
    is_active: Optional[bool] = Field(None, description="Whether the user account is active")
    role_ids: Optional[List[int]] = Field(None, description="List of role IDs to assign to the user")


class UserResponse(UserBase):
    """Schema for user response"""
    id: int
    created_at: datetime
    updated_at: datetime
    roles: Optional[List[RoleResponse]] = Field(default=[], description="User roles")

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    """Schema for user login"""
    username: str = Field(..., description="Username or email")
    password: str = Field(..., description="User password")

