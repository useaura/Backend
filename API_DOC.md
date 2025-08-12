## **API Documentation**

### **Authentication**

All protected routes require a JWT in the `Authorization` header:

```
Authorization: Bearer <token>
```

---

### **Public Endpoints**

#### **POST** `/api/auth/google`

Authenticate user with Google and create wallet if new.

**Body:**

```json
{
  "idToken": "GOOGLE_ID_TOKEN"
}
```

**Response:**

```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": "66b8...",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://..."
  }
}
```

---

### **Protected Endpoints**

#### **GET** `/api/wallet`

Get user’s wallet details.

**Response:**

```json
{
  "wallet": {
    "user": "66b8...",
    "address": "0xabc123...",
    "balanceUSDC": 150.5
  }
}
```

---

#### **GET** `/api/wallet/transactions`

Get recent transactions (max 20).

**Response:**

```json
{
  "transactions": [
    {
      "type": "send",
      "amountUSDC": 50,
      "status": "success",
      "counterparty": "0xdef...",
      "createdAt": "2025-08-12T15:00:00Z"
    }
  ]
}
```

---

#### **POST** `/api/wallet/preview-withdraw`

Preview a withdrawal transaction.

**Body:**

```json
{
  "toAddress": "0xdef123...",
  "amount": 100
}
```

**Response:**

```json
{
  "amount": 100,
  "fee": 0.5,
  "total": 100.5,
  "chain": "ethereum",
  "toAddress": "0xdef123..."
}
```

---

#### **POST** `/api/wallet/confirm-withdraw`

Confirm withdrawal (requires PIN).

**Body:**

```json
{
  "toAddress": "0xdef123...",
  "amount": 100,
  "pin": "1234"
}
```

**Response:**

```json
{
  "tx": {
    "type": "send",
    "amountUSDC": 100,
    "status": "success"
  },
  "wallet": {
    "balanceUSDC": 50.5
  }
}
```

---

#### **POST** `/api/wallet/set-pin`

Set or update wallet PIN.

**Body:**

```json
{ "pin": "1234" }
```

**Response:**

```json
{ "ok": true }
```

---

#### **GET** `/api/wallet/receive/address`

Get wallet address and QR token for receiving funds.

**Response:**

```json
{
  "address": "0xabc123...",
  "chain": "ethereum",
  "token": "YmFzZTY0ZW5jb2RlZHRva2Vu",
  "warning": "Ensure you send on Ethereum to avoid loss of funds."
}
```

---

#### **POST** `/api/wallet/simulate/receive` _(Dev Only)_

Simulate incoming payment (testing only).

**Body:**

```json
{
  "toAddress": "0xabc123...",
  "amount": 20,
  "from": "Alice"
}
```

---

#### **GET** `/api/settings`

Get user settings.

**Response:**

```json
{
  "settings": {
    "name": "John Doe",
    "email": "john@example.com",
    "panicMode": false
  }
}
```

---

#### **PUT** `/api/settings`

Update user settings (name, panic mode).

**Body:**

```json
{
  "name": "New Name",
  "panicMode": true
}
```

**Response:**

```json
{
  "settings": {
    "name": "New Name",
    "panicMode": true
  }
}
```

---

### **Error Responses** (Standard)

```json
{ "error": "Invalid token" }
```

```json
{ "error": "Insufficient funds" }
```

```json
{ "error": "Panic Mode active. Withdrawals disabled." }
```

---
