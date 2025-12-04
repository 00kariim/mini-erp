import asyncio
from tortoise import Tortoise
from app.config import TORTOISE_CONFIG
from app.auth import get_password_hash
from app.models import (
    User,
    Role,
    SupervisorOperator,
    Lead,
    LeadStatus,
    LeadComment,
    Client,
    ClientProduct,
    ClientComment,
    Product,
    Claim,
    ClaimStatus,
    ClaimComment,
)


async def seed():
    print("Initializing Tortoise ORM...")
    await Tortoise.init(config=TORTOISE_CONFIG)
    await Tortoise.generate_schemas(safe=True)

    # -----------------------------
    # 2. USERS
    # -----------------------------
    print("Seeding users...")

    async def create_user_with_role(username, email, password, role_name):
        user, created = await User.get_or_create(
            username=username,
            defaults={
                "email": email,
                "password_hash": get_password_hash(password),
                "is_active": True,
            },
        )
        role, _ = await Role.get_or_create(name=role_name)
        await user.fetch_related("roles")
        if role not in user.roles:
            await user.roles.add(role)
        return user

    admin = await create_user_with_role("admin", "admin@admin.com", "123456", "Admin")
    sup1 = await create_user_with_role("sup_john", "john@supervisor.com", "pass123", "Supervisor")
    op1 = await create_user_with_role("op_mary", "mary@operator.com", "pass123", "Operator")
    op2 = await create_user_with_role("op_bob", "bob@operator.com", "pass123", "Operator")
    client_user = await create_user_with_role("client_anna", "anna@client.com", "pass123", "Client")

    # -----------------------------
    # 3. SUPERVISOR–OPERATOR BINDING
    # -----------------------------
    print("Binding operators to supervisor...")
    await SupervisorOperator.get_or_create(supervisor_id=sup1.id, operator_id=op1.id)
    await SupervisorOperator.get_or_create(supervisor_id=sup1.id, operator_id=op2.id)

    # -----------------------------
    # 4. LEADS
    # -----------------------------
    print("Creating sample leads...")

    lead1, _ = await Lead.get_or_create(
        email="alice@example.com",
        defaults={
            "first_name": "Alice",
            "last_name": "Carter",
            "phone": "555-1111",
            "status": LeadStatus.NEW,
            "assigned_operator_id": op1.id,
        },
    )

    lead2, _ = await Lead.get_or_create(
        email="mark@example.com",
        defaults={
            "first_name": "Mark",
            "last_name": "Thompson",
            "phone": "555-2222",
            "status": LeadStatus.CONTACTED,
            "assigned_operator_id": op2.id,
        },
    )

    await LeadComment.get_or_create(
        lead=lead1,
        user=op1,
        defaults={"comment": "Contacted and waiting for response"},
    )
    await LeadComment.get_or_create(
        lead=lead2,
        user=op2,
        defaults={"comment": "Scheduled follow-up call"},
    )

    # -----------------------------
    # 5. CLIENTS
    # -----------------------------
    print("Creating sample clients...")

    client1, _ = await Client.get_or_create(
        user=client_user,
        defaults={
            "full_name": "Anna Smith",
            "email": "anna@client.com",
            "phone": "555-3333",
            "address": "123 Main Street",
        },
    )

    # -----------------------------
    # 6. PRODUCTS
    # -----------------------------
    print("Creating sample products/services...")

    insurance, _ = await Product.get_or_create(
        name="Life Insurance",
        defaults={
            "type": "Insurance",
            "description": "Standard life insurance package",
            "price": 199.99,
        },
    )

    real_estate, _ = await Product.get_or_create(
        name="Home Buy Package",
        defaults={
            "type": "Real Estate",
            "description": "Full assistance with home buying",
            "price": 999.99,
        },
    )

    await ClientProduct.get_or_create(client=client1, product=insurance)
    await ClientProduct.get_or_create(client=client1, product=real_estate)

    await ClientComment.get_or_create(
        client=client1,
        user=op1,
        defaults={"comment": "Client interested in insurance renewal."},
    )

    # -----------------------------
    # 7. CLAIMS
    # -----------------------------
    print("Creating sample claims...")

    claim1, _ = await Claim.get_or_create(
        client=client1,
        defaults={
            "assigned_operator_id": op1.id,
            "assigned_supervisor_id": sup1.id,
            "status": ClaimStatus.SUBMITTED,
            "description": "Car accident claim filed by client.",
        },
    )

    claim2, _ = await Claim.get_or_create(
        client=client1,
        defaults={
            "assigned_operator_id": op2.id,
            "assigned_supervisor_id": sup1.id,
            "status": ClaimStatus.IN_REVIEW,
            "description": "Property damage claim: burst pipe.",
        },
    )

    await ClaimComment.get_or_create(
        claim=claim1,
        user=op1,
        defaults={"comment": "Requested additional photos from client."},
    )
    await ClaimComment.get_or_create(
        claim=claim2,
        user=sup1,
        defaults={"comment": "Reviewed documents, waiting for operator notes."},
    )

    print("Database seeded successfully!")
    await Tortoise.close_connections()


if __name__ == "__main__":
    asyncio.run(seed())
