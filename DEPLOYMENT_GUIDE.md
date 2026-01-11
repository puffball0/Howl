# Howl Deployment Guide (Free & No Credit Card) 🚀

This guide uses **Neon.tech** (Database) and **Vercel** (Frontend & Backend) to host your app for free, usually without requiring a credit card.

## Prerequisites
-   **GitHub** Account.
-   **Vercel** Account - [Sign up](https://vercel.com/signup).
-   **Neon** Account - [Sign up](https://neon.tech/).

---

## Part 1: Push Code to GitHub
1.  Push your latest code to a GitHub repository.

---

## Part 2: Setup Database (Neon)
1.  Go to [Neon Console](https://console.neon.tech/).
2.  **Create a Project**:
    -   Name: `howl-db`
    -   Region: Choose one close to you.
    -   Click **Create Project**.
3.  **Get Connection String**:
    -   On the dashboard, look for "Connection Details".
    -   Copy the **Connection String** (it looks like `postgres://user:pass@...`).
    -   **Important**: This is your `DATABASE_URL`.

---

## Part 3: Deploy Backend (Vercel)
1.  Go to [Vercel Dashboard](https://vercel.com/dashboard).
2.  **Add New...** -> **Project**.
3.  Import your **Howl** repo.
4.  **Configure Project**:
    -   **Name**: `howl-backend`
    -   **Framework Preset**: Other
    -   **Root Directory**: Click Edit -> Select `backend`.
5.  **Environment Variables**:
    -   expand "Environment Variables".
    -   `DATABASE_URL`: (Paste your Neon connection string).
    -   `SECRET_KEY`: `any-random-string`.
    -   `ALGORITHM`: `HS256`.
    -   `ACCESS_TOKEN_EXPIRE_MINUTES`: `30`.
    -   `CORS_ORIGINS`: `*`.
6.  Click **Deploy**.
    -   Wait for it to finish.
    -   It might show a 404 page when done - **This is normal** for the root page if we didn't set one, but our API is at `/docs`.
    -   Click "Continue to Dashboard".
    -   **Copy the Domain** (e.g., `howl-backend.vercel.app`).

---

## Part 4: Deploy Frontend (Vercel)
1.  Go to [Vercel Dashboard](https://vercel.com/dashboard).
2.  **Add New...** -> **Project**.
3.  Import your **Howl** repo (Again).
4.  **Configure Project**:
    -   **Name**: `howl-frontend`
    -   **Framework Preset**: Vite (Vercel usually detects this).
    -   **Root Directory**: Click Edit -> Select `frontend`.
5.  **Environment Variables**:
    -   `VITE_API_URL`: `https://<YOUR_BACKEND_DOMAIN>` (e.g., `https://howl-backend.vercel.app`).
    -   `VITE_WS_URL`: `wss://<YOUR_BACKEND_DOMAIN>` (e.g., `wss://howl-backend.vercel.app`).
        -   *Note: Change https to wss for the websocket url.*
6.  Click **Deploy**.

---

## 🎉 You're Live!
Visit your Frontend URL (e.g., `https://howl-frontend.vercel.app`).

### Troubleshooting
-   **Backend 404**: Try visiting `https://your-backend.vercel.app/docs`. If that loads, your backend is working!
-   **Database Error**: If the app fails to load data, you might need to run migrations. Since Vercel is serverless, running migrations is tricky.
    -   **Easy Fix**: Connect to your Neon DB using a local tool (like TablePlus or DBeaver) using the connection string, and run the SQL commands manually, OR
    -   Run the backend locally *once* pointing to the remote DB to let it create tables (set `DATABASE_URL` in your local `.env` to the Neon URL and run `python main.py`).
