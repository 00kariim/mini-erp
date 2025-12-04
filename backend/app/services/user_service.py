from typing import List, Optional
from app.models import User, Role, UserRole, SupervisorOperator
from app.schemas import UserCreate, UserUpdate
from app.auth import get_password_hash, verify_password
from tortoise.exceptions import IntegrityError
from app.services.client_service import ClientService
from app.schemas.client import ClientCreate

class UserService:
    """Service for user-related operations"""

    @staticmethod
    async def create_user(user_data: UserCreate) -> User:
        """Create a new user with roles"""
        password_hash = get_password_hash(user_data.password)
        
        try:
            user = await User.create(
                username=user_data.username,
                email=user_data.email,
                password_hash=password_hash,
                is_active=user_data.is_active
            )
            
            # Assign roles if provided
            if user_data.role_ids:
                roles = await Role.filter(id__in=user_data.role_ids)
                await user.roles.add(*roles)
                if 5 in user_data.role_ids:
                    client_data = ClientCreate(
                        user_id=user.id,
                        full_name=user.username,
                        email=user.email
                    )
                    await ClientService.create_client(client_data)

            # Reload user with roles
            await user.fetch_related("roles")
            return user
        except IntegrityError:
            raise ValueError("Username or email already exists")

    @staticmethod
    async def get_user_by_id(user_id: int) -> Optional[User]:
        """Get user by ID with roles"""
        user = await User.get_or_none(id=user_id)
        if user:
            await user.fetch_related("roles")
        return user

    @staticmethod
    async def get_user_by_username(username: str) -> Optional[User]:
        """Get user by username"""
        return await User.get_or_none(username=username)

    @staticmethod
    async def get_user_by_email(email: str) -> Optional[User]:
        """Get user by email"""
        return await User.get_or_none(email=email)

    @staticmethod
    async def get_all_users(skip: int = 0, limit: int = 100) -> List[User]:
        """Get all users with pagination"""
        users = await User.all().offset(skip).limit(limit).prefetch_related("roles")
        return users

    @staticmethod
    async def update_user(user_id: int, user_data: UserUpdate) -> Optional[User]:
        """Update user information"""
        user = await User.get_or_none(id=user_id)
        if not user:
            return None

        update_data = {}
        if user_data.username is not None:
            update_data["username"] = user_data.username
        if user_data.email is not None:
            update_data["email"] = user_data.email
        if user_data.password is not None:
            update_data["password_hash"] = get_password_hash(user_data.password)
        if user_data.is_active is not None:
            update_data["is_active"] = user_data.is_active

        if update_data:
            await User.filter(id=user_id).update(**update_data)

        # Update roles if provided
        if user_data.role_ids is not None:
            roles = await Role.filter(id__in=user_data.role_ids)
            await user.roles.clear()
            await user.roles.add(*roles)
            if 5 in user_data.role_ids:
                client_data = ClientCreate(
                    user_id=user.id,                        
                    full_name=user.username,
                    email=user.email
                )
                await ClientService.create_client(client_data)

        await user.refresh_from_db()
        await user.fetch_related("roles")
        return user

    @staticmethod
    async def update_password(user_id: int, new_password: str) -> bool:
        """Update user password"""
        password_hash = get_password_hash(new_password)
        updated = await User.filter(id=user_id).update(password_hash=password_hash)
        return updated > 0

    @staticmethod
    async def deactivate_user(user_id: int) -> bool:
        """Deactivate a user"""
        updated = await User.filter(id=user_id).update(is_active=False)
        return updated > 0

    @staticmethod
    async def assign_role(user_id: int, role_id: int) -> bool:
        """Assign a role to a user"""
        user = await User.get_or_none(id=user_id)
        role = await Role.get_or_none(id=role_id)
        
        if not user or not role:
            return False

        await user.roles.add(role)
        return True

    @staticmethod
    async def assign_operator_to_supervisor(supervisor_id: int, operator_id: int) -> bool:
        """Assign an operator to a supervisor"""
        supervisor = await User.get_or_none(id=supervisor_id)
        operator = await User.get_or_none(id=operator_id)
        
        if not supervisor or not operator:
            return False

        # Check if relationship already exists
        existing = await SupervisorOperator.get_or_none(
            supervisor_id=supervisor_id,
            operator_id=operator_id
        )
        if existing:
            return True

        await SupervisorOperator.create(
            supervisor_id=supervisor_id,
            operator_id=operator_id
        )
        return True

    @staticmethod
    async def verify_user_credentials(username: str, password: str) -> Optional[User]:
        """Verify user credentials"""
        user = await User.get_or_none(username=username)
        if not user:
            user = await User.get_or_none(email=username)
        
        if not user or not user.is_active:
            return None

        if not verify_password(password, user.password_hash):
            return None

        await user.fetch_related("roles")
        return user

