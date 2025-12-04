from pydantic import BaseModel, Field
from typing import Optional
from decimal import Decimal
from datetime import datetime


class ProductBase(BaseModel):
    """Base product schema with common fields"""
    name: str = Field(..., max_length=200, description="Product name")
    type: str = Field(..., max_length=50, description="Product type")
    description: Optional[str] = Field(None, description="Product description")
    price: Optional[Decimal] = Field(None, description="Product price")


class ProductCreate(ProductBase):
    """Schema for creating a new product"""
    pass


class ProductUpdate(BaseModel):
    """Schema for updating a product (all fields optional)"""
    name: Optional[str] = Field(None, max_length=200, description="Product name")
    type: Optional[str] = Field(None, max_length=50, description="Product type")
    description: Optional[str] = Field(None, description="Product description")
    price: Optional[Decimal] = Field(None, description="Product price")


class ProductResponse(ProductBase):
    """Schema for product response"""
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

