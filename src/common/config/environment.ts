import * as dotenv from "dotenv";
dotenv.config();

export const ENVIRONMENT = {
  APP: {
    NAME: process.env.APP_NAME,
    PORT: process.env.PORT || 3000,
    ENV: process.env.APP_ENV,
    JWT_SECRET: process.env.JWT_SECRET,
    RPC_URL: process.env.RPC_URL || "https://rpc.ankr.com/eth",
    TOKEN_ADDRESS: process.env.TOKEN_ADDRESS || "0x0000000000000000000000000000000000000000",
    OPERATOR_KEY: process.env.OPERATOR_KEY || "",
  },
  DB: {
    URL: process.env.DB_URL,
  },
  GOOGLE: {
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
  },
  ENCRYPTION: {
    PIN_SALT_ROUNDS: process.env.PIN_SALT_ROUNDS,
    DEFAULT_ENCRYPTION_KEY: process.env.DEFAULT_ENCRYPTION_KEY,
  },
};
