from tortoise.models import Model
from tortoise import fields


class Client(Model):
    """
    Client model representing confirmed clients.
    Must link to a user with Client role.
    """
    id = fields.IntField(pk=True, description="Auto-increment primary key")
    user = fields.OneToOneField(
        "models.User",
        related_name="client_profile",
        on_delete=fields.CASCADE,
        description="User account linked to this client (must have Client role)"
    )
    full_name = fields.CharField(max_length=200, description="Client's full name")
    email = fields.CharField(max_length=100, description="Client's email address")
    phone = fields.CharField(max_length=20, null=True, description="Client's phone number")
    address = fields.TextField(null=True, description="Client's address")
    
    # Timestamps
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)
    
    class Meta:
        table = "clients"
    
    def __str__(self):
        return f"Client(id={self.id}, full_name={self.full_name}, user_id={self.user_id})"

