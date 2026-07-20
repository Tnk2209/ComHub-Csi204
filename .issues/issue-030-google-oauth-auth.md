# Issue 030: Google OAuth Authentication

## What to build

Implement Google OAuth 2.0 registration and login flow for Customers.
Enable users to sign in and sign up with their Google accounts using a Google OAuth provider. This requires backend Passport.js setup and frontend button components.

## Acceptance criteria

- [ ] BackEnd handles Passport.js initialization with `passport-google-oauth20` strategy.
- [ ] BackEnd provides `/api/auth/google` and `/api/auth/google/callback` routes.
- [ ] Users registering/logging in via Google are saved in the `users` database table with `auth_provider = 'google'` and their unique `google_id`.
- [ ] FrontEnd login and register pages (`Auth.jsx`) render "Sign in with Google" and "Sign up with Google" buttons that redirect to the backend OAuth initialization URL.
- [ ] Successful OAuth flow generates and returns a valid JWT session token to the user client.

## Blocked by

None - can start immediately
