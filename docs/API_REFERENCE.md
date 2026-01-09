# API Reference 📡

Complete reference for all MarkMyCampus API endpoints.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Most endpoints require authentication. Include the JWT token in the request header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Endpoints Overview

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/register` | No | Register a new user |
| POST | `/api/login` | No | Login existing user |
| POST | `/api/logout` | No | Logout user |
| POST | `/api/markers` | Yes | Add a new marker |
| GET | `/api/markers` | Yes | Get all markers |
| GET | `/api/stats` | Yes | Get statistics by category |

---

## Authentication Endpoints

### Register User

Create a new user account.

**Endpoint**: `POST /api/register`

**Request Body**:
```json
{
  "username": "string (required)",
  "password": "string (required, min 6 characters)"
}
```

**Success Response** (201):
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "username": "johndoe"
}
```

**Error Responses**:

- **400 Bad Request**: Missing or invalid fields
  ```json
  {
    "error": "Username and password are required"
  }
  ```
  
- **400 Bad Request**: Username already exists
  ```json
  {
    "error": "Username already exists"
  }
  ```

**Example (curl)**:
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","password":"securepass123"}'
```

**Example (JavaScript)**:
```javascript
const response = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        username: 'johndoe',
        password: 'securepass123'
    })
});
const data = await response.json();
```

---

### Login User

Authenticate an existing user.

**Endpoint**: `POST /api/login`

**Request Body**:
```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```

**Success Response** (200):
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "username": "johndoe"
}
```

**Error Responses**:

- **400 Bad Request**: Missing credentials
  ```json
  {
    "error": "Username and password are required"
  }
  ```

- **401 Unauthorized**: Invalid credentials
  ```json
  {
    "error": "Invalid username or password"
  }
  ```

**Example (curl)**:
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","password":"securepass123"}'
```

---

### Logout User

End the user session.

**Endpoint**: `POST /api/logout`

**Request Body**: None

**Success Response** (200):
```json
{
  "message": "Logged out successfully"
}
```

---

## Marker Endpoints

### Add Marker

Add a new point of interest to the map.

**Endpoint**: `POST /api/markers`

**Authentication**: Required

**Request Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body**:
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "category": "seating",
  "description": "Need more benches here"
}
```

**Fields**:
- `latitude` (required): Latitude coordinate (number)
- `longitude` (required): Longitude coordinate (number)
- `category` (optional): Category type (string, default: "general")
  - Options: `general`, `seating`, `study`, `social`, `food`, `other`
- `description` (optional): Text description (string)

**Success Response** (200):
```json
{
  "message": "Marker added successfully",
  "markerId": 1,
  "latitude": 40.7128,
  "longitude": -74.0060,
  "category": "seating",
  "description": "Need more benches here"
}
```

**Error Responses**:

- **400 Bad Request**: Missing coordinates
  ```json
  {
    "error": "Latitude and longitude are required"
  }
  ```

- **401 Unauthorized**: No token provided
  ```json
  {
    "error": "Access denied. No token provided."
  }
  ```

- **403 Forbidden**: Invalid token
  ```json
  {
    "error": "Invalid token"
  }
  ```

**Example (curl)**:
```bash
TOKEN="your_jwt_token_here"
curl -X POST http://localhost:3000/api/markers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "latitude": 40.7128,
    "longitude": -74.0060,
    "category": "seating",
    "description": "Need more benches"
  }'
```

**Example (JavaScript)**:
```javascript
const response = await fetch('/api/markers', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
        latitude: 40.7128,
        longitude: -74.0060,
        category: 'seating',
        description: 'Need more benches here'
    })
});
const data = await response.json();
```

---

### Get All Markers

Retrieve all marked points of interest.

**Endpoint**: `GET /api/markers`

**Authentication**: Required

**Request Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response** (200):
```json
{
  "markers": [
    {
      "id": 1,
      "latitude": 40.7128,
      "longitude": -74.0060,
      "category": "seating",
      "description": "Need more benches",
      "created_at": "2024-01-09 12:34:56"
    },
    {
      "id": 2,
      "latitude": 40.7130,
      "longitude": -74.0065,
      "category": "study",
      "description": "Great spot for outdoor study",
      "created_at": "2024-01-09 13:45:12"
    }
  ]
}
```

**Error Responses**:

- **401 Unauthorized**: No token provided
- **403 Forbidden**: Invalid token
- **500 Internal Server Error**: Database error

**Example (curl)**:
```bash
TOKEN="your_jwt_token_here"
curl -X GET http://localhost:3000/api/markers \
  -H "Authorization: Bearer $TOKEN"
```

**Example (JavaScript)**:
```javascript
const response = await fetch('/api/markers', {
    headers: {
        'Authorization': `Bearer ${authToken}`
    }
});
const data = await response.json();
console.log(data.markers);
```

---

## Statistics Endpoints

### Get Statistics

Get aggregated statistics by category.

**Endpoint**: `GET /api/stats`

**Authentication**: Required

**Request Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response** (200):
```json
{
  "stats": [
    {
      "category": "seating",
      "count": 15
    },
    {
      "category": "study",
      "count": 8
    },
    {
      "category": "social",
      "count": 12
    },
    {
      "category": "food",
      "count": 5
    }
  ]
}
```

**Error Responses**:

- **401 Unauthorized**: No token provided
- **403 Forbidden**: Invalid token
- **500 Internal Server Error**: Database error

**Example (curl)**:
```bash
TOKEN="your_jwt_token_here"
curl -X GET http://localhost:3000/api/stats \
  -H "Authorization: Bearer $TOKEN"
```

**Example (JavaScript)**:
```javascript
const response = await fetch('/api/stats', {
    headers: {
        'Authorization': `Bearer ${authToken}`
    }
});
const data = await response.json();
console.log(data.stats);
```

---

## Response Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Invalid or expired token |
| 500 | Internal Server Error | Server error |

---

## Error Handling

All error responses follow this format:

```json
{
  "error": "Error message description"
}
```

**Best Practices**:
1. Always check response status before parsing data
2. Handle errors gracefully in your frontend
3. Display user-friendly error messages
4. Log errors for debugging

**Example Error Handling**:
```javascript
try {
    const response = await fetch('/api/markers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(markerData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        // Handle error
        console.error('Error:', data.error);
        alert(`Failed to add marker: ${data.error}`);
        return;
    }
    
    // Success
    console.log('Marker added:', data);
} catch (error) {
    console.error('Network error:', error);
    alert('Failed to connect to server');
}
```

---

## Rate Limiting (Future Enhancement)

For production, consider implementing rate limiting:

```javascript
// Example with express-rate-limit
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## Authentication Flow

1. **User Registration/Login**
   ```
   POST /api/register or /api/login
   ↓
   Receive JWT token
   ↓
   Store token in sessionStorage
   ```

2. **Making Authenticated Requests**
   ```
   Include token in Authorization header
   ↓
   Server verifies token
   ↓
   Process request
   ```

3. **Token Expiration**
   - Tokens expire after 24 hours
   - User must log in again
   - Frontend should handle 403 errors and redirect to login

---

## Testing the API

### Using Postman

1. **Register User**:
   - Method: POST
   - URL: `http://localhost:3000/api/register`
   - Body (JSON):
     ```json
     {
       "username": "testuser",
       "password": "password123"
     }
     ```
   - Copy the token from response

2. **Add Marker**:
   - Method: POST
   - URL: `http://localhost:3000/api/markers`
   - Headers:
     - `Authorization: Bearer YOUR_TOKEN`
     - `Content-Type: application/json`
   - Body (JSON):
     ```json
     {
       "latitude": 40.7128,
       "longitude": -74.0060,
       "category": "seating",
       "description": "Need benches"
     }
     ```

3. **Get Markers**:
   - Method: GET
   - URL: `http://localhost:3000/api/markers`
   - Headers:
     - `Authorization: Bearer YOUR_TOKEN`

---

## Security Notes

⚠️ **Important**:

1. **Always use HTTPS in production**
2. **Store JWT secret in environment variables**
3. **Never commit secrets to version control**
4. **Implement rate limiting to prevent abuse**
5. **Validate and sanitize all user inputs**
6. **Use strong password requirements**
7. **Consider adding CORS configuration** for specific domains

---

## Advanced Features (Optional)

### Add User Roles

Extend the users table to include roles (student, admin):

```sql
ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'student';
```

### Add Marker Voting

Allow users to upvote markers:

```sql
CREATE TABLE votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    marker_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (marker_id) REFERENCES markers (id)
);
```

### Add Comments

Allow users to comment on markers:

```sql
CREATE TABLE comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    marker_id INTEGER,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (marker_id) REFERENCES markers (id)
);
```

---

## Support

For questions or issues with the API:
1. Check this documentation
2. Review the backend guide
3. Test endpoints with curl or Postman
4. Open an issue on GitHub

**Happy coding!** 🚀
