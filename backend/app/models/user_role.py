from tortoise.models import Model
from tortoise import fields


class UserRole(Model):
    """
    User-Role many-to-many relationship model.
    Maps users to their roles in the system.
    """
    id = fields.IntField(pk=True, description="Auto-increment primary key")
    user = fields.ForeignKeyField(
        "models.User",
        related_name="user_role_relations",
        description="User in this relationship"
    )
    role = fields.ForeignKeyField(
        "models.Role",
        related_name="user_role_relations",
        description="Role assigned to the user"
    )
    
    # Timestamps
    created_at = fields.DatetimeField(auto_now_add=True)
    
    class Meta:
        table = "user_roles"
        unique_together = [("user", "role")]
    
    def __str__(self):
        return f"UserRole(user_id={self.user_id}, role_id={self.role_id})"

