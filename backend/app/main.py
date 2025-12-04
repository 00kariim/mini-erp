from fastapi import FastAPI
from tortoise.contrib.fastapi import register_tortoise
from app.config import settings
from app.api.v1 import (
    auth_router,
    user_router,
    lead_router,
    client_router,
    product_router,
    claim_router,
    analytics_router
)

app = FastAPI(
    title="Mini ERP API",
    description="A FastAPI-based ERP system",
    version="1.0.0"
)

# Include API v1 routers
app.include_router(auth_router.router, prefix=settings.API_V1_STR)
app.include_router(user_router.router, prefix=settings.API_V1_STR)
app.include_router(lead_router.router, prefix=settings.API_V1_STR)
app.include_router(client_router.router, prefix=settings.API_V1_STR)
app.include_router(product_router.router, prefix=settings.API_V1_STR)
app.include_router(claim_router.router, prefix=settings.API_V1_STR)
app.include_router(analytics_router.router, prefix=settings.API_V1_STR)

# Register Tortoise ORM
register_tortoise(
    app,
    db_url=settings.DATABASE_URL,
    modules={
        "models": [
            "app.models.role",
            "app.models.user",
            "app.models.user_role",
            "app.models.supervisor_operator",
            "app.models.lead",
            "app.models.lead_comment",
            "app.models.product",
            "app.models.client",
            "app.models.client_product",
            "app.models.client_comment",
            "app.models.claim",
            "app.models.claim_file",
            "app.models.claim_comment",
            "app.models.activity_log",
        ]
    },
    generate_schemas=True,
    add_exception_handlers=True,
)


@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Welcome to Mini ERP API"}


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

