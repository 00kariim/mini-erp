from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.config import settings

# Password hashing context
# Use pbkdf2_sha256 to avoid native bcrypt backend issues in this environment.
# This is a strong, well-vetted hash suitable for application passwords.
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against a hashed password.
    
    Args:
        plain_password: The plain text password
        hashed_password: The hashed password to verify against
    
    Returns:
        True if passwords match, False otherwise
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Hash a password using the configured password hashing scheme.
    
    Args:
        password: The plain text password to hash
    
    Returns:
        The hashed password
    """
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token.
    
    Args:
        data: Dictionary containing the data to encode in the token
        expires_delta: Optional timedelta for token expiration
    
    Returns:
        The encoded JWT token
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=24)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """
    Decode and verify a JWT access token.
    
    Args:
        token: The JWT token to decode
    
    Returns:
        The decoded token data if valid, None otherwise
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None

