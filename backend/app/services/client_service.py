
from typing import List, Optional
from app.models import Client, ClientProduct, ClientComment, Product, Claim
from app.schemas import ClientCreate, ClientUpdate, ClientCommentCreate, ClientProductCreate


class ClientService:
    """Service for client-related operations"""

    @staticmethod
    async def create_client(client_data: ClientCreate) -> Client:
        """Create a new client"""
        client = await Client.create(
            user_id=client_data.user_id,
            full_name=client_data.full_name,
            email=client_data.email,
            phone=client_data.phone,
            address=client_data.address
        )
        return client

    @staticmethod
    async def get_client_by_id(client_id: int) -> Optional[Client]:
        """Get client by ID"""
        return await Client.get_or_none(id=client_id)

    @staticmethod
    async def get_all_clients(skip: int = 0, limit: int = 100) -> List[Client]:
        """Get all clients with pagination"""
        clients = await Client.all().offset(skip).limit(limit)
        return clients

    @staticmethod
    async def update_client(client_id: int, client_data: ClientUpdate) -> Optional[Client]:
        """Update client information"""
        client = await Client.get_or_none(id=client_id)
        if not client:
            return None

        update_data = {}
        if client_data.full_name is not None:
            update_data["full_name"] = client_data.full_name
        if client_data.email is not None:
            update_data["email"] = client_data.email
        if client_data.phone is not None:
            update_data["phone"] = client_data.phone
        if client_data.address is not None:
            update_data["address"] = client_data.address

        if update_data:
            await Client.filter(id=client_id).update(**update_data)
            await client.refresh_from_db()

        return client

    @staticmethod
    async def assign_product(client_id: int, product_id: int) -> Optional[ClientProduct]:
        """Assign a product to a client"""
        client = await Client.get_or_none(id=client_id)
        product = await Product.get_or_none(id=product_id)
        
        if not client or not product:
            return None

        # Check if already assigned
        existing = await ClientProduct.get_or_none(
            client_id=client_id,
            product_id=product_id
        )
        if existing:
            return existing

        client_product = await ClientProduct.create(
            client_id=client_id,
            product_id=product_id
        )
        return client_product

    @staticmethod
    async def get_client_product(client_id: int, product_id: int) -> Optional[ClientProduct]:
        """Check if a product is assigned to a client"""
        return await ClientProduct.get_or_none(client_id=client_id, product_id=product_id)

    @staticmethod
    async def get_client_products(client_id: int) -> List[ClientProduct]:
        """Get all products assigned to a client"""
        client_products = await ClientProduct.filter(client_id=client_id).prefetch_related("product")
        return client_products

    @staticmethod
    async def add_comment(client_id: int, user_id: int, comment: str) -> ClientComment:
        """Add a comment to a client"""
        comment_obj = await ClientComment.create(
            client_id=client_id,
            user_id=user_id,
            comment=comment
        )
        return comment_obj

    @staticmethod
    async def get_client_comments(client_id: int) -> List[ClientComment]:
        """Get all comments for a client"""
        comments = await ClientComment.filter(client_id=client_id).order_by("-created_at")
        return comments

    @staticmethod
    async def get_client_claims(client_id: int) -> List[Claim]:
        """Get all claims for a client"""
        claims = await Claim.filter(client_id=client_id).order_by("-created_at")
        return claims

