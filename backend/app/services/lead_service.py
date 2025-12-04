from typing import List, Optional
from app.models import Lead, LeadComment, User, Client
from app.schemas import LeadCreate, LeadUpdate, LeadCommentCreate
from app.models.lead import LeadStatus


class LeadService:
    """Service for lead-related operations"""

    @staticmethod
    async def create_lead(lead_data: LeadCreate) -> Lead:
        """Create a new lead"""
        lead = await Lead.create(
            first_name=lead_data.first_name,
            last_name=lead_data.last_name,
            email=lead_data.email,
            phone=lead_data.phone,
            status=lead_data.status,
            assigned_operator_id=lead_data.assigned_operator_id
        )
        await lead.fetch_related("comments")
        return lead

    @staticmethod
    async def get_lead_by_id(lead_id: int) -> Optional[Lead]:
        """Get lead by ID with comments and author usernames"""
        lead = await Lead.get_or_none(id=lead_id).prefetch_related("comments__user")
        if lead and hasattr(lead, "comments"):
            for comment in lead.comments:
                # Attach username for Pydantic schema
                if getattr(comment, "user", None):
                    comment.username = comment.user.username
        return lead

    @staticmethod
    async def get_all_leads(
        skip: int = 0,
        limit: int = 100,
        operator_id: Optional[int] = None,
        status: Optional[LeadStatus] = None
    ) -> List[Lead]:
        """Get all leads with optional filtering (including comments and author usernames)"""
        query = Lead.all().prefetch_related("comments__user")
        
        if operator_id:
            query = query.filter(assigned_operator_id=operator_id)
        if status:
            query = query.filter(status=status)
        
        leads = await query.offset(skip).limit(limit)
        for lead in leads:
            if hasattr(lead, "comments"):
                for comment in lead.comments:
                    if getattr(comment, "user", None):
                        comment.username = comment.user.username
        return leads

    @staticmethod
    async def update_lead(lead_id: int, lead_data: LeadUpdate) -> Optional[Lead]:
        """Update lead information"""
        lead = await Lead.get_or_none(id=lead_id)
        if not lead:
            return None

        update_data = {}
        if lead_data.first_name is not None:
            update_data["first_name"] = lead_data.first_name
        if lead_data.last_name is not None:
            update_data["last_name"] = lead_data.last_name
        if lead_data.email is not None:
            update_data["email"] = lead_data.email
        if lead_data.phone is not None:
            update_data["phone"] = lead_data.phone
        if lead_data.status is not None:
            update_data["status"] = lead_data.status
        if lead_data.assigned_operator_id is not None:
            update_data["assigned_operator_id"] = lead_data.assigned_operator_id

        if update_data:
            await Lead.filter(id=lead_id).update(**update_data)
            await lead.refresh_from_db()

        await lead.fetch_related("comments")
        return lead

    @staticmethod
    async def delete_lead(lead_id: int) -> bool:
        """Delete a lead"""
        deleted = await Lead.filter(id=lead_id).delete()
        return deleted > 0

    @staticmethod
    async def add_comment(lead_id: int, user_id: int, comment: str) -> LeadComment:
        """Add a comment to a lead"""
        comment_obj = await LeadComment.create(
            lead_id=lead_id,
            user_id=user_id,
            comment=comment
        )
        return comment_obj

    @staticmethod
    async def get_lead_comments(lead_id: int) -> List[LeadComment]:
        """Get all comments for a lead"""
        comments = await LeadComment.filter(lead_id=lead_id).order_by("-created_at")
        return comments

    @staticmethod
    async def convert_lead_to_client(lead_id: int, user_id: int) -> Optional[Client]:
        """Convert a lead to a client"""
        lead = await Lead.get_or_none(id=lead_id)
        if not lead:
            return None

        # Check if user already has a client profile
        existing_client = await Client.get_or_none(user_id=user_id)
        if existing_client:
            return existing_client

        # Create client from lead data
        client = await Client.create(
            user_id=user_id,
            full_name=f"{lead.first_name} {lead.last_name}",
            email=lead.email,
            phone=lead.phone,
            address=None
        )

        # Update lead status to converted
        await Lead.filter(id=lead_id).update(status=LeadStatus.CONVERTED)

        return client

