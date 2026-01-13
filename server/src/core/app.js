import cors from "cors";
import express from "express";
import conferenceRouter from "../router/conferenceRouter.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use("/api/conferences", conferenceRouter);

export default app;

/*
    1. creare conferinta - alocare 3+ revieweri (alocare manuala)
    2. inregistrati-va si trimiteti un articol (join conference)
    3. adaugare articol se aleg automat din cei 3+ 2 revieweri
    4. ca reviewer lasati/cereti modificari (feedback) 
    5. incarcati versiune noua articol, vedeti status
*/
