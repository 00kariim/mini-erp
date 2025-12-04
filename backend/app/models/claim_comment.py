from tortoise.models import Model
from tortoise import fields


class ClaimComment(Model):
    """
    Claim comment model for tracking comments on claims.
    Each comment is associated with a claim and authored by a user.
    """
    id = fields.IntField(pk=True, description="Auto-increment primary key")
    claim = fields.ForeignKeyField(
        "models.Claim",
        related_name="comments",
        description="Claim this comment belongs to"
    )
    user = fields.ForeignKeyField(
        "models.User",
        related_name="claim_comments",
        description="User who authored this comment"
    )
    comment = fields.TextField(description="Comment text")
    
    # Timestamps
    created_at = fields.DatetimeField(auto_now_add=True)
    
    class Meta:
        table = "claim_comments"
    
    def __str__(self):
        return f"ClaimComment(id={self.id}, claim_id={self.claim_id}, user_id={self.user_id})"

