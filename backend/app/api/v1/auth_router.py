from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas import UserLogin
from app.services import UserService
from app.auth import create_access_token
from app.api.dependencies import get_current_active_user
from app.models import User

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login")
async def login(credentials: UserLogin):
    """
    Login endpoint - returns JWT token
    """
    user = await UserService.verify_user_credentials(
        credentials.username,
        credentials.password
    )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "roles": [role.name for role in user.roles]
        }
    }

