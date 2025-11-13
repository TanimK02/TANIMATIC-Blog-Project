# API Documentation

## Table of Contents
- [Authentication](#authentication)
- [User Routes](#user-routes)
- [Admin Routes](#admin-routes)
- [Posts Routes](#posts-routes)
- [Comment Routes](#comment-routes)

---

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Middleware
- **requireUser**: Requires a valid JWT token
- **requireAdmin**: Requires a valid JWT token and admin privileges

---

## User Routes

Base path: `/user`

### Sign Up
Create a new user account.

**Endpoint:** `POST /user/sign-up`

**Authentication:** None required

**Request Body:**
```json
{
  "username": "string (required)",
  "email": "string (required, valid email)",
  "password": "string (required, min 6 characters)"
}
```

**Response:** `201 Created`
```json
{
  "message": "User registered successfully",
  "user": "{userId, username, admin}",
  "token": "jwt_token_string"
}
```

**Error Responses:**
- `400 Bad Request`: Validation errors
- `500 Internal Server Error`: Server error

---

### Login
Authenticate and receive a JWT token.

**Endpoint:** `POST /user/login`

**Authentication:** None required

**Request Body:**
```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```

**Response:** `200 OK`
```json
{
  "message": "User logged in successfully",
  "user": "{userId, username, admin}",
  "token": "jwt_token_string"
}
```

**Error Responses:**
- `400 Bad Request`: Validation errors
- `401 Unauthorized`: Invalid credentials
- `500 Internal Server Error`: Server error

---

### Get Current User
Get the currently authenticated user's information.

**Endpoint:** `GET /user/me`

**Authentication:** Required (requireUser)

**Response:** `200 OK`
```json
{
  "id": 1,
  "username": "string",
  "email": "string",
  "admin": false
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: User not found
- `500 Internal Server Error`: Server error

---

## Admin Routes

Base path: `/admin`

### Submit Secret Code
Promote a user to admin status using a secret code.

**Endpoint:** `POST /admin/secretCode`

**Authentication:** Required (requireUser)

**Request Body:**
```json
{
  "code": "string (required)"
}
```

**Response:** `200 OK`
```json
{
  "message": "User promoted to admin successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Validation errors or invalid code
- `401 Unauthorized`: Invalid or missing token
- `500 Internal Server Error`: Server error

---

### Get Admin Posts (Paginated)
Retrieve a paginated list of posts created by the authenticated admin.

**Endpoint:** `GET /admin/posts/:page`

**Authentication:** Required (requireUser, requireAdmin)

**URL Parameters:**
- `page` (integer): Page number (default: 1)

**Query Parameters:**
- Page size is fixed at 10 posts per page

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "string",
    "content": "string",
    "bannerImg": "string",
    "published": false,
    "publicationDate": "2025-11-11T00:00:00.000Z",
    "authorId": 1
  }
]
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: User is not an admin
- `500 Internal Server Error`: Server error

---

### Get Single Post (Admin)
Retrieve a specific post by ID (admin's own posts only).

**Endpoint:** `GET /admin/posts/:id`

**Authentication:** Required (requireUser, requireAdmin)

**URL Parameters:**
- `id` (integer): Post ID

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "string",
  "content": "string",
  "bannerImg": "string",
  "published": false,
  "publicationDate": "2025-11-11T00:00:00.000Z",
  "authorId": 1
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: User is not an admin
- `404 Not Found`: Post not found
- `500 Internal Server Error`: Server error

---

### Create Post
Create a new blog post.

**Endpoint:** `POST /admin/posts`

**Authentication:** Required (requireUser, requireAdmin)

**Content-Type:** `multipart/form-data`

**Request Body:**
```json
{
  "title": "string (required)",
  "content": "string",
  "tags": ["string"] (array, max 5 items),
  "bannerImg": "file (optional, image only, max 10MB)"
}
```

**Response:** `201 Created`
```json
{
  "message": "Post created successfully",
  "postId": 1
}
```

**Error Responses:**
- `400 Bad Request`: Validation errors or invalid file type
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: User is not an admin
- `500 Internal Server Error`: Server error

---

### Update Post
Update an existing blog post.

**Endpoint:** `PUT /admin/posts/:id`

**Authentication:** Required (requireUser, requireAdmin)

**Content-Type:** `multipart/form-data`

**URL Parameters:**
- `id` (integer): Post ID

**Request Body:**
```json
{
  "title": "string (required)",
  "content": "string",
  "tags": ["string"] (array, max 5 items),
  "bannerImg": "file (optional, image only, max 10MB)"
}
```

**Response:** `200 OK`
```json
{
  "message": "Post updated successfully",
  "post": {
    "id": 1,
    "title": "string",
    "content": "string",
    "bannerImg": "string",
    "published": false,
    "publicationDate": "2025-11-11T00:00:00.000Z",
    "authorId": 1
  }
}
```

**Error Responses:**
- `400 Bad Request`: Validation errors or invalid file type
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: User is not an admin
- `500 Internal Server Error`: Server error

---

### Delete Post
Delete a blog post.

**Endpoint:** `DELETE /admin/posts/:id`

**Authentication:** Required (requireUser, requireAdmin)

**URL Parameters:**
- `id` (integer): Post ID

**Response:** `200 OK`
```json
{
  "message": "Post deleted successfully"
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: User is not an admin
- `500 Internal Server Error`: Server error

---

### Publish Post
Publish a draft post.

**Endpoint:** `PUT /admin/posts/:id/publish`

**Authentication:** Required (requireUser, requireAdmin)

**URL Parameters:**
- `id` (integer): Post ID

**Response:** `200 OK`
```json
{
  "message": "Post published successfully",
  "post": {
    "id": 1,
    "title": "string",
    "content": "string",
    "bannerImg": "string",
    "published": true,
    "publicationDate": "2025-11-11T00:00:00.000Z",
    "authorId": 1
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: User is not an admin
- `500 Internal Server Error`: Server error

---

### Unpublish Post
Unpublish a published post.

**Endpoint:** `PUT /admin/posts/:id/unpublish`

**Authentication:** Required (requireUser, requireAdmin)

**URL Parameters:**
- `id` (integer): Post ID

**Response:** `200 OK`
```json
{
  "message": "Post unpublished successfully",
  "post": {
    "id": 1,
    "title": "string",
    "content": "string",
    "bannerImg": "string",
    "published": false,
    "publicationDate": null,
    "authorId": 1
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: User is not an admin
- `500 Internal Server Error`: Server error

---

### Upload Picture
Upload an image to Supabase storage (for use in post content).

**Endpoint:** `POST /admin/pictureUpload`

**Authentication:** Required (requireUser, requireAdmin)

**Content-Type:** `multipart/form-data`

**Request Body:**
```json
{
  "image": "file (required, image only, max 10MB)"
}
```

**Response:** `200 OK`
```json
{
  "imageUrl": "https://supabase.storage.url/image.jpg"
}
```

**Error Responses:**
- `400 Bad Request`: No file uploaded or invalid file type
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: User is not an admin
- `500 Internal Server Error`: Server error

---

## Posts Routes

Base path: `/posts`

### Get Published Posts (Paginated)
Retrieve a paginated list of published posts.

**Endpoint:** `GET /posts/page/:page`

**Authentication:** None required

**URL Parameters:**
- `page` (integer): Page number (default: 1)

**Query Parameters:**
- Page size is fixed at 10 posts per page

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "string",
    "content": "string",
    "bannerImg": "string",
    "published": true,
    "publicationDate": "2025-11-11T00:00:00.000Z",
    "authorId": 1,
    "tags": [
      {
        "id": 1,
        "name": "string"
      }
    ]
  }
]
```

**Notes:**
- Only returns published posts
- Posts are ordered by publication date (newest first)

**Error Responses:**
- `500 Internal Server Error`: Server error

---

### Get Single Published Post
Retrieve a specific published post by ID.

**Endpoint:** `GET /posts/posts/:id`

**Authentication:** None required

**URL Parameters:**
- `id` (integer): Post ID

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "string",
  "content": "string",
  "bannerImg": "string",
  "published": true,
  "publicationDate": "2025-11-11T00:00:00.000Z",
  "authorId": 1,
  "tags": [
    {
      "id": 1,
      "name": "string"
    }
  ]
}
```

**Notes:**
- Only returns published posts

**Error Responses:**
- `404 Not Found`: Post not found or not published
- `500 Internal Server Error`: Server error

---

## Comment Routes

Base path: `/comment`

### Get Comments (Paginated)
Retrieve paginated comments for a specific post.

**Endpoint:** `GET /comment/:postId/:commentPage`

**Authentication:** None required

**URL Parameters:**
- `postId` (integer): Post ID
- `commentPage` (integer): Page number

**Query Parameters:**
- Page size is fixed at 10 comments per page

**Response:** `200 OK`
```json
{
  "comments": [
    {
      "id": 1,
      "content": "string",
      "postId": 1,
      "authorId": 1,
      "createdAt": "2025-11-11T00:00:00.000Z",
      "updatedAt": "2025-11-11T00:00:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `500 Internal Server Error`: Server error

---

### Create Comment
Create a new comment on a post.

**Endpoint:** `POST /comment/:postId`

**Authentication:** Required (requireUser)

**URL Parameters:**
- `postId` (integer): Post ID

**Request Body:**
```json
{
  "content": "string (required)"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "content": "string",
  "postId": 1,
  "authorId": 1,
  "createdAt": "2025-11-11T00:00:00.000Z",
  "updatedAt": "2025-11-11T00:00:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request`: Validation errors
- `401 Unauthorized`: Invalid or missing token
- `500 Internal Server Error`: Server error

---

### Update Comment
Update an existing comment (author only).

**Endpoint:** `PUT /comment/:commentId`

**Authentication:** Required (requireUser)

**URL Parameters:**
- `commentId` (integer): Comment ID

**Request Body:**
```json
{
  "content": "string (required)"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "content": "string",
  "postId": 1,
  "authorId": 1,
  "createdAt": "2025-11-11T00:00:00.000Z",
  "updatedAt": "2025-11-11T00:00:00.000Z"
}
```

**Notes:**
- Only the comment author can update their comment

**Error Responses:**
- `400 Bad Request`: Validation errors
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: Not the comment author
- `404 Not Found`: Comment not found
- `500 Internal Server Error`: Server error

---

### Delete Comment
Delete a comment (author or admin only).

**Endpoint:** `DELETE /comment/:commentId`

**Authentication:** Required (requireUser)

**URL Parameters:**
- `commentId` (integer): Comment ID

**Response:** `200 OK`
```json
{
  "message": "Comment deleted successfully"
}
```

**Notes:**
- Comment authors and admins can delete comments

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: Not the comment author or admin
- `404 Not Found`: Comment not found
- `500 Internal Server Error`: Server error

---

## Error Response Format

All error responses follow this format:

```json
{
  "error": "Error message"
}
```

or for validation errors:

```json
{
  "errors": [
    {
      "msg": "Error message",
      "param": "field_name",
      "location": "body"
    }
  ]
}
```

---

## Environment Variables

The following environment variables are required:

- `JWT_SECRET`: Secret key for JWT token generation
- `SECRET_ADMIN_CODE`: Code for promoting users to admin status
- Supabase configuration (for file uploads)
- Database connection string (for Prisma)

---

## Notes

1. **Pagination**: All paginated endpoints use a page size of 10 items
2. **File Uploads**: Maximum file size is 10MB, only image files are accepted
3. **Tags**: Posts can have a maximum of 5 tags
4. **Authentication**: JWT tokens expire after 1 day
5. **Admin Access**: Admin status is required for creating, editing, and managing posts
