from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models import User

router = APIRouter()


@router.get("/users", response_model=List[dict])
async def get_users():
    """
    Get all users.
    
    Returns:
        List of all users in the system
    """
    users = await User.all()
    return [
        {
            "id": user.id,
            "username": user.username,
            "role": user.role,
            "is_active": user.is_active,
            "created_at": user.created_at.isoformat() if user.created_at else None,
        }
        for user in users
    ]


@router.get("/users/{user_id}", response_model=dict)
async def get_user(user_id: int):
    """
    Get a specific user by ID.
    
    Args:
        user_id: The ID of the user to retrieve
    
    Returns:
        User details
    """
    user = await User.get_or_none(id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": user.id,
        "username": user.username,
        "role": user.role,
        "is_active": user.is_active,
        "created_at": user.created_at.isoformat() if user.created_at else None,
    }

