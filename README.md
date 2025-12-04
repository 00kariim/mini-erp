# Mini ERP System (Admin / Supervisor / Operator / Client)

This project is a small ERP-style system with a **FastAPI + Tortoise ORM** backend and a **React + Vite + Ant Design** frontend.
It implements basic CRM/ERP flows for leads, clients, products, and claims with separate interfaces for **Admin**, **Supervisor**, **Operator**, and **Client**.

## 1. Tech Stack

- **Backend**
  - Python / FastAPI
  - Tortoise ORM PostgreSQL
  - JWT auth
- **Frontend**
  - React + Vite
  - Ant Design
  - React Router
  - Redux Toolkit

## 2. Project Structure

Top-level layout:

- `backend/` – FastAPI app
  - `app/main.py` – app entrypoint
  - `app/api/` – shared dependencies (auth, roles)
  - `app/api/v1/` – REST endpoints (auth, users, leads, clients, products, claims, analytics)
  - `app/models/` – Tortoise ORM models (users, roles, leads, clients, products, claims, comments, relationships)
  - `app/schemas/` – Pydantic schemas
  - `app/services/` – business logic (UserService, LeadService, ClientService, ClaimService, etc.)
  - `requirements.txt` – backend Python dependencies
- `frontend/` – React + Vite SPA
  - `src/` – React app sources
    - `pages/` – pages per role (`admin`, `supervisor`, `operator`, `client`, `auth`)
    - `components/` – forms, tables, comments, layout
    - `api/` – Axios wrappers for backend endpoints
    - `redux/` – slices and store
    - `routes/AppRoutes.jsx` – routing per role

## 3. Getting Started

### 3.1. Clone the repo

```bash
git clone <your-repo-url> mini-erp
cd mini-erp
```

### 3.2. Backend setup

From the project root:

```bash
cd backend

# (Optional but recommended) create venv
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install backend dependencies
pip install -r requirements.txt
```

Configure environment (for local dev you can keep it simple, or create `.env` and point your DB there).

Then run the API server:

```bash
uvicorn app.main:app --reload
```

By default, the API will listen on `http://127.0.0.1:8000` (or whichever host/port you configure).

You can also use the helper scripts (if present) to create a test admin user:

```bash
python create_test_admin.py
```

### 3.3. Frontend setup

In another terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server will run on something like `http://localhost:5173`.

The frontend Axios instance (`src/api/axios.js`) points to the backend API base URL; update it if your backend is not on `http://127.0.0.1:8000`.

## 4. Roles and Flows (Quick Overview)

- **Admin**
  - Dashboards / analytics
  - Manage users + roles; bind operators to supervisors
  - Manage leads (CRUD, assign, comment, convert to client)
  - Manage clients (profile, products, claims, comments)
  - Manage products
  - View and manage all claims (assign operators/supervisors, change status, comment, upload files)
- **Supervisor**
  - Supervisor dashboard (stats for operators, clients, claims)
  - View supervised operators
  - View their clients and claims
  - Manage claims for their operators (assign, change status, comment)
- **Operator**
  - Work on assigned leads (update, comment, convert to client)
  - View their clients and comments/claims
  - Work on assigned claims (status updates, comments, uploads)
- **Client**
  - View their profile and products
  - Create and view claims, upload files, add comments

## 5. Environment and Secrets

- All sensitive configuration (DB credentials, JWT secret, etc.) should be kept in `.env` files.
- The repo is configured so that `.env` and virtualenv directories are **ignored** in Git.

## 6. Linting / Formatting

- **Backend**: standard Python tools (e.g. `black`, `isort`, `flake8`) can be wired into your workflow if desired.
- **Frontend**:
  - ESLint via `npm run lint`.

 


