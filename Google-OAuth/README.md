# Google OAuth Authentication

This MERN app uses Passport.js Google OAuth with MongoDB-backed users and Passport sessions. It does not use JWTs.

## Setup

1. Start MongoDB locally, or choose a MongoDB Atlas connection string.
2. In `server`, copy `.env.example` to `.env` and fill in the Google OAuth credentials.
3. In Google Cloud Console, add this authorized redirect URI:

   `http://localhost:5000/auth/google/callback`

4. Install and start the server:

   ```bash
   cd server
   npm install
   npm run dev
   ```

5. In a second terminal, install and start the client:

   ```bash
   cd client
   npm install
   npm run dev
   ```

Open `http://localhost:5173`.

## Auth flow

- `GET /auth/google` starts the Google login flow.
- The callback creates or updates one MongoDB user identified by `googleId`.
- Passport serializes the user ID into the session cookie.
- `GET /api/me` restores the session after a page refresh.
- `POST /auth/logout` destroys the session and clears the cookie.
