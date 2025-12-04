from tortoise.models import Model
from tortoise import fields


class User(Model):
    """
    User model representing all users in the system.
    Users can have multiple roles through the user_roles many-to-many relationship.
    """
    id = fields.IntField(pk=True, description="Auto-increment primary key")
    username = fields.CharField(
        max_length=50,
        unique=True,
        description="Unique username"
    )
    email = fields.CharField(
        max_length=100,
        unique=True,
        description="Unique email address"
    )
    password_hash = fields.CharField(
        max_length=255,
        description="Hashed password"
    )
    is_active = fields.BooleanField(
        default=True,
        description="Whether the user account is active"
    )
    
    # Many-to-many relationship with roles
    roles = fields.ManyToManyField(
        "models.Role",
        related_name="users",
        through="models.UserRole",
        description="User roles (many-to-many)"
    )
    
    # Timestamps
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)
    
    class Meta:
        table = "users"
    
    def __str__(self):
        return f"User(id={self.id}, username={self.username}, email={self.email})"

