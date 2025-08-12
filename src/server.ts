import * as express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import * as dotenv from "dotenv";
import { connectDB } from "./config/db";
import { createAuthRouter } from "./routes/auth";
import { walletRouter } from "./routes/wallet";
import { settingsRouter } from "./routes/settings";
import { authMiddleware } from "./middleware/auth";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI!;
const JWT_SECRET = process.env.JWT_SECRET || "changeme";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";

async function start() {
  await connectDB(MONGO_URI);

  const app = express();
  app.use(express.json());
  app.use(helmet());
  app.set("trust proxy", 1);
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

  // public routes
  app.use(
    "/api/auth",
    createAuthRouter({
      googleClientId: GOOGLE_CLIENT_ID,
      jwtSecret: JWT_SECRET,
      jwtExpiresIn: JWT_EXPIRES_IN,
    })
  );

  // protected routes
  app.use("/api/wallet", authMiddleware(JWT_SECRET), walletRouter);
  app.use("/api/settings", authMiddleware(JWT_SECRET), settingsRouter);

  app.get("/health", (req, res) => res.json({ ok: true }));

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
