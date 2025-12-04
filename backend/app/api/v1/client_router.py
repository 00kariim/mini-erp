from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List
from app.schemas import (
    ClientResponse, ClientProductCreate, ClientProductResponse,
    ClientCommentCreate, ClientCommentResponse, ClaimResponse
)
from app.services import ClientService, ProductService
from app.api.dependencies import get_current_active_user, require_admin
from app.models import User
from pydantic import BaseModel

router = APIRouter(prefix="/clients", tags=["Clients"])


class CommentCreate(BaseModel):
    comment: str


@router.get("", response_model=List[ClientResponse])
async def list_clients(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_active_user)
):
    """List clients"""
    clients = await ClientService.get_all_clients(skip=skip, limit=limit)
    return clients


@router.get("/{client_id}", response_model=ClientResponse)
async def get_client(
    client_id: int,
    current_user: User = Depends(get_current_active_user)
):
    """Get client profile + products + income"""
    client = await ClientService.get_client_by_id(client_id)
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    # Get products and comments
    products = await ClientService.get_client_products(client_id)
    comments = await ClientService.get_client_comments(client_id)
    
    # Convert to dict for response
    client_dict = {
        "id": client.id,
        "user_id": client.user_id,
        "full_name": client.full_name,
        "email": client.email,
        "phone": client.phone,
        "address": client.address,
        "created_at": client.created_at,
        "updated_at": client.updated_at,
        "products": [
            {
                "id": cp.id,
                "product_id": cp.product_id,
                "assigned_at": cp.assigned_at,
            }
            for cp in products
        ],
        "comments": [
            {
                "id": c.id,
                "comment": c.comment,
                "user_id": c.user_id,
                "created_at": c.created_at,
            }
            for c in comments
        ],
    }
    
    return client_dict


@router.post("/{client_id}/products", response_model=ClientProductResponse, status_code=status.HTTP_200_OK)
async def assign_product_to_client(
    client_id: int,
    product_data: ClientProductCreate,
    current_user: User = Depends(require_admin)
):
    """Assign product/service to client (admin only)"""
    client = await ClientService.get_client_by_id(client_id)
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")

    product = await ProductService.get_product_by_id(product_data.product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    existing_assignment = await ClientService.get_client_product(client_id, product_data.product_id)
    if existing_assignment:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Product already assigned to this client")

    client_product = await ClientService.assign_product(
        client_id,
        product_data.product_id
    )
    
    return client_product

@router.get("/{client_id}/products", response_model=List[ClientProductResponse])
async def get_client_products(
    client_id: int,
    current_user: User = Depends(get_current_active_user)
):
    """Get all products assigned to a client"""
    client = await ClientService.get_client_by_id(client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    products = await ClientService.get_client_products(client_id)
    return products



@router.post("/{client_id}/comments", response_model=ClientCommentResponse, status_code=status.HTTP_201_CREATED)
async def add_client_comment(
    client_id: int,
    comment_data: CommentCreate,
    current_user: User = Depends(get_current_active_user)
):
    """Add comment to client"""
    client = await ClientService.get_client_by_id(client_id)
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    comment = await ClientService.add_comment(client_id, current_user.id, comment_data.comment)
    return comment


@router.get("/{client_id}/claims", response_model=List[ClaimResponse])
async def get_client_claims(
    client_id: int,
    current_user: User = Depends(get_current_active_user)
):
    """Get all claims for a client"""
    client = await ClientService.get_client_by_id(client_id)
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    claims = await ClientService.get_client_claims(client_id)
    return claims

