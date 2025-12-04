from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas import (
    UserCreate, UserUpdate, UserResponse, RoleResponse
)
from app.services import UserService
from app.api.dependencies import (
    get_current_active_user, require_admin, require_admin_or_operator,
    require_supervisor_or_admin
)
from app.models import User
from pydantic import BaseModel

router = APIRouter(prefix="/users", tags=["Users"])


class PasswordUpdate(BaseModel):
    password: str


class RoleAssign(BaseModel):
    user_id: int
    role_id: int


class AssignOperator(BaseModel):
    operator_id: int


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_data: UserCreate,
    current_user: User = Depends(require_admin)
):
    """Create new user (admin only)"""
    try:
        user = await UserService.create_user(user_data)
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("", response_model=List[UserResponse])
async def list_users(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(require_supervisor_or_admin)
):
    """List users (admin and supervisor)"""
    users = await UserService.get_all_users(skip=skip, limit=limit)
    return users


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    current_user: User = Depends(get_current_active_user)
):
    """Get user detail"""
    user = await UserService.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_data: UserUpdate,
    current_user: User = Depends(get_current_active_user)
):
    """Update user info"""
    # Users can only update themselves unless they're admin
    await current_user.fetch_related("roles")
    role_names = [role.name.lower() for role in current_user.roles]
    is_admin = "admin" in role_names
    
    if not is_admin and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own profile"
        )
    
    user = await UserService.update_user(user_id, user_data)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user


@router.patch("/{user_id}/password")
async def reset_password(
    user_id: int,
    password_data: PasswordUpdate,
    current_user: User = Depends(get_current_active_user)
):
    """Reset password"""
    # Users can only change their own password unless they're admin
    await current_user.fetch_related("roles")
    role_names = [role.name.lower() for role in current_user.roles]
    is_admin = "admin" in role_names
    
    if not is_admin and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only change your own password"
        )
    
    success = await UserService.update_password(user_id, password_data.password)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return {"message": "Password updated successfully"}


@router.delete("/{user_id}")
async def deactivate_user(
    user_id: int,
    current_user: User = Depends(require_admin)
):
    """Deactivate user (admin only)"""
    success = await UserService.deactivate_user(user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return {"message": "User deactivated successfully"}


@router.post("/roles/assign")
async def assign_role(
    role_data: RoleAssign,
    current_user: User = Depends(require_admin)
):
    """Assign role to user (admin only)"""
    success = await UserService.assign_role(
        role_data.user_id,
        role_data.role_id
    )
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to assign role. User or role not found."
        )
    return {"message": "Role assigned successfully"}


@router.post("/supervisor/{supervisor_id}/assign-operator")
async def assign_operator_to_supervisor(
    supervisor_id: int,
    operator_data: AssignOperator,
    current_user: User = Depends(require_admin)
):
    """Bind operators to supervisor (admin only)"""
    success = await UserService.assign_operator_to_supervisor(
        supervisor_id,
        operator_data.operator_id
    )
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to assign operator. Supervisor or operator not found."
        )
    return {"message": "Operator assigned to supervisor successfully"}

