from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from app.models import User, Role
from app.auth import decode_access_token
from app.services import UserService

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> User:
    """Get current authenticated user from JWT token"""
    token = credentials.credentials
    payload = decode_access_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id_str: Optional[str] = payload.get("sub")
    if user_id_str is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )
    
    try:
        user_id = int(user_id_str)
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user ID in token",
        )

    user = await UserService.get_user_by_id(user_id)
    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )
    
    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Get current active user"""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is inactive"
        )
    return current_user


async def require_admin(
    current_user: User = Depends(get_current_active_user)
) -> User:
    """Require admin role"""
    await current_user.fetch_related("roles")
    role_names = [role.name.lower() for role in current_user.roles]
    
    if "admin" not in role_names:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


async def require_admin_or_operator(
    current_user: User = Depends(get_current_active_user)
) -> User:
    """Require admin, operator, or supervisor role"""
    await current_user.fetch_related("roles")
    role_names = [role.name.lower() for role in current_user.roles]
    
    if (
        "admin" not in role_names
        and "operator" not in role_names
        and "supervisor" not in role_names
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin, Operator, or Supervisor access required"
        )
    return current_user


async def require_supervisor_or_admin(
    current_user: User = Depends(get_current_active_user)
) -> User:
    """Require supervisor or admin role"""
    await current_user.fetch_related("roles")
    role_names = [role.name.lower() for role in current_user.roles]
    
    if "admin" not in role_names and "supervisor" not in role_names:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Supervisor or Admin access required"
        )
    return current_user

