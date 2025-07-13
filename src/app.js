import express from "express";
import morgan from "morgan";
import cookieParse from "cookie-parser";
import userRouter from "./routers/user.router.js";
import shortUrlRouter from "./routers/short.router.js";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParse());

app.use("/api", userRouter);
app.use("/api", shortUrlRouter);

export default app;
