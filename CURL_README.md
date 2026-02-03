# POS Backend API Documentation (CURL)

This document provides a list of all available API endpoints in the POS backend, along with example `curl` commands.

**Base URL:** `http://localhost:8080`

---

## 🔐 Authentication APIs

### 1. User Signup
```bash
curl -X POST http://localhost:8080/api/auth/signup \
-H "Content-Type: application/json" \
-d '{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "companyName": "John POS",
  "address": "123 Main St"
}'
```

### 2. Admin Signup
```bash
curl -X POST http://localhost:8080/api/auth/signup/admin \
-H "Content-Type: application/json" \
-d '{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@example.com",
  "password": "adminpassword",
  "companyName": "Admin Corp"
}'
```

### 3. Signin (Get Token)
```bash
curl -X POST http://localhost:8080/api/auth/signin \
-H "Content-Type: application/json" \
-d '{
  "username": "john@example.com",
  "password": "password123"
}'
```

---

## 🧾 Order APIs
*Requires Header: `x-access-token: <TOKEN>`*

### 1. Create Order
```bash
curl -X POST http://localhost:8080/api/orders \
-H "Content-Type: application/json" \
-H "x-access-token: YOUR_JWT_TOKEN" \
-d '{
  "customerName": "Jane Smith",
  "totalAmount": 1500.50,
  "paymentMethod": "Cash",
  "totalItems": [
    { "itemName": "Burger", "price": 250, "quantity": 2 },
    { "itemName": "Fries", "price": 100, "quantity": 1 }
  ]
}'
```

### 2. Bulk Create Orders
```bash
curl -X POST http://localhost:8080/api/orders/bulk \
-H "Content-Type: application/json" \
-H "x-access-token: YOUR_JWT_TOKEN" \
-d '[
  { "customerName": "Order 1", "totalAmount": 500 },
  { "customerName": "Order 2", "totalAmount": 750 }
]'
```

### 3. Fetch All Orders
```bash
curl -X GET http://localhost:8080/api/orders \
-H "x-access-token: YOUR_JWT_TOKEN"
```

---

## 📦 Inventory APIs
*Requires Header: `x-access-token: <TOKEN>`*

### 1. Initialize Inventory (Bulk)
```bash
curl -X POST http://localhost:8080/api/inventory \
-H "Content-Type: application/json" \
-H "x-access-token: YOUR_JWT_TOKEN" \
-d '{
  "categories": [
    {
      "categoryName": "Beverages",
      "items": [
        { "itemName": "Coke", "price": 50 },
        { "itemName": "Water", "price": 20 }
      ]
    }
  ]
}'
```

### 2. Add Category
```bash
curl -X POST http://localhost:8080/api/inventory/category \
-H "Content-Type: application/json" \
-H "x-access-token: YOUR_JWT_TOKEN" \
-d '{ "categoryName": "Snacks" }'
```

### 3. Fetch Inventory
```bash
curl -X GET http://localhost:8080/api/inventory \
-H "x-access-token: YOUR_JWT_TOKEN"
```

---

## 🏢 Admin & Branch APIs
*Requires Admin Role*

### 1. Create New Branch
```bash
curl -X POST http://localhost:8080/api/admin/branches \
-H "Content-Type: application/json" \
-H "x-access-token: YOUR_ADMIN_TOKEN" \
-d '{
  "name": "Downtown Branch",
  "userEmail": "manager@downtown.com",
  "userPassword": "managerpassword",
  "location": "456 Oak St",
  "status": "Active"
}'
```

### 2. List My Branches
```bash
curl -X GET http://localhost:8080/api/admin/branches \
-H "x-access-token: YOUR_ADMIN_TOKEN"
```

---

## 🧪 Testing & Debugging

### Public Route
`curl -X GET http://localhost:8080/api/test/all`

### Protected User Route
`curl -X GET http://localhost:8080/api/test/user -H "x-access-token: TOKEN"`

### Protected Admin Route
`curl -X GET http://localhost:8080/api/test/admin -H "x-access-token: TOKEN"`
