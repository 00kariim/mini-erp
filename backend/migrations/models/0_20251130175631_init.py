from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "roles" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL UNIQUE,
    "description" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON COLUMN "roles"."id" IS 'Auto-increment primary key';
COMMENT ON COLUMN "roles"."name" IS 'Role name: ''Admin'', ''Supervisor'', ''Operator'', ''Client''';
COMMENT ON COLUMN "roles"."description" IS 'Optional description of the role';
COMMENT ON TABLE "roles" IS 'Role model representing user roles in the system.';
CREATE TABLE IF NOT EXISTS "users" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "username" VARCHAR(50) NOT NULL UNIQUE,
    "email" VARCHAR(100) NOT NULL UNIQUE,
    "password_hash" VARCHAR(255) NOT NULL,
    "is_active" BOOL NOT NULL DEFAULT True,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON COLUMN "users"."id" IS 'Auto-increment primary key';
COMMENT ON COLUMN "users"."username" IS 'Unique username';
COMMENT ON COLUMN "users"."email" IS 'Unique email address';
COMMENT ON COLUMN "users"."password_hash" IS 'Hashed password';
COMMENT ON COLUMN "users"."is_active" IS 'Whether the user account is active';
COMMENT ON TABLE "users" IS 'User model representing all users in the system.';
CREATE TABLE IF NOT EXISTS "user_roles" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role_id" INT NOT NULL REFERENCES "roles" ("id") ON DELETE CASCADE,
    "user_id" INT NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
    CONSTRAINT "uid_user_roles_user_id_63f1a8" UNIQUE ("user_id", "role_id")
);
COMMENT ON COLUMN "user_roles"."id" IS 'Auto-increment primary key';
COMMENT ON COLUMN "user_roles"."role_id" IS 'Role assigned to the user';
COMMENT ON COLUMN "user_roles"."user_id" IS 'User in this relationship';
COMMENT ON TABLE "user_roles" IS 'User-Role many-to-many relationship model.';
CREATE TABLE IF NOT EXISTS "supervisor_operator" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "operator_id" INT NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
    "supervisor_id" INT NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
    CONSTRAINT "uid_supervisor__supervi_4a44d8" UNIQUE ("supervisor_id", "operator_id")
);
COMMENT ON COLUMN "supervisor_operator"."id" IS 'Auto-increment primary key';
COMMENT ON COLUMN "supervisor_operator"."operator_id" IS 'Operator user (must have Operator role)';
COMMENT ON COLUMN "supervisor_operator"."supervisor_id" IS 'Supervisor user (must have Supervisor role)';
COMMENT ON TABLE "supervisor_operator" IS 'Supervisor-Operator relationship model.';
CREATE TABLE IF NOT EXISTS "leads" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20),
    "status" VARCHAR(11) NOT NULL DEFAULT 'uncontacted',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assigned_operator_id" INT REFERENCES "users" ("id") ON DELETE CASCADE
);
COMMENT ON COLUMN "leads"."id" IS 'Auto-increment primary key';
COMMENT ON COLUMN "leads"."first_name" IS 'Lead''s first name';
COMMENT ON COLUMN "leads"."last_name" IS 'Lead''s last name';
COMMENT ON COLUMN "leads"."email" IS 'Lead''s email address';
COMMENT ON COLUMN "leads"."phone" IS 'Lead''s phone number';
COMMENT ON COLUMN "leads"."status" IS 'Lead status: ''uncontacted'', ''contacted'', ''qualified'', ''converted'', ''lost''';
COMMENT ON COLUMN "leads"."assigned_operator_id" IS 'Operator assigned to handle this lead';
COMMENT ON TABLE "leads" IS 'Lead model representing potential clients or business opportunities.';
CREATE TABLE IF NOT EXISTS "lead_comments" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lead_id" INT NOT NULL REFERENCES "leads" ("id") ON DELETE CASCADE,
    "user_id" INT NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE
);
COMMENT ON COLUMN "lead_comments"."id" IS 'Auto-increment primary key';
COMMENT ON COLUMN "lead_comments"."comment" IS 'Comment text';
COMMENT ON COLUMN "lead_comments"."lead_id" IS 'Lead this comment belongs to';
COMMENT ON COLUMN "lead_comments"."user_id" IS 'User who authored this comment';
COMMENT ON TABLE "lead_comments" IS 'Lead comment model for tracking comments on leads.';
CREATE TABLE IF NOT EXISTS "products" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "name" VARCHAR(200) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "price" DECIMAL(15,2),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON COLUMN "products"."id" IS 'Auto-increment primary key';
COMMENT ON COLUMN "products"."name" IS 'Product name';
COMMENT ON COLUMN "products"."type" IS 'Product type: e.g., ''Insurance'', ''Real Estate'', ''Service''';
COMMENT ON COLUMN "products"."description" IS 'Product description';
COMMENT ON COLUMN "products"."price" IS 'Product price';
COMMENT ON TABLE "products" IS 'Product/Service model representing products or services offered.';
CREATE TABLE IF NOT EXISTS "clients" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "full_name" VARCHAR(200) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20),
    "address" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INT NOT NULL UNIQUE REFERENCES "users" ("id") ON DELETE CASCADE
);
COMMENT ON COLUMN "clients"."id" IS 'Auto-increment primary key';
COMMENT ON COLUMN "clients"."full_name" IS 'Client''s full name';
COMMENT ON COLUMN "clients"."email" IS 'Client''s email address';
COMMENT ON COLUMN "clients"."phone" IS 'Client''s phone number';
COMMENT ON COLUMN "clients"."address" IS 'Client''s address';
COMMENT ON COLUMN "clients"."user_id" IS 'User account linked to this client (must have Client role)';
COMMENT ON TABLE "clients" IS 'Client model representing confirmed clients.';
CREATE TABLE IF NOT EXISTS "client_products" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "assigned_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "client_id" INT NOT NULL REFERENCES "clients" ("id") ON DELETE CASCADE,
    "product_id" INT NOT NULL REFERENCES "products" ("id") ON DELETE CASCADE,
    CONSTRAINT "uid_client_prod_client__603f7f" UNIQUE ("client_id", "product_id")
);
COMMENT ON COLUMN "client_products"."id" IS 'Auto-increment primary key';
COMMENT ON COLUMN "client_products"."assigned_at" IS 'When the product was assigned';
COMMENT ON COLUMN "client_products"."client_id" IS 'Client this product is assigned to';
COMMENT ON COLUMN "client_products"."product_id" IS 'Product assigned to the client';
COMMENT ON TABLE "client_products" IS 'Client-Product relationship model.';
CREATE TABLE IF NOT EXISTS "client_comments" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "client_id" INT NOT NULL REFERENCES "clients" ("id") ON DELETE CASCADE,
    "user_id" INT NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE
);
COMMENT ON COLUMN "client_comments"."id" IS 'Auto-increment primary key';
COMMENT ON COLUMN "client_comments"."comment" IS 'Comment text';
COMMENT ON COLUMN "client_comments"."client_id" IS 'Client this comment belongs to';
COMMENT ON COLUMN "client_comments"."user_id" IS 'User who authored this comment';
COMMENT ON TABLE "client_comments" IS 'Client comment model for tracking comments on clients.';
CREATE TABLE IF NOT EXISTS "claims" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "status" VARCHAR(9) NOT NULL DEFAULT 'submitted',
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assigned_operator_id" INT REFERENCES "users" ("id") ON DELETE CASCADE,
    "assigned_supervisor_id" INT REFERENCES "users" ("id") ON DELETE CASCADE,
    "client_id" INT NOT NULL REFERENCES "clients" ("id") ON DELETE CASCADE
);
COMMENT ON COLUMN "claims"."id" IS 'Auto-increment primary key';
COMMENT ON COLUMN "claims"."status" IS 'Claim status: ''submitted'', ''in_review'', ''resolved''';
COMMENT ON COLUMN "claims"."description" IS 'Claim description';
COMMENT ON COLUMN "claims"."assigned_operator_id" IS 'Operator assigned to handle this claim';
COMMENT ON COLUMN "claims"."assigned_supervisor_id" IS 'Supervisor assigned to oversee this claim';
COMMENT ON COLUMN "claims"."client_id" IS 'Client who submitted this claim';
COMMENT ON TABLE "claims" IS 'Claim model representing client claims or requests.';
CREATE TABLE IF NOT EXISTS "claim_files" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "file_path" VARCHAR(500) NOT NULL,
    "uploaded_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "claim_id" INT NOT NULL REFERENCES "claims" ("id") ON DELETE CASCADE
);
COMMENT ON COLUMN "claim_files"."id" IS 'Auto-increment primary key';
COMMENT ON COLUMN "claim_files"."file_path" IS 'Path to the file (PDF/JPG/PNG)';
COMMENT ON COLUMN "claim_files"."uploaded_at" IS 'When the file was uploaded';
COMMENT ON COLUMN "claim_files"."claim_id" IS 'Claim this file belongs to';
COMMENT ON TABLE "claim_files" IS 'Claim file model for storing file attachments related to claims.';
CREATE TABLE IF NOT EXISTS "claim_comments" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "claim_id" INT NOT NULL REFERENCES "claims" ("id") ON DELETE CASCADE,
    "user_id" INT NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE
);
COMMENT ON COLUMN "claim_comments"."id" IS 'Auto-increment primary key';
COMMENT ON COLUMN "claim_comments"."comment" IS 'Comment text';
COMMENT ON COLUMN "claim_comments"."claim_id" IS 'Claim this comment belongs to';
COMMENT ON COLUMN "claim_comments"."user_id" IS 'User who authored this comment';
COMMENT ON TABLE "claim_comments" IS 'Claim comment model for tracking comments on claims.';
CREATE TABLE IF NOT EXISTS "activity_logs" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "action" VARCHAR(200) NOT NULL,
    "target_type" VARCHAR(50) NOT NULL,
    "target_id" INT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INT NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE
);
COMMENT ON COLUMN "activity_logs"."id" IS 'Auto-increment primary key';
COMMENT ON COLUMN "activity_logs"."action" IS 'Action performed, e.g., ''updated claim'', ''converted lead''';
COMMENT ON COLUMN "activity_logs"."target_type" IS 'Type of target: ''lead'', ''client'', ''claim''';
COMMENT ON COLUMN "activity_logs"."target_id" IS 'ID of the target entity';
COMMENT ON COLUMN "activity_logs"."user_id" IS 'User who performed the action';
COMMENT ON TABLE "activity_logs" IS 'Activity log model for tracking user actions in the system.';
CREATE TABLE IF NOT EXISTS "aerich" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "version" VARCHAR(255) NOT NULL,
    "app" VARCHAR(100) NOT NULL,
    "content" JSONB NOT NULL
);
CREATE TABLE IF NOT EXISTS "models.UserRole" (
    "users_id" INT NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
    "role_id" INT NOT NULL REFERENCES "roles" ("id") ON DELETE CASCADE
);
COMMENT ON TABLE "models.UserRole" IS 'User roles (many-to-many)';
CREATE UNIQUE INDEX IF NOT EXISTS "uidx_models.User_users_i_89caf1" ON "models.UserRole" ("users_id", "role_id");"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        """


MODELS_STATE = (
    "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"
)
