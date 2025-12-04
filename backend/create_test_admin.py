import asyncio

from tortoise import Tortoise

from app.config import TORTOISE_CONFIG
from app.auth import get_password_hash
from app.models import User, Role


ADMIN_USERNAME = "admin"
ADMIN_EMAIL = "admin@admin.com"
ADMIN_PASSWORD = "123456"


async def create_test_admin() -> None:
    """
    Initialize Tortoise ORM, create an 'Admin' role if missing,
    and create/update a test admin user with the given credentials.
    """
    await Tortoise.init(config=TORTOISE_CONFIG)
    # Ensure schemas exist (safe=True won't drop anything)
    await Tortoise.generate_schemas(safe=True)

    # Ensure Admin role exists
    role, _ = await Role.get_or_create(
        name="Admin",
        defaults={"description": "Administrator with full access"},
    )

    # Create or update the admin user
    user = await User.get_or_none(username=ADMIN_USERNAME)

    password_hash = get_password_hash(ADMIN_PASSWORD)

    if user is None:
        user = await User.create(
            username=ADMIN_USERNAME,
            email=ADMIN_EMAIL,
            password_hash=password_hash,
            is_active=True,
        )
        print(f"Created admin user '{ADMIN_USERNAME}'")
    else:
        # Update email and password to ensure they match the expected test values
        user.email = ADMIN_EMAIL
        user.password_hash = password_hash
        user.is_active = True
        await user.save()
        print(f"Updated existing admin user '{ADMIN_USERNAME}'")

    # Ensure the user has the Admin role
    await user.fetch_related("roles")
    if role not in user.roles:
        await user.roles.add(role)
        print("Assigned 'Admin' role to admin user")

    await Tortoise.close_connections()
    print("Done.")


if __name__ == "__main__":
    asyncio.run(create_test_admin())


