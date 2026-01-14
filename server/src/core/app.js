import cors from "cors";
import express from "express";
import conferenceRouter from "../router/conferenceRouter.js";
import userRouter from "../router/userRouter.js";
import articleRouter from "../router/articleRouter.js";
import commentRouter from "../router/commentRouter.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use("/api/conferences", conferenceRouter);
app.use("/api/users", userRouter);
app.use("/api/articles", articleRouter);
app.use("/api/comments", commentRouter);

export default app;
