from tortoise.models import Model
from tortoise import fields


class ClaimFile(Model):
    """
    Claim file model for storing file attachments related to claims.
    Supports PDF, JPG, PNG and other file types.
    """
    id = fields.IntField(pk=True, description="Auto-increment primary key")
    claim = fields.ForeignKeyField(
        "models.Claim",
        related_name="files",
        description="Claim this file belongs to"
    )
    file_path = fields.CharField(
        max_length=500,
        description="Path to the file (PDF/JPG/PNG)"
    )
    
    # Timestamps
    uploaded_at = fields.DatetimeField(auto_now_add=True, description="When the file was uploaded")
    
    class Meta:
        table = "claim_files"
    
    def __str__(self):
        return f"ClaimFile(id={self.id}, claim_id={self.claim_id}, file_path={self.file_path})"

