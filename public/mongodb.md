# MongoDB Schema Documentation

## 1. User Collection
```json
{
  "name": { "type": "String", "required": true },
  "email": { "type": "String", "required": true, "unique": true },
  "password": { "type": "String", "required": true },
  "role": { "type": "String", "enum": ["admin", "staff", "vendor", "buyer"], "default": "buyer" },
  "refreshToken": { "type": "String" },
  "createdAt": { "type": "Date", "default": "Date.now" },
  "updatedAt": { "type": "Date", "default": "Date.now" }
}
```

## 2. Product Collection
```json
{
  "name": { "type": "String", "required": true },
  "description": { "type": "String", "required": true },
  "category": { "type": "String", "required": true },
  "startDate": { "type": "Date", "required": true },
  "expiryDate": { "type": "Date", "required": true },
  "freeDelivery": { "type": "Boolean", "default": false },
  "deliveryAmount": { "type": "Number", "default": 0 },
  "oldPrice": { "type": "Number", "required": true },
  "newPrice": { "type": "Number", "required": true },
  "productURL": { "type": "String", "required": true, "unique": true },
  "vendorId": { "type": "ObjectId", "ref": "User", "required": true },
  "createdBy": { "type": "ObjectId", "ref": "User", "required": true },
  "images": [{ "type": "String" }],
  "createdAt": { "type": "Date", "default": "Date.now" },
  "updatedAt": { "type": "Date", "default": "Date.now" }
}
```

## 3. Order Collection
```json
{
  "userId": { "type": "ObjectId", "ref": "User", "required": true },
  "products": [
    {
      "productId": { "type": "ObjectId", "ref": "Product", "required": true },
      "quantity": { "type": "Number", "required": true }
    }
  ],
  "totalAmount": { "type": "Number", "required": true },
  "status": { "type": "String", "enum": ["pending", "shipped", "delivered", "canceled"], "default": "pending" },
  "createdAt": { "type": "Date", "default": "Date.now" },
  "updatedAt": { "type": "Date", "default": "Date.now" }
}
```

## 4. Review Collection
```json
{
  "userId": { "type": "ObjectId", "ref": "User", "required": true },
  "productId": { "type": "ObjectId", "ref": "Product", "required": true },
  "rating": { "type": "Number", "min": 1, "max": 5, "required": true },
  "comment": { "type": "String", "required": true },
  "createdAt": { "type": "Date", "default": "Date.now" },
  "updatedAt": { "type": "Date", "default": "Date.now" }
}
```



