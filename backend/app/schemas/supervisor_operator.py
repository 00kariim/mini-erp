from pydantic import BaseModel, Field
from datetime import datetime


class SupervisorOperatorBase(BaseModel):
    """Base supervisor-operator relationship schema"""
    supervisor_id: int = Field(..., description="ID of the supervisor user")
    operator_id: int = Field(..., description="ID of the operator user")


class SupervisorOperatorCreate(SupervisorOperatorBase):
    """Schema for creating a new supervisor-operator relationship"""
    pass


class SupervisorOperatorResponse(SupervisorOperatorBase):
    """Schema for supervisor-operator response"""
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

