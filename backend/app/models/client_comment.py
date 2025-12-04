from tortoise.models import Model
from tortoise import fields


class ClientComment(Model):
    """
    Client comment model for tracking comments on clients.
    Each comment is associated with a client and authored by a user.
    """
    id = fields.IntField(pk=True, description="Auto-increment primary key")
    client = fields.ForeignKeyField(
        "models.Client",
        related_name="comments",
        description="Client this comment belongs to"
    )
    user = fields.ForeignKeyField(
        "models.User",
        related_name="client_comments",
        description="User who authored this comment"
    )
    comment = fields.TextField(description="Comment text")
    
    # Timestamps
    created_at = fields.DatetimeField(auto_now_add=True)
    
    class Meta:
        table = "client_comments"
    
    def __str__(self):
        return f"ClientComment(id={self.id}, client_id={self.client_id}, user_id={self.user_id})"

