### **Postman Collection Documentation (Markdown)**

```markdown
# EliteTechPark E-commerce API Documentation

## Base URL
```
http://localhost:8000/api/v1
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```http
Authorization: Bearer <ACCESS_TOKEN>
```

---

## Endpoints

### **Auth Routes (`/auth`)**
| Method | Endpoint          | Description                |
|--------|-------------------|----------------------------|
| POST   | `/register`       | Register new user/vendor   |
| POST   | `/login`          | Login and get JWT tokens   |
| POST   | `/logout`         | Logout user                |

---

### **Admin Routes (`/admin`)**
| Method | Endpoint                  | Description                          |
|--------|---------------------------|--------------------------------------|
| GET    | `/getAllUsers`            | Get all users                        |
| GET    | `/getVendors`             | Get all vendors                      |
| GET    | `/getStaff`               | Get all staff members                |
| POST   | `/createStaff`            | Create new staff account             |
| POST   | `/adminCreateProduct`     | Create new product (with images)     |
| GET    | `/adminGetAllProducts`    | Get all products (paginated)         |
| PATCH  | `/adminUpdateProduct/:id` | Update product by ID                 |
| DELETE | `/adminDeleteProduct/:id` | Delete product by ID                 |

---

### **Staff Routes (`/staff`)**
| Method | Endpoint                  | Description                          |
|--------|---------------------------|--------------------------------------|
| POST   | `/createStaffProducts`    | Create product for assigned vendors  |
| GET    | `/getStaffProducts`       | Get staff-created products           |

---

### **Vendor Routes (`/vendor`)**
| Method | Endpoint                  | Description                          |
|--------|---------------------------|--------------------------------------|
| POST   | `/createVendorProduct`    | Create new product                   |
| GET    | `/getVendorProducts`      | Get vendor's products                |

---

### **Buyer Routes (`/buyer`)**
| Method | Endpoint                  | Description                          |
|--------|---------------------------|--------------------------------------|
| GET    | `/getProfile`             | Get buyer profile                    |
| GET    | `/getAllProducts`         | Browse all products                  |

---

## Example Requests

### **Register User**
```http
POST {{base_url}}/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "buyer"
}
```

### **Create Product (Admin)**
```http
POST {{base_url}}/admin/adminCreateProduct
Content-Type: multipart/form-data
Authorization: Bearer {{admin_token}}

form-data:
- name: "Premium Laptop"
- description: "High performance laptop"
- category: "Electronics"
- oldPrice: 999.99
- newPrice: 899.99
- images: (file upload)
```

### **Get Products (Buyer)**
```http
GET {{base_url}}/buyer/getAllProducts?page=1&limit=10
```

---

## Response Structure
Successful responses follow this format:
```json
{
  "statusCode": 200,
  "data": {...},
  "message": "Success message"
}
```

---

## Error Responses
```json
{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Error description"
}
```

---

## Collection Setup
1. Import the Postman collection JSON file.
2. Set environment variables:
   - `base_url`: `http://localhost:8000/api/v1`
   - `admin_token`: JWT token for admin user
   - `staff_token`: JWT token for staff user
   - `vendor_token`: JWT token for vendor user
   - `buyer_token`: JWT token for buyer user

[Download Postman Collection](#) (Attach your `.postman_collection.json` file)
```

---

### **Postman Collection JSON**

Here’s the **Postman Collection JSON** file based on your routes and controllers:

```json
{
  "info": {
    "_postman_id": "a26f8979-7ef3-4aca-b673-2f3fd5369cd1",
    "name": "EliteTechParkEcommerce",
    "schema": "https://schema.getpostman.com/json/collection/v2.0.0/collection.json",
    "_exporter_id": "32258633"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register User/Vendor",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": JSON.stringify({
                "name": "John Doe",
                "email": "john@example.com",
                "password": "password123",
                "role": "buyer"
              }, null, 4)
            },
            "url": "{{base_url}}/auth/register"
          },
          "response": [
            {
              "name": "Success",
              "code": 201,
              "body": JSON.stringify({
                "statusCode": 201,
                "data": {
                  "user": {
                    "_id": "65a1b2c3d4e5f6g7h8i9j0k",
                    "name": "John Doe",
                    "email": "john@example.com",
                    "role": "buyer"
                  },
                  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                },
                "message": "User registered successfully"
              }, null, 4)
            }
          ]
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": JSON.stringify({
                "email": "john@example.com",
                "password": "password123"
              }, null, 4)
            },
            "url": "{{base_url}}/auth/login"
          },
          "response": [
            {
              "name": "Success",
              "code": 200,
              "body": JSON.stringify({
                "statusCode": 200,
                "data": {
                  "user": {
                    "_id": "65a1b2c3d4e5f6g7h8i9j0k",
                    "name": "John Doe",
                    "email": "john@example.com",
                    "role": "buyer"
                  },
                  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                },
                "message": "Login successful"
              }, null, 4)
            }
          ]
        },
        {
          "name": "Logout",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{buyer_token}}"
              }
            ],
            "url": "{{base_url}}/auth/logout"
          },
          "response": [
            {
              "name": "Success",
              "code": 200,
              "body": JSON.stringify({
                "statusCode": 200,
                "message": "Logged out successfully"
              }, null, 4)
            }
          ]
        }
      ]
    },
    {
      "name": "Admin",
      "item": [
        {
          "name": "Get All Users",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{admin_token}}"
              }
            ],
            "url": "{{base_url}}/admin/getAllUsers"
          },
          "response": [
            {
              "name": "Success",
              "code": 200,
              "body": JSON.stringify({
                "statusCode": 200,
                "data": [
                  {
                    "_id": "65a1b2c3d4e5f6g7h8i9j0k",
                    "name": "Admin User",
                    "email": "admin@example.com",
                    "role": "admin"
                  }
                ],
                "message": "All users fetched"
              }, null, 4)
            }
          ]
        },
        {
          "name": "Create Product",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{admin_token}}"
              }
            ],
            "body": {
              "mode": "form-data",
              "formdata": [
                {
                  "key": "name",
                  "value": "Premium Laptop"
                },
                {
                  "key": "description",
                  "value": "High performance laptop"
                },
                {
                  "key": "category",
                  "value": "Electronics"
                },
                {
                  "key": "startDate",
                  "value": "2024-01-01"
                },
                {
                  "key": "oldPrice",
                  "value": "999.99"
                },
                {
                  "key": "newPrice",
                  "value": "899.99"
                },
                {
                  "key": "vendorId",
                  "value": "65a1b2c3d4e5f6g7h8i9j0k"
                },
                {
                  "key": "images",
                  "type": "file",
                  "src": "/path/to/image.jpg"
                }
              ]
            },
            "url": "{{base_url}}/admin/adminCreateProduct"
          },
          "response": [
            {
              "name": "Success",
              "code": 201,
              "body": JSON.stringify({
                "statusCode": 201,
                "data": {
                  "product": {
                    "name": "Premium Laptop",
                    "productURL": "premium-laptop-abc123",
                    "discountPercentage": 10.0,
                    "discountAmount": 100.0
                  }
                },
                "message": "Product created successfully by admin"
              }, null, 4)
            }
          ]
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:8000/api/v1"
    },
    {
      "key": "admin_token",
      "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    {
      "key": "staff_token",
      "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    {
      "key": "vendor_token",
      "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    {
      "key": "buyer_token",
      "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  ]
}
```
