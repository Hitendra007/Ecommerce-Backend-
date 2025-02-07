# EliteTechPark E-commerce API

This is a Node.js-based e-commerce API with role-based access control (admin, staff, vendor, buyer). It uses MongoDB for data storage and JWT for authentication.

## Features
- **Role-Based Access Control**:
  - Admin: Full system access
  - Staff: Manage products for assigned vendors
  - Vendor: Manage their own products
  - Buyer: Browse products and view profile
- **Product Management**:
  - Create, read, update, and delete products
  - Unique product URLs
  - Discount calculations (percentage and amount)
- **Authentication**:
  - JWT-based authentication
  - Refresh token support
- **File Uploads**:
  - Upload product images using Multer and Cloudinary
- **Pagination & Search**:
  - Server-side pagination
  - Search products by name or description

## Technologies Used
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **File Upload**: Multer, Cloudinary
- **API Testing**: Postman

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/elite-techpark-ecommerce.git
   cd elite-techpark-ecommerce
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     PORT=8000
     MONGODB_URI=mongodb://localhost:27017/elite-db
     ACCESS_TOKEN_SECRET=your-access-token-secret
     REFRESH_TOKEN_SECRET=your-refresh-token-secret
     CLOUDINARY_CLOUD_NAME=your-cloud-name
     CLOUDINARY_API_KEY=your-api-key
     CLOUDINARY_API_SECRET=your-api-secret
     CORS_ORIGIN=http://localhost:3000
     ```
4. Start the server:
   ```bash
   npm start
   ```

## API Documentation
- **Postman Collection**: [Download Here](#) (Link to the Postman collection file)
- **MongoDB Schema**: [View Schema](#) (Link to the schema documentation file)

## Endpoints
### Auth
- `POST /api/auth/register` - Register a new user/vendor
- `POST /api/auth/login` - Login and get JWT tokens

### Admin
- `GET /api/admin/getAllUsers` - Get all users
- `GET /api/admin/getVendors` - Get all vendors
- `GET /api/admin/adminGetAllProducts` - Get all products (paginated)
- `GET /api/admin/getStaff` - Get all staff members
- `POST /api/admin/createStaff` - Create a new staff member
- `POST /api/admin/adminCreateProduct` - Admin creates a new product
- `PATCH /api/admin/adminUpdateProduct/:id` - Admin updates a product
- `DELETE /api/admin/adminDeleteProduct/:id` - Admin deletes a product

### Staff
- `GET /api/staff/getStaffProducts` - Get all products created by staff
- `POST /api/staff/createStaffProducts` - Create a product for assigned vendors

### Vendor
- `GET /api/vendor/getVendorProducts` - Get all vendor's products
- `POST /api/vendor/createVendorProduct` - Create a new product

### Buyer
- `GET /api/user/getProfile` - Get user profile
- `GET /api/user/getAllProducts` - Browse all products (paginated)

