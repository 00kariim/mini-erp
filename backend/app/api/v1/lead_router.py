from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from app.schemas import LeadCreate, LeadUpdate, LeadResponse, LeadCommentCreate, LeadCommentResponse, UserCreate
from app.services import LeadService
from app.api.dependencies import (
    get_current_active_user, require_admin_or_operator, require_admin,
    require_supervisor_or_admin
)
from app.models import User
from app.models.lead import LeadStatus
from pydantic import BaseModel

router = APIRouter(prefix="/leads", tags=["Leads"])


class CommentCreate(BaseModel):
    comment: str


class AssignOperatorRequest(BaseModel):
    operator_id: int


@router.post("", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
async def create_lead(
    lead_data: LeadCreate,
    current_user: User = Depends(require_admin_or_operator)
):
    """Create lead (Admin / Operator)"""
    lead = await LeadService.create_lead(lead_data)
    return lead


@router.get("", response_model=List[LeadResponse])
async def list_leads(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    operator_id: Optional[int] = Query(None),
    status: Optional[LeadStatus] = Query(None),
    current_user: User = Depends(require_admin_or_operator)
):
    """List leads (filter by operator/admin)"""
    # Non-admin users can only see their own leads
    await current_user.fetch_related("roles")
    role_names = [role.name.lower() for role in current_user.roles]
    is_admin = "admin" in role_names
    
    if not is_admin and operator_id and operator_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view your own leads"
        )
    
    # If not admin and no operator_id specified, filter by current user
    if not is_admin:
        operator_id = current_user.id
    
    leads = await LeadService.get_all_leads(
        skip=skip,
        limit=limit,
        operator_id=operator_id,
        status=status
    )
    return leads


@router.get("/{lead_id}", response_model=LeadResponse)
async def get_lead(
    lead_id: int,
    current_user: User = Depends(require_admin_or_operator)
):
    """Get lead details"""
    lead = await LeadService.get_lead_by_id(lead_id)
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found"
        )
    
    # Check permissions
    await current_user.fetch_related("roles")
    role_names = [role.name.lower() for role in current_user.roles]
    is_admin = "admin" in role_names
    
    if not is_admin and lead.assigned_operator_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view your assigned leads"
        )
    
    return lead


@router.put("/{lead_id}", response_model=LeadResponse)
async def update_lead(
    lead_id: int,
    lead_data: LeadUpdate,
    current_user: User = Depends(require_admin_or_operator)
):
    """Update lead info"""
    lead = await LeadService.get_lead_by_id(lead_id)
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found"
        )
    
    # Check permissions
    await current_user.fetch_related("roles")
    role_names = [role.name.lower() for role in current_user.roles]
    is_admin = "admin" in role_names
    
    if not is_admin and lead.assigned_operator_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your assigned leads"
        )
    
    updated_lead = await LeadService.update_lead(lead_id, lead_data)
    return updated_lead


@router.delete("/{lead_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_lead(
    lead_id: int,
    current_user: User = Depends(require_admin_or_operator)
):
    """Delete lead"""
    lead = await LeadService.get_lead_by_id(lead_id)
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found"
        )
    
    # Check permissions
    await current_user.fetch_related("roles")
    role_names = [role.name.lower() for role in current_user.roles]
    is_admin = "admin" in role_names
    
    if not is_admin and lead.assigned_operator_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your assigned leads"
        )
    
    await LeadService.delete_lead(lead_id)


@router.post("/{lead_id}/comments", response_model=LeadCommentResponse, status_code=status.HTTP_201_CREATED)
async def add_lead_comment(
    lead_id: int,
    comment_data: CommentCreate,
    current_user: User = Depends(get_current_active_user)
):
    """Add comment to lead (admin, supervisor, or operator)"""
    lead = await LeadService.get_lead_by_id(lead_id)
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found"
        )
    
    # Check permissions: admin, supervisor, or assigned operator can comment
    await current_user.fetch_related("roles")
    role_names = [role.name.lower() for role in current_user.roles]
    is_admin = "admin" in role_names
    is_supervisor = "supervisor" in role_names
    is_operator = "operator" in role_names
    
    if not is_admin and not is_supervisor:
        # Operators can only comment on their assigned leads
        if is_operator and lead.assigned_operator_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only comment on leads assigned to you"
            )
        elif not is_operator:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to comment on this lead"
            )
    
    comment = await LeadService.add_comment(lead_id, current_user.id, comment_data.comment)
    return comment


@router.post("/{lead_id}/assign-operator", response_model=LeadResponse)
async def assign_lead_to_operator(
    lead_id: int,
    assign_data: AssignOperatorRequest,
    current_user: User = Depends(require_admin)
):
    """Assign lead to operator (admin only)"""
    lead = await LeadService.get_lead_by_id(lead_id)
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found"
        )
    
    # Verify operator exists and has operator role
    operator = await User.get_or_none(id=assign_data.operator_id)
    if not operator:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Operator not found"
        )
    
    await operator.fetch_related("roles")
    role_names = [role.name.lower() for role in operator.roles]
    if "operator" not in role_names:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is not an operator"
        )
    
    lead_data = LeadUpdate(assigned_operator_id=assign_data.operator_id)
    updated_lead = await LeadService.update_lead(lead_id, lead_data)
    
    if not updated_lead:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to assign operator to lead"
        )
    
    return updated_lead


@router.post("/{lead_id}/convert", status_code=status.HTTP_201_CREATED)
async def convert_lead_to_client(
    lead_id: int,
    current_user: User = Depends(require_admin_or_operator)
):
    """Convert lead to client"""
    lead = await LeadService.get_lead_by_id(lead_id)
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found"
        )
    
    # Check if user already exists with this email
    from app.models import Client
    from app.services import ClientService, UserService
    
    existing_user = await UserService.get_user_by_email(lead.email)
    
    if existing_user:
        # Check if client profile already exists
        existing_client = await Client.get_or_none(user_id=existing_user.id)
        if existing_client:
            # Update lead status to converted
            await LeadService.update_lead(lead_id, LeadUpdate(status=LeadStatus.CONVERTED))
            return {
                "message": "Lead converted to existing client",
                "client_id": existing_client.id,
                "user_id": existing_user.id
            }
        user_id = existing_user.id
    else:
        # Create new user for the client
        from app.models import Role
        
        # Get Client role
        client_role = await Role.get_or_none(name__iexact="Client")
        if not client_role:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Client role not found in system"
            )
        
        # Create user
        user_data = UserCreate(
            username=lead.email.split("@")[0],  # Simple username from email
            email=lead.email,
            password="TempPassword123!",  # Should be changed on first login
            role_ids=[client_role.id]
        )
        new_user = await UserService.create_user(user_data)
        user_id = new_user.id
    
    # Create client from lead
    client = await LeadService.convert_lead_to_client(lead_id, user_id)
    
    if not client:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to convert lead to client"
        )
    
    return {"message": "Lead converted to client successfully", "client_id": client.id}

