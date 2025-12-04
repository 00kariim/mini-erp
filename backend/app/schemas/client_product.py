from pydantic import BaseModel, Field
from datetime import datetime


class ClientProductBase(BaseModel):
    """Base client-product relationship schema"""
    client_id: int = Field(..., description="ID of the client")
    product_id: int = Field(..., description="ID of the product")


class ClientProductCreate(ClientProductBase):
    """Schema for creating a new client-product relationship"""
    pass


class ClientProductResponse(ClientProductBase):
    """Schema for client-product response"""
    id: int
    assigned_at: datetime

    class Config:
        from_attributes = True

