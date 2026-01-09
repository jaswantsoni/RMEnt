# Backend OAuth Requirements

## Required API Endpoints

### 1. Google OAuth Flow
```
GET /api/auth/google
- Initiates Google OAuth flow
- Query params: ?redirect=<frontend_url>
- Redirects to Google OAuth consent screen
```

### 2. OAuth Callback Handler
```
GET /api/auth/google/callback
- Handles Google OAuth callback
- Exchanges code for tokens
- Creates/updates user in database
- Redirects to frontend with token: /auth/callback?token=<jwt>&redirect=<original_url>
- On error: /auth/callback?error=<error_message>
```

### 3. Get User Profile
```
GET /api/auth/me
- Headers: Authorization: Bearer <token>
- Returns: { user: { id, email, firstName, lastName, phone, avatar } }
```

### 4. Token Refresh
```
POST /api/auth/refresh
- Headers: Authorization: Bearer <token>
- Returns: { token: <new_jwt> }
```

### 5. Token Validation
```
GET /api/auth/validate
- Headers: Authorization: Bearer <token>
- Returns: 200 if valid, 401 if invalid
```

### 6. Update Profile
```
PUT /api/auth/profile
- Headers: Authorization: Bearer <token>
- Body: { firstName, lastName, phone }
- Returns: { user: <updated_user> }
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  avatar_url TEXT,
  google_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Environment Variables Required
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```

## JWT Token Structure
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234571490
}
```

## Error Responses
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Success Responses
```json
{
  "success": true,
  "data": { ... }
}
```