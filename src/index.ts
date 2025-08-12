import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { ENVIRONMENT } from "./common/config/environment";
import { connectDb } from "./common/config/database";
import cors from "cors";
import logger from "./common/resources/logger";

dotenv.config();

const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(express.static("src/common/public"));
app.use(cors());
app.use(express.json());

// API Routes
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "OK", message: "AuraPay API is running" });
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  logger.info(`🔌 Client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    logger.info(`🔌 Client disconnected: ${socket.id}`);
  });
});

httpServer.listen(ENVIRONMENT.APP.PORT, async () => {
  logger.info(
    `${ENVIRONMENT.APP.NAME} Running on http://localhost:${ENVIRONMENT.APP.PORT}`
  );

  // Connect to database
  try {
    await connectDb();
    logger.info("✅ Database connected successfully");
  } catch (error) {
    logger.error("❌ Failed to connect to database:", error);
  }
});
