from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime


class ClientBase(BaseModel):
    """Base client schema with common fields"""
    full_name: str = Field(..., max_length=200, description="Client's full name")
    email: EmailStr = Field(..., description="Client's email address")
    phone: Optional[str] = Field(None, max_length=20, description="Client's phone number")
    address: Optional[str] = Field(None, description="Client's address")


class ClientCreate(ClientBase):
    """Schema for creating a new client"""
    user_id: int = Field(..., description="ID of the user account linked to this client")


class ClientUpdate(BaseModel):
    """Schema for updating a client (all fields optional)"""
    full_name: Optional[str] = Field(None, max_length=200, description="Client's full name")
    email: Optional[EmailStr] = Field(None, description="Client's email address")
    phone: Optional[str] = Field(None, max_length=20, description="Client's phone number")
    address: Optional[str] = Field(None, description="Client's address")


class ClientResponse(ClientBase):
    """Schema for client response"""
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

