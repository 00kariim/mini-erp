from tortoise.models import Model
from tortoise import fields


class Role(Model):
    """
    Role model representing user roles in the system.
    Roles: Admin, Supervisor, Operator, Client
    """
    id = fields.IntField(pk=True, description="Auto-increment primary key")
    name = fields.CharField(
        max_length=50,
        unique=True,
        description="Role name: 'Admin', 'Supervisor', 'Operator', 'Client'"
    )
    description = fields.TextField(
        null=True,
        description="Optional description of the role"
    )
    
    # Timestamps
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)
    
    class Meta:
        table = "roles"
    
    def __str__(self):
        return f"Role(id={self.id}, name={self.name})"

