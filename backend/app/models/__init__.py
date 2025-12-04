"""
Database Models Package
"""

# Roles & Users
from .role import Role
from .user import User
from .user_role import UserRole
from .supervisor_operator import SupervisorOperator

# Leads
from .lead import Lead, LeadStatus
from .lead_comment import LeadComment

# Products & Clients
from .product import Product
from .client import Client
from .client_product import ClientProduct
from .client_comment import ClientComment

# Claims
from .claim import Claim, ClaimStatus
from .claim_file import ClaimFile
from .claim_comment import ClaimComment

# Activity Logs
from .activity_log import ActivityLog


__all__ = [
    # Role & Users
    "Role",
    "User",
    "UserRole",
    "SupervisorOperator",

    # Leads
    "Lead",
    "LeadStatus",
    "LeadComment",

    # Clients & Products
    "Client",
    "ClientProduct",
    "ClientComment",
    "Product",

    # Claims
    "Claim",
    "ClaimStatus",
    "ClaimFile",
    "ClaimComment",

    # Logs
    "ActivityLog",
]
