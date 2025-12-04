from tortoise.models import Model
from tortoise import fields
from enum import Enum


class LeadStatus(str, Enum):
    """Lead status enumeration"""
    NEW = "uncontacted"  # Using "uncontacted" to avoid PostgreSQL reserved keywords
    CONTACTED = "contacted"
    QUALIFIED = "qualified"
    CONVERTED = "converted"
    LOST = "lost"


class Lead(Model):
    """
    Lead model representing potential clients or business opportunities.
    Can be assigned to operators for follow-up.
    """
    id = fields.IntField(pk=True, description="Auto-increment primary key")
    first_name = fields.CharField(max_length=100, description="Lead's first name")
    last_name = fields.CharField(max_length=100, description="Lead's last name")
    email = fields.CharField(max_length=100, description="Lead's email address")
    phone = fields.CharField(max_length=20, null=True, description="Lead's phone number")
    status = fields.CharEnumField(
        LeadStatus,
        default=LeadStatus.NEW,
        description="Lead status: 'uncontacted', 'contacted', 'qualified', 'converted', 'lost'"
    )
    assigned_operator = fields.ForeignKeyField(
        "models.User",
        related_name="assigned_leads",
        null=True,
        description="Operator assigned to handle this lead"
    )
    
    # Timestamps
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)
    
    class Meta:
        table = "leads"
    
    def __str__(self):
        return f"Lead(id={self.id}, name={self.first_name} {self.last_name}, status={self.status})"

