## **1. Project Documentation**

### **Project Name:** Wallet App Backend

### **Overview**

This backend powers a USDC wallet application with Google Sign-In authentication, wallet creation, sending and receiving funds, transaction history, and settings management including Panic Mode. It is built with **TypeScript**, **Node.js**, **Express**, and **MongoDB**.

The backend is designed for easy integration with a mobile or web frontend (e.g., React, Flutter), following RESTful principles and JSON responses.

---

### **Features**

- **Google OAuth2 Sign-In** – Verify Google ID token server-side, create user + wallet.
- **JWT Authentication** – Secure access to protected endpoints.
- **Wallet Management** – USDC balance tracking, receive address generation.
- **Withdraw Flow** – Preview transaction, confirm with PIN, panic mode enforcement.
- **Receive Flow** – QR code token, NFC simulation endpoints.
- **Transactions** – Record and fetch sent/received transactions.
- **Settings** – Edit name, toggle panic mode.
- **Security** – Bcrypt-hashed PIN, rate limiting, helmet for headers.

---

### **Tech Stack**

- **Language:** TypeScript
- **Runtime:** Node.js
- **Framework:** Express
- **Database:** MongoDB (via Mongoose)
- **Auth:** Google OAuth2, JWT
- **Security:** bcrypt, helmet, express-rate-limit

---

### **Folder Structure**

```
src/
├─ config/        # DB connection
├─ middleware/    # Auth + error handlers
├─ models/        # Mongoose schemas
├─ controllers/   # Business logic
├─ routes/        # Route definitions
├─ utils/         # Helper functions & validation
└─ server.ts      # Entry point
```

---

### **Setup Instructions**

1. **Clone & Install**

```bash
git clonehttps://github.com/useaura/Backend.git
cd Backend
npm install
```

2. **Configure Environment**
   Create a `.env` file:

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/auraPay
JWT_SECRET=super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
PIN_SALT_ROUNDS=10
```

3. **Run in Dev Mode**

```bash
npm run dev
```

4. **Build & Start (Prod)**

```bash
npm run build
npm start
```

---

### **Development Notes**

- **Monetary Values** – Stored as floats for demo; in production use integers for smallest USDC units.
- **Blockchain** – This backend simulates USDC transfers; production deployments should integrate with an actual blockchain or custody service.
- **PIN** – Only bcrypt hash stored; never store plaintext.
- **Panic Mode** – When active, all send/receive flows are blocked.

---
