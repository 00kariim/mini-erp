from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """
    Application settings class using Pydantic BaseSettings.
    Automatically reads configuration from environment variables.
    """

    # API configuration
    API_V1_STR: str = "/api/v1"
    # Database configuration
    DATABASE_URL: str
    """
    PostgreSQL database connection URL.
    Format: postgres://user:password@localhost:5432/db_name
    This URL is used to establish the database connection for the application.
    """
    
    # JWT authentication configuration
    SECRET_KEY: str
    """
    Secret key used for JWT (JSON Web Token) authentication.
    This key is used to sign and verify JWT tokens.
    Should be a strong, randomly generated string in production.
    """
    
    ALGORITHM: str = "HS256"
    """
    JWT algorithm used for token encoding and decoding.
    Default value: HS256 (HMAC with SHA-256)
    Other common options include: RS256, ES256, etc.
    """
    
    class Config:
        """
        Pydantic configuration class.
        Enables automatic reading from environment variables.
        """
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


# Create a global settings instance
settings = Settings()



    
TORTOISE_CONFIG = {
    "connections": {"default": settings.DATABASE_URL},
    "apps": {
        "models": {
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
                "aerich.models",
            ],
            "default_connection": "default",
        }
    }
}

