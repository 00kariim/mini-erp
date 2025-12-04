from tortoise.models import Model
from tortoise import fields


class ClientProduct(Model):
    """
    Client-Product relationship model.
    Tracks which products are assigned to which clients.
    """
    id = fields.IntField(pk=True, description="Auto-increment primary key")
    client = fields.ForeignKeyField(
        "models.Client",
        related_name="client_products",
        description="Client this product is assigned to"
    )
    product = fields.ForeignKeyField(
        "models.Product",
        related_name="client_assignments",
        description="Product assigned to the client"
    )
    
    # Timestamps
    assigned_at = fields.DatetimeField(auto_now_add=True, description="When the product was assigned")
    
    class Meta:
        table = "client_products"
        unique_together = [("client", "product")]
    
    def __str__(self):
        return f"ClientProduct(client_id={self.client_id}, product_id={self.product_id})"

