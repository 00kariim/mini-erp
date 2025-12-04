from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from typing import List, Optional
from app.schemas import (
    ClaimCreate, ClaimUpdate, ClaimResponse, ClaimFileResponse,
    ClaimCommentResponse
)
from app.services import ClaimService
from app.api.dependencies import (
    get_current_active_user, require_admin_or_operator, require_admin,
    require_supervisor_or_admin
)
from app.models.supervisor_operator import SupervisorOperator
from app.models import User, Client
from app.models.claim import ClaimStatus
from pydantic import BaseModel
import os
from datetime import datetime

router = APIRouter(prefix="/claims", tags=["Claims"])


class CommentCreate(BaseModel):
    comment: str


# ------------------------------------------------------------
# CREATE CLAIM
# ------------------------------------------------------------
@router.post("", response_model=ClaimResponse, status_code=status.HTTP_201_CREATED)
async def create_claim(
    claim_data: ClaimCreate,
    current_user: User = Depends(get_current_active_user)
):
    """Create claim (clients only create their own claims)"""
    await current_user.fetch_related("roles")
    role_names = [r.name.lower() for r in current_user.roles]
    is_admin = "admin" in role_names

    if not is_admin:
        # Only create claim for your own client profile
        client = await Client.get_or_none(id=claim_data.client_id, user_id=current_user.id)
        if not client:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only create claims for your own client profile"
            )

    claim = await ClaimService.create_claim(claim_data)
    return claim


# ------------------------------------------------------------
# LIST CLAIMS — NOW RETURNS CLEAR ERRORS
# ------------------------------------------------------------
@router.get("", response_model=List[ClaimResponse])
async def list_claims(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    operator_id: Optional[int] = None,
    supervisor_id: Optional[int] = None,
    client_id: Optional[int] = None,
    claim_status: Optional[ClaimStatus] = Query(None),
    current_user: User = Depends(get_current_active_user)
):
    """List claims with clear response handling"""

    await current_user.fetch_related("roles")
    roles = [r.name.lower() for r in current_user.roles]

    is_admin = "admin" in roles
    is_supervisor = "supervisor" in roles
    is_operator = "operator" in roles

    # ROLE FILTERING
    if is_operator and not is_admin and not is_supervisor:
        operator_id = current_user.id

    elif is_supervisor and not is_admin:
        supervisor_id = current_user.id

    elif not is_admin:
        # Client profile validation
        client = await Client.get_or_none(user_id=current_user.id)
        if not client:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Client profile not found for this user"
            )
        client_id = client.id

    # QUERY CLAIMS
    claims = await ClaimService.get_all_claims(
        skip=skip,
        limit=limit,
        operator_id=operator_id,
        supervisor_id=supervisor_id,
        client_id=client_id,
        status=claim_status
    )

    # ALWAYS return 200 even if list is empty
    return claims


# ------------------------------------------------------------
# GET CLAIM DETAILS
# ------------------------------------------------------------
@router.get("/{claim_id}", response_model=ClaimResponse)
async def get_claim(
    claim_id: int,
    current_user: User = Depends(get_current_active_user)
):
    claim = await ClaimService.get_claim_by_id(claim_id)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")

    await current_user.fetch_related("roles")
    roles = [r.name.lower() for r in current_user.roles]

    is_admin = "admin" in roles

    if not is_admin:
        client = await Client.get_or_none(user_id=current_user.id)

        if client and claim.client_id == client.id:
            pass  # client sees own claim
        elif claim.assigned_operator_id == current_user.id:
            pass  # operator sees assigned claim
        elif claim.assigned_supervisor_id == current_user.id:
            pass  # supervisor sees assigned claim
        else:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to view this claim"
            )

    return claim


# ------------------------------------------------------------
# UPDATE CLAIM
# ------------------------------------------------------------
@router.put("/{claim_id}", response_model=ClaimResponse)
async def update_claim(
    claim_id: int,
    claim_data: ClaimUpdate,
    current_user: User = Depends(get_current_active_user)
):
    """Update claim (admin, supervisor managing their operators, or assigned operator)"""
    claim = await ClaimService.get_claim_by_id(claim_id)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")

    # Check permissions
    await current_user.fetch_related("roles")
    role_names = [role.name.lower() for role in current_user.roles]
    is_admin = "admin" in role_names
    is_supervisor = "supervisor" in role_names
    is_operator = "operator" in role_names

    if not is_admin:
        if is_supervisor:
            # Supervisor can only manage claims assigned to their operators
            if claim.assigned_supervisor_id != current_user.id:
                # Check if claim is assigned to one of supervisor's operators
                if claim.assigned_operator_id:
                    supervised = await SupervisorOperator.get_or_none(
                        supervisor_id=current_user.id,
                        operator_id=claim.assigned_operator_id
                    )
                    if not supervised:
                        raise HTTPException(
                            status_code=status.HTTP_403_FORBIDDEN,
                            detail="You can only manage claims for your supervised operators"
                        )
                else:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="You can only manage claims assigned to your operators"
                    )
        elif is_operator:
            # Operator can only update claims assigned to them
            if claim.assigned_operator_id != current_user.id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You can only update claims assigned to you"
                )
        else:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to update claims"
            )

    updated = await ClaimService.update_claim(claim_id, claim_data)
    return updated


# ------------------------------------------------------------
# UPLOAD FILE
# ------------------------------------------------------------
@router.post("/{claim_id}/files", response_model=ClaimFileResponse)
async def upload_claim_file(
    claim_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user)
):
    claim = await ClaimService.get_claim_by_id(claim_id)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")

    upload_dir = "uploads/claims"
    os.makedirs(upload_dir, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    ext = os.path.splitext(file.filename)[1]
    filename = f"{claim_id}_{timestamp}{ext}"
    path = os.path.join(upload_dir, filename)

    with open(path, "wb") as buff:
        buff.write(await file.read())

    return await ClaimService.upload_file(claim_id, path)


# ------------------------------------------------------------
# ADD COMMENT
# ------------------------------------------------------------
@router.post("/{claim_id}/comments", response_model=ClaimCommentResponse)
async def add_claim_comment(
    claim_id: int,
    comment_data: CommentCreate,
    current_user: User = Depends(get_current_active_user)
):
    """Add comment to claim (admin, supervisor, operator, or client on their own claims)"""
    claim = await ClaimService.get_claim_by_id(claim_id)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")

    # Check permissions
    await current_user.fetch_related("roles")
    role_names = [role.name.lower() for role in current_user.roles]
    is_admin = "admin" in role_names
    is_supervisor = "supervisor" in role_names
    is_operator = "operator" in role_names
    is_client = "client" in role_names

    if not is_admin:
        if is_client:
            # Client can only comment on their own claims
            client = await Client.get_or_none(user_id=current_user.id)
            if not client or claim.client_id != client.id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You can only comment on your own claims"
                )
        elif is_supervisor:
            # Supervisor can comment on claims assigned to them or their operators
            if claim.assigned_supervisor_id != current_user.id:
                if claim.assigned_operator_id:
                    supervised = await SupervisorOperator.get_or_none(
                        supervisor_id=current_user.id,
                        operator_id=claim.assigned_operator_id
                    )
                    if not supervised:
                        raise HTTPException(
                            status_code=status.HTTP_403_FORBIDDEN,
                            detail="You can only comment on claims for your supervised operators"
                        )
                else:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="You can only comment on claims assigned to you or your operators"
                    )
        elif is_operator:
            # Operator can only comment on claims assigned to them
            if claim.assigned_operator_id != current_user.id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You can only comment on claims assigned to you"
                )
        else:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to comment on this claim"
            )

    return await ClaimService.add_comment(
        claim_id=claim_id,
        user_id=current_user.id,
        comment=comment_data.comment
    )


# ------------------------------------------------------------
# ADMIN ENDPOINTS
# ------------------------------------------------------------

class AssignOperatorRequest(BaseModel):
    operator_id: int


class AssignSupervisorRequest(BaseModel):
    supervisor_id: int


class ChangeStatusRequest(BaseModel):
    status: ClaimStatus


@router.post("/{claim_id}/assign-operator", response_model=ClaimResponse)
async def assign_claim_to_operator(
    claim_id: int,
    assign_data: AssignOperatorRequest,
    current_user: User = Depends(require_admin)
):
    """Assign claim to operator (admin only)"""
    claim = await ClaimService.get_claim_by_id(claim_id)
    if not claim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Claim not found"
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
    
    claim_data = ClaimUpdate(assigned_operator_id=assign_data.operator_id)
    updated_claim = await ClaimService.update_claim(claim_id, claim_data)
    
    if not updated_claim:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to assign operator to claim"
        )
    
    return updated_claim


@router.post("/{claim_id}/assign-supervisor", response_model=ClaimResponse)
async def assign_claim_to_supervisor(
    claim_id: int,
    assign_data: AssignSupervisorRequest,
    current_user: User = Depends(require_admin)
):
    """Assign claim to supervisor (admin only)"""
    claim = await ClaimService.get_claim_by_id(claim_id)
    if not claim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Claim not found"
        )
    
    # Verify supervisor exists and has supervisor role
    supervisor = await User.get_or_none(id=assign_data.supervisor_id)
    if not supervisor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Supervisor not found"
        )
    
    await supervisor.fetch_related("roles")
    role_names = [role.name.lower() for role in supervisor.roles]
    if "supervisor" not in role_names:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is not a supervisor"
        )
    
    claim_data = ClaimUpdate(assigned_supervisor_id=assign_data.supervisor_id)
    updated_claim = await ClaimService.update_claim(claim_id, claim_data)
    
    if not updated_claim:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to assign supervisor to claim"
        )
    
    return updated_claim


@router.post("/{claim_id}/change-status", response_model=ClaimResponse)
async def change_claim_status(
    claim_id: int,
    status_data: ChangeStatusRequest,
    current_user: User = Depends(require_admin)
):
    """Change claim status (admin only)"""
    claim = await ClaimService.get_claim_by_id(claim_id)
    if not claim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Claim not found"
        )
    
    claim_data = ClaimUpdate(status=status_data.status)
    updated_claim = await ClaimService.update_claim(claim_id, claim_data)
    
    if not updated_claim:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update claim status"
        )
    
    return updated_claim


# ------------------------------------------------------------
# SUPERVISOR ENDPOINTS
# ------------------------------------------------------------

@router.post("/{claim_id}/assign-operator-by-supervisor", response_model=ClaimResponse)
async def assign_claim_to_operator_by_supervisor(
    claim_id: int,
    assign_data: AssignOperatorRequest,
    current_user: User = Depends(require_supervisor_or_admin)
):
    """Assign claim to operator (supervisor can assign to their operators, admin can assign to any)"""
    claim = await ClaimService.get_claim_by_id(claim_id)
    if not claim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Claim not found"
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
    
    # Check if supervisor is assigning to their supervised operator
    await current_user.fetch_related("roles")
    current_role_names = [role.name.lower() for role in current_user.roles]
    is_admin = "admin" in current_role_names
    
    if not is_admin:
        # Supervisor can only assign to their supervised operators
        supervised = await SupervisorOperator.get_or_none(
            supervisor_id=current_user.id,
            operator_id=assign_data.operator_id
        )
        if not supervised:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only assign claims to your supervised operators"
            )
    
    claim_data = ClaimUpdate(assigned_operator_id=assign_data.operator_id)
    updated_claim = await ClaimService.update_claim(claim_id, claim_data)
    
    if not updated_claim:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to assign operator to claim"
        )
    
    return updated_claim


@router.post("/{claim_id}/change-status-by-supervisor", response_model=ClaimResponse)
async def change_claim_status_by_supervisor(
    claim_id: int,
    status_data: ChangeStatusRequest,
    current_user: User = Depends(require_supervisor_or_admin)
):
    """Change claim status (supervisor can change status for their operators' claims, admin can change any)"""
    claim = await ClaimService.get_claim_by_id(claim_id)
    if not claim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Claim not found"
        )
    
    # Check if supervisor is managing their operator's claim
    await current_user.fetch_related("roles")
    role_names = [role.name.lower() for role in current_user.roles]
    is_admin = "admin" in role_names
    
    if not is_admin:
        # Supervisor can only change status for claims assigned to them or their operators
        if claim.assigned_supervisor_id != current_user.id:
            if claim.assigned_operator_id:
                supervised = await SupervisorOperator.get_or_none(
                    supervisor_id=current_user.id,
                    operator_id=claim.assigned_operator_id
                )
                if not supervised:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="You can only change status for claims assigned to your supervised operators"
                    )
            else:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You can only change status for claims assigned to you or your operators"
                )
    
    claim_data = ClaimUpdate(status=status_data.status)
    updated_claim = await ClaimService.update_claim(claim_id, claim_data)
    
    if not updated_claim:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update claim status"
        )
    
    return updated_claim
