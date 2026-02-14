import express, { urlencoded } from "express";
import cors from "cors";
import path from "path";
import ExceptionHandler from "./exception";
import userRouter from "./userRouter";
import { appConfig } from "./config/appConfig";

const app = express();

/* ---------------- CORE MIDDLEWARE ---------------- */
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  }),
);

app.use(express.json());
app.use(urlencoded({ extended: true }));

/* ---------------- STATIC FILES (BEFORE ROUTES) ---------------- */
const profilePicturesPath = path.join(process.cwd(), "profilePictures");
app.use("/profilePictures", express.static(profilePicturesPath));

/* ---------------- ROUTES ---------------- */
app.use(userRouter);

/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Welcome to the Community API!",
  });
});

/* ---------------- ERROR HANDLER (LAST) ---------------- */
app.use(ExceptionHandler);

/* ---------------- SERVER ---------------- */
app.listen(appConfig.port, () => {
  console.log(`Server running on port ${appConfig.port}`);
  console.log(`Base URL: ${appConfig.baseURL}`);
});

export default app;
