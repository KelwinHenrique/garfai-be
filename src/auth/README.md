# Google Authentication with Passport.js

This module implements Google OAuth 2.0 authentication using Passport.js for the GarfAI backend application.

## Setup Instructions

### 1. Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application" as the application type
6. Add a name for your OAuth client
7. Add authorized JavaScript origins (e.g., `http://localhost:3000`)
8. Add authorized redirect URIs (e.g., `http://localhost:3000/auth/google/callback`)
9. Click "Create" and note your Client ID and Client Secret

### 2. Set Environment Variables

Create a `.env` file in the root of your project with the following variables:

```
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
SESSION_SECRET=your_session_secret
```

### 3. Using Authentication in Routes

To protect routes, use the `isAuthenticated` middleware:

```typescript
import { isAuthenticated } from '../auth/auth-middleware';

// Protected route example
router.get('/protected-route', isAuthenticated, (req, res) => {
  res.json({ user: req.user });
});
```

## Authentication Flow

1. User navigates to `/auth/google`
2. User is redirected to Google's authentication page
3. After successful authentication, Google redirects to `/auth/google/callback`
4. User is redirected to `/auth/login/success` with their profile information
5. User can log out by navigating to `/auth/logout`

## User Object

The authenticated user object contains:

- `id`: Google ID
- `displayName`: Full name
- `firstName`: First name
- `lastName`: Last name
- `email`: Email address
- `photo`: Profile photo URL (if available)
