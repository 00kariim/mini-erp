from tortoise.models import Model
from tortoise import fields


class Product(Model):
    """
    Product/Service model representing products or services offered.
    Can be assigned to clients through the client_products relationship.
    """
    id = fields.IntField(pk=True, description="Auto-increment primary key")
    name = fields.CharField(max_length=200, description="Product name")
    type = fields.CharField(
        max_length=50,
        description="Product type: e.g., 'Insurance', 'Real Estate', 'Service'"
    )
    description = fields.TextField(
        null=True,
        description="Product description"
    )
    price = fields.DecimalField(
        max_digits=15,
        decimal_places=2,
        null=True,
        description="Product price"
    )
    
    # Timestamps
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)
    
    class Meta:
        table = "products"
    
    def __str__(self):
        return f"Product(id={self.id}, name={self.name}, type={self.type})"

