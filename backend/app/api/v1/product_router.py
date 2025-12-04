from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List
from app.schemas import ProductCreate, ProductUpdate, ProductResponse
from app.services import ProductService
from app.api.dependencies import get_current_active_user, require_admin
from app.models import User

router = APIRouter(prefix="/products", tags=["Products"])


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_data: ProductCreate,
    current_user: User = Depends(require_admin)
):
    """Create product (admin only)"""
    product = await ProductService.create_product(product_data)
    return product


@router.get("", response_model=List[ProductResponse])
async def list_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_active_user)
):
    """List products"""
    products = await ProductService.get_all_products(skip=skip, limit=limit)
    return products


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: int,
    current_user: User = Depends(get_current_active_user)
):
    """Get product detail"""
    product = await ProductService.get_product_by_id(product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return product


@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    product_data: ProductUpdate,
    current_user: User = Depends(require_admin)
):
    """Update product (admin only)"""
    product = await ProductService.update_product(product_id, product_data)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: int,
    current_user: User = Depends(require_admin)
):
    """Delete product (admin only)"""
    product = await ProductService.get_product_by_id(product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    await ProductService.delete_product(product_id)

