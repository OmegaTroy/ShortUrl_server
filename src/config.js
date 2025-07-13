import dotenv from "dotenv";
dotenv.config();

export const { TOKEN_SECRET, MONGODB_URI } = process.env;
