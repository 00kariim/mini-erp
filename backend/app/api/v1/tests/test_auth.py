from fastapi.testclient import TestClient
from app.main import app
from app.services import UserService
from app.models import User, Role

client = TestClient(app)


def test_login_and_access_protected_route():
    # Create a test user and save to the database
    user = await UserService.create_user(
        username="testuser",
        email="testuser@example.com",
        password="testpassword",
        roles=["admin"],
    )

    # Login to get a token
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "testuser", "password": "testpassword"},
    )
    assert response.status_code == 200
    token = response.json()["access_token"]

    # Access a protected route with the token
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/v1/users", headers=headers)
    assert response.status_code == 200
