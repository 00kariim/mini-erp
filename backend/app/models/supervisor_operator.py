from tortoise.models import Model
from tortoise import fields


class SupervisorOperator(Model):
    """
    Supervisor-Operator relationship model.
    Binds operators to supervisors for management purposes.
    Supervisor must have Supervisor role, Operator must have Operator role.
    """
    id = fields.IntField(pk=True, description="Auto-increment primary key")
    supervisor = fields.ForeignKeyField(
        "models.User",
        related_name="supervised_operators",
        description="Supervisor user (must have Supervisor role)"
    )
    operator = fields.ForeignKeyField(
        "models.User",
        related_name="assigned_supervisor",
        description="Operator user (must have Operator role)"
    )
    
    # Timestamps
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)
    
    class Meta:
        table = "supervisor_operator"
        unique_together = [("supervisor", "operator")]
    
    def __str__(self):
        return f"SupervisorOperator(supervisor_id={self.supervisor_id}, operator_id={self.operator_id})"

