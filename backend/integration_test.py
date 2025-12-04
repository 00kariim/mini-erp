import asyncio
import httpx

BASE_URL = "http://localhost:8000/api/v1"

# Test credentials
CREDENTIALS = {
    "admin": {"username": "admin", "password": "123456"},
    "client": {"username": "client", "password": "123456"},
    "supervisor": {"username": "supervisor", "password": "123456"},
    "operator": {"username": "operator", "password": "123456"},
}

tokens = {}

async def login(client, creds):
    resp = await client.post(f"{BASE_URL}/auth/login", json=creds)
    resp.raise_for_status()
    data = resp.json()
    return data["access_token"]

async def main():
    async with httpx.AsyncClient() as client:
        # Login all roles
        for role, creds in CREDENTIALS.items():
            try:
                token = await login(client, creds)
                tokens[role] = token
                print(f"✅ {role} logged in")
            except httpx.HTTPStatusError as e:
                print(f"❌ Failed login for {role}: {e.response.text}")

        headers = {"Authorization": f"Bearer {tokens['admin']}"}

        # --- Admin Endpoints ---
        print("\n--- Testing Admin Endpoints ---")

        # Get users
        resp = await client.get(f"{BASE_URL}/users", headers=headers)
        users = resp.json()
        print(f"Users list: {users}")

        # Create new user
        new_user = {
            "username": "test_user",
            "email": "test_user@example.com",
            "password": "123456",
            "roles": ["Client"]
        }
        try:
            resp = await client.post(f"{BASE_URL}/users", headers=headers, json=new_user)
            resp.raise_for_status()
            created_user = resp.json()
            print(f"Created user id: {created_user.get('id')}")
        except httpx.HTTPStatusError as e:
            print(f"Failed to create user: {e.response.status_code} {e.response.text}")

        # Create lead
        lead_data = {"full_name": "Test Lead", "email": "lead@example.com", "phone": "1234567890"}
        resp = await client.post(f"{BASE_URL}/leads", headers=headers, json=lead_data)
        lead = resp.json()
        print(f"Created lead id: {lead.get('id')}")

        # Convert lead to client
        resp = await client.post(f"{BASE_URL}/leads/{lead.get('id')}/convert", headers=headers)
        converted_client = resp.json()
        print(f"Converted lead to client id: {converted_client.get('id')}")

        # Create product
        product_data = {"name": "Test Product", "price": 100}
        resp = await client.post(f"{BASE_URL}/products", headers=headers, json=product_data)
        product = resp.json()
        print(f"Created product id: {product.get('id')}")

        # Update and delete product
        product_update = {"name": "Updated Product", "price": 150}
        await client.put(f"{BASE_URL}/products/{product.get('id')}", headers=headers, json=product_update)
        await client.delete(f"{BASE_URL}/products/{product.get('id')}", headers=headers)
        print("Updated and deleted product")

        # --- Operator Endpoints ---
        print("\n--- Testing Operator Endpoints ---")
        headers_op = {"Authorization": f"Bearer {tokens['operator']}"}
        resp = await client.get(f"{BASE_URL}/clients", headers=headers_op)
        assigned_clients = resp.json()
        print(f"Assigned clients: {assigned_clients}")

        # --- Supervisor Endpoints ---
        print("\n--- Testing Supervisor Endpoints ---")
        headers_sup = {"Authorization": f"Bearer {tokens['supervisor']}"}
        # Replace invalid URL with proper one
        # e.g., get all operators (adjust based on backend)
        try:
            resp = await client.get(f"{BASE_URL}/users", headers=headers_sup)
            print(f"Supervisor can view users: {resp.json()}")
        except httpx.HTTPStatusError as e:
            print(f"Failed to get supervisor operators: {e.response.text}")

        # --- Client Endpoints ---
        print("\n--- Testing Client Endpoints ---")
        headers_client = {"Authorization": f"Bearer {tokens['client']}"}

        # Create a claim
        if converted_client.get('id'):
            claim_data = {
                "client_id": converted_client.get('id'),
                "title": "Test Claim",
                "description": "Claim created from integration test",
                "files": []
            }
            try:
                resp = await client.post(f"{BASE_URL}/claims", headers=headers_client, json=claim_data)
                resp.raise_for_status()
                claim = resp.json()
                print(f"Created claim id: {claim.get('id')}")
            except httpx.HTTPStatusError as e:
                print(f"Failed to create client claim: {e.response.status_code} {e.response.text}")
        else:
            print("No client available to create claim")

if __name__ == "__main__":
    asyncio.run(main())
