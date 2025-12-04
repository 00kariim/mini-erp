from tortoise.models import Model
from tortoise import fields
from enum import Enum


class ClaimStatus(str, Enum):
    """Claim status enumeration"""
    SUBMITTED = "submitted"
    IN_REVIEW = "in_review"
    RESOLVED = "resolved"


class Claim(Model):
    """
    Claim model representing client claims or requests.
    Each claim belongs to a specific client and can be assigned to operators or supervisors.
    """
    id = fields.IntField(pk=True, description="Auto-increment primary key")
    client = fields.ForeignKeyField(
        "models.Client",
        related_name="claims",
        description="Client who submitted this claim"
    )
    assigned_operator = fields.ForeignKeyField(
        "models.User",
        related_name="assigned_claims_operator",
        null=True,
        description="Operator assigned to handle this claim"
    )
    assigned_supervisor = fields.ForeignKeyField(
        "models.User",
        related_name="assigned_claims_supervisor",
        null=True,
        description="Supervisor assigned to oversee this claim"
    )
    status = fields.CharEnumField(
        ClaimStatus,
        default=ClaimStatus.SUBMITTED,
        description="Claim status: 'submitted', 'in_review', 'resolved'"
    )
    description = fields.TextField(description="Claim description")
    
    # Timestamps
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)
    
    class Meta:
        table = "claims"
    
    def __str__(self):
        return f"Claim(id={self.id}, client_id={self.client_id}, status={self.status})"

