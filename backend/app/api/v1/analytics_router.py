from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, List
from app.models import Lead, Client, Claim, Product, ClientProduct, SupervisorOperator, User
from app.models.lead import LeadStatus
from app.models.claim import ClaimStatus
from app.api.dependencies import get_current_active_user, require_admin
from app.models import User as UserModel
from decimal import Decimal
from datetime import datetime, timedelta

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/leads")
async def get_leads_analytics(
    current_user: UserModel = Depends(require_admin)
):
    """Leads by status"""
    leads = await Lead.all()
    
    status_counts = {}
    for status in LeadStatus:
        count = await Lead.filter(status=status).count()
        status_counts[status.value] = count
    
    return {
        "total_leads": len(leads),
        "by_status": status_counts
    }


@router.get("/clients")
async def get_clients_analytics(
    current_user: UserModel = Depends(require_admin)
):
    """Number of clients"""
    total_clients = await Client.all().count()
    
    # Clients created in last 30 days
    thirty_days_ago = datetime.now() - timedelta(days=30)
    recent_clients = await Client.filter(created_at__gte=thirty_days_ago).count()
    
    return {
        "total_clients": total_clients,
        "recent_clients_30d": recent_clients
    }


@router.get("/revenue")
async def get_revenue_analytics(
    current_user: UserModel = Depends(require_admin)
):
    """Revenue per product/service"""
    products = await Product.all()
    client_products = await ClientProduct.all().prefetch_related("product")
    
    revenue_by_product = {}
    total_revenue = Decimal("0.00")
    
    for product in products:
        # Count how many clients have this product
        count = await ClientProduct.filter(product_id=product.id).count()
        revenue = (product.price or Decimal("0.00")) * count
        revenue_by_product[product.name] = {
            "product_id": product.id,
            "type": product.type,
            "price": float(product.price) if product.price else 0.0,
            "assigned_count": count,
            "revenue": float(revenue)
        }
        total_revenue += revenue
    
    return {
        "total_revenue": float(total_revenue),
        "by_product": revenue_by_product
    }


@router.get("/claims")
async def get_claims_analytics(
    current_user: UserModel = Depends(require_admin)
):
    """Claims over time"""
    total_claims = await Claim.all().count()
    
    status_counts = {}
    for status in ClaimStatus:
        count = await Claim.filter(status=status).count()
        status_counts[status.value] = count
    
    # Claims created in last 30 days
    thirty_days_ago = datetime.now() - timedelta(days=30)
    recent_claims = await Claim.filter(created_at__gte=thirty_days_ago).count()
    
    # Claims by month (last 6 months)
    monthly_claims = {}
    for i in range(6):
        month_start = datetime.now().replace(day=1) - timedelta(days=30 * i)
        month_end = month_start + timedelta(days=30)
        count = await Claim.filter(
            created_at__gte=month_start,
            created_at__lt=month_end
        ).count()
        month_key = month_start.strftime("%Y-%m")
        monthly_claims[month_key] = count
    
    return {
        "total_claims": total_claims,
        "by_status": status_counts,
        "recent_claims_30d": recent_claims,
        "monthly_claims": monthly_claims
    }


@router.get("/supervisors")
async def get_supervisors_analytics(
    current_user: UserModel = Depends(require_admin)
):
    """Supervisor performance"""
    supervisors = await User.all().prefetch_related("roles")
    
    supervisor_performance = []
    
    for supervisor in supervisors:
        await supervisor.fetch_related("roles")
        role_names = [role.name.lower() for role in supervisor.roles]
        
        if "supervisor" not in role_names:
            continue
        
        # Get assigned operators
        assigned_operators = await SupervisorOperator.filter(
            supervisor_id=supervisor.id
        ).count()
        
        # Get claims assigned to this supervisor
        supervisor_claims = await Claim.filter(
            assigned_supervisor_id=supervisor.id
        )
        
        total_claims = len(supervisor_claims)
        resolved_claims = await Claim.filter(
            assigned_supervisor_id=supervisor.id,
            status=ClaimStatus.RESOLVED
        ).count()
        
        supervisor_performance.append({
            "supervisor_id": supervisor.id,
            "supervisor_name": supervisor.username,
            "assigned_operators": assigned_operators,
            "total_claims": total_claims,
            "resolved_claims": resolved_claims,
            "resolution_rate": (resolved_claims / total_claims * 100) if total_claims > 0 else 0
        })
    
    return {
        "supervisors": supervisor_performance
    }

