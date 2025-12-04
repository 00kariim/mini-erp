from tortoise.models import Model
from tortoise import fields


class ActivityLog(Model):
    """
    Activity log model for tracking user actions in the system.
    Useful for analytics and audit trails.
    """
    id = fields.IntField(pk=True, description="Auto-increment primary key")
    user = fields.ForeignKeyField(
        "models.User",
        related_name="activity_logs",
        description="User who performed the action"
    )
    action = fields.CharField(
        max_length=200,
        description="Action performed, e.g., 'updated claim', 'converted lead'"
    )
    target_type = fields.CharField(
        max_length=50,
        description="Type of target: 'lead', 'client', 'claim'"
    )
    target_id = fields.IntField(description="ID of the target entity")
    
    # Timestamps
    created_at = fields.DatetimeField(auto_now_add=True)
    
    class Meta:
        table = "activity_logs"
    
    def __str__(self):
        return f"ActivityLog(id={self.id}, user_id={self.user_id}, action={self.action}, target={self.target_type}:{self.target_id})"

