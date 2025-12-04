from typing import List, Optional
from decimal import Decimal
from app.models import Product
from app.schemas import ProductCreate, ProductUpdate


class ProductService:
    """Service for product-related operations"""

    @staticmethod
    async def create_product(product_data: ProductCreate) -> Product:
        """Create a new product"""
        product = await Product.create(
            name=product_data.name,
            type=product_data.type,
            description=product_data.description,
            price=product_data.price
        )
        return product

    @staticmethod
    async def get_product_by_id(product_id: int) -> Optional[Product]:
        """Get product by ID"""
        return await Product.get_or_none(id=product_id)

    @staticmethod
    async def get_all_products(skip: int = 0, limit: int = 100) -> List[Product]:
        """Get all products with pagination"""
        products = await Product.all().offset(skip).limit(limit)
        return products

    @staticmethod
    async def update_product(product_id: int, product_data: ProductUpdate) -> Optional[Product]:
        """Update product information"""
        product = await Product.get_or_none(id=product_id)
        if not product:
            return None

        update_data = {}
        if product_data.name is not None:
            update_data["name"] = product_data.name
        if product_data.type is not None:
            update_data["type"] = product_data.type
        if product_data.description is not None:
            update_data["description"] = product_data.description
        if product_data.price is not None:
            update_data["price"] = product_data.price

        if update_data:
            await Product.filter(id=product_id).update(**update_data)
            await product.refresh_from_db()

        return product

    @staticmethod
    async def delete_product(product_id: int) -> bool:
        """Delete a product"""
        deleted = await Product.filter(id=product_id).delete()
        return deleted > 0

