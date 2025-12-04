"""
API v1 Package
"""
from . import (
    auth_router,
    user_router,
    lead_router,
    client_router,
    product_router,
    claim_router,
    analytics_router
)

__all__ = [
    "auth_router",
    "user_router",
    "lead_router",
    "client_router",
    "product_router",
    "claim_router",
    "analytics_router",
]
