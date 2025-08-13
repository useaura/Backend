## **API Documentation**

### **Authentication**

**BaseUrl:** `http://localhost:4000`

All protected routes require a JWT in the `Authorization` header:

```
Authorization: Bearer <token>
```

---

### **Public Endpoints**

#### **GET** `/api/auth/google/url`

Authenticate user with Google and create wallet if new.

**Response:**

```json
{
  "token": "JWT_TOKEN"
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

## Profile Management

#### **GET** `/api/profile`

Get user profile information including display name, card limits, and security controls.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "displayName": "John Doe",
  "email": "john@example.com",
  "cardLimits": {
    "dailyLimit": 1000,
    "monthlyLimit": 10000,
    "currentLimit": 250
  },
  "controls": {
    "panicMode": false,
    "reversePinEnabled": true
  }
}
```

---

#### **PUT** `/api/profile/display-name`

Update user's display name.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Body:**

```json
{
  "displayName": "New Display Name"
}
```

**Response:**

```json
{
  "message": "Display name updated successfully",
  "displayName": "New Display Name"
}
```

---

#### **PUT** `/api/profile/card-limits`

Update card spending limits.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Body:**

```json
{
  "dailyLimit": 1500,
  "monthlyLimit": 15000
}
```

**Response:**

```json
{
  "message": "Card limits updated successfully",
  "cardLimits": {
    "dailyLimit": 1500,
    "monthlyLimit": 15000,
    "currentLimit": 250
  }
}
```

---

#### **PUT** `/api/profile/panic-mode`

Toggle panic mode on/off.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Body:**

```json
{
  "enabled": true
}
```

**Response:**

```json
{
  "message": "Panic mode enabled successfully",
  "panicMode": true
}
```

---

#### **PUT** `/api/profile/reverse-pin`

Toggle reverse PIN functionality.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Body:**

```json
{
  "enabled": false
}
```

**Response:**

```json
{
  "message": "Reverse PIN disabled successfully",
  "reversePinEnabled": false
}
```

---

#### **PUT** `/api/profile/change-pin`

Change card PIN.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Body:**

```json
{
  "currentPin": "0000",
  "newPin": "5678"
}
```

**Response:**

```json
{
  "message": "PIN changed successfully"
}
```

---

#### **POST** `/api/profile/verify-pin`

Verify PIN and detect panic mode activation via reverse PIN.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Body:**

```json
{
  "pin": "1234"
}
```

**Response (Normal PIN):**

```json
{
  "valid": true,
  "panicMode": false,
  "message": "PIN verified successfully"
}
```

**Response (Reverse PIN - Panic Mode Activated):**

```json
{
  "valid": true,
  "panicMode": true,
  "message": "Panic mode activated via reverse PIN"
}
```

---

#### **Settings Alias** `/api/settings/*`

`/api/settings` is an alias of `/api/profile` with the same authentication and handlers. Use the following endpoints:

- `GET /api/settings` → same as `GET /api/profile`
- `PUT /api/settings/display-name` → same as `PUT /api/profile/display-name`
- `PUT /api/settings/card-limits` → same as `PUT /api/profile/card-limits`
- `PUT /api/settings/panic-mode` → same as `PUT /api/profile/panic-mode`
- `PUT /api/settings/reverse-pin` → same as `PUT /api/profile/reverse-pin`
- `PUT /api/settings/change-pin` → same as `PUT /api/profile/change-pin`
- `POST /api/settings/verify-pin` → same as `POST /api/profile/verify-pin`

Note: There is no single `PUT /api/settings` endpoint; use the specific routes above.

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
