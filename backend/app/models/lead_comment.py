from tortoise.models import Model
from tortoise import fields


class LeadComment(Model):
    """
    Lead comment model for tracking comments on leads.
    Each comment is associated with a lead and authored by a user.
    """
    id = fields.IntField(pk=True, description="Auto-increment primary key")
    lead = fields.ForeignKeyField(
        "models.Lead",
        related_name="comments",
        description="Lead this comment belongs to"
    )
    user = fields.ForeignKeyField(
        "models.User",
        related_name="lead_comments",
        description="User who authored this comment"
    )
    comment = fields.TextField(description="Comment text")
    
    # Timestamps
    created_at = fields.DatetimeField(auto_now_add=True)
    
    class Meta:
        table = "lead_comments"
    
    def __str__(self):
        return f"LeadComment(id={self.id}, lead_id={self.lead_id}, user_id={self.user_id})"

