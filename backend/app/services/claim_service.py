from typing import List, Optional
from app.models import Claim, ClaimFile, ClaimComment, User, Client
from app.schemas import ClaimCreate, ClaimUpdate, ClaimFileCreate, ClaimCommentCreate
from app.models.claim import ClaimStatus


class ClaimService:
    """Service for claim-related operations"""

    @staticmethod
    async def create_claim(claim_data: ClaimCreate) -> Claim:
        """Create a new claim"""
        claim = await Claim.create(
            client_id=claim_data.client_id,
            assigned_operator_id=claim_data.assigned_operator_id,
            assigned_supervisor_id=claim_data.assigned_supervisor_id,
            status=claim_data.status,
            description=claim_data.description
        )
        return claim

    @staticmethod
    async def get_claim_by_id(claim_id: int) -> Optional[Claim]:
        """Get claim by ID with comments and author usernames"""
        claim = await Claim.get_or_none(id=claim_id).prefetch_related("comments__user")
        if claim and hasattr(claim, "comments"):
            for comment in claim.comments:
                if getattr(comment, "user", None):
                    comment.username = comment.user.username
        return claim

    @staticmethod
    async def get_all_claims(
        skip: int = 0,
        limit: int = 100,
        operator_id: Optional[int] = None,
        supervisor_id: Optional[int] = None,
        client_id: Optional[int] = None,
        status: Optional[ClaimStatus] = None
    ) -> List[Claim]:
        """Get all claims with optional filtering (including comments and author usernames)"""
        query = Claim.all().prefetch_related("comments__user")
        
        if operator_id:
            query = query.filter(assigned_operator_id=operator_id)
        if supervisor_id:
            query = query.filter(assigned_supervisor_id=supervisor_id)
        if client_id:
            query = query.filter(client_id=client_id)
        if status:
            query = query.filter(status=status)
        
        claims = await query.offset(skip).limit(limit).order_by("-created_at")
        for claim in claims:
            if hasattr(claim, "comments"):
                for comment in claim.comments:
                    if getattr(comment, "user", None):
                        comment.username = comment.user.username
        return claims

    @staticmethod
    async def update_claim(claim_id: int, claim_data: ClaimUpdate) -> Optional[Claim]:
        """Update claim information"""
        claim = await Claim.get_or_none(id=claim_id)
        if not claim:
            return None

        update_data = {}
        if claim_data.description is not None:
            update_data["description"] = claim_data.description
        if claim_data.status is not None:
            update_data["status"] = claim_data.status
        if claim_data.assigned_operator_id is not None:
            update_data["assigned_operator_id"] = claim_data.assigned_operator_id
        if claim_data.assigned_supervisor_id is not None:
            update_data["assigned_supervisor_id"] = claim_data.assigned_supervisor_id

        if update_data:
            await Claim.filter(id=claim_id).update(**update_data)
            await claim.refresh_from_db()

        return claim

    @staticmethod
    async def upload_file(claim_id: int, file_path: str) -> ClaimFile:
        """Upload a file for a claim"""
        claim_file = await ClaimFile.create(
            claim_id=claim_id,
            file_path=file_path
        )
        return claim_file

    @staticmethod
    async def get_claim_files(claim_id: int) -> List[ClaimFile]:
        """Get all files for a claim"""
        files = await ClaimFile.filter(claim_id=claim_id).order_by("-uploaded_at")
        return files

    @staticmethod
    async def add_comment(claim_id: int, user_id: int, comment: str) -> ClaimComment:
        """Add a comment to a claim"""
        comment_obj = await ClaimComment.create(
            claim_id=claim_id,
            user_id=user_id,
            comment=comment
        )
        return comment_obj

    @staticmethod
    async def get_claim_comments(claim_id: int) -> List[ClaimComment]:
        """Get all comments for a claim"""
        comments = await ClaimComment.filter(claim_id=claim_id).order_by("-created_at")
        return comments

