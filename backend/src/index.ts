import express, { urlencoded } from "express";
import cors from "cors";
import path from "path";
import ExceptionHandler from "./exception";
import userRouter from "./userRouter";

const app = express();

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cors());



// ✅ static books folder

const profilePicturesPath = path.join(process.cwd(), "profilePictures");


app.use("/profilePictures", express.static(profilePicturesPath));



// ✅ error handler
app.use(ExceptionHandler);
app.use(userRouter);

app.get("/", (req, res) => {
    res.send({
        status: 200,
        message: "Welcome to the Community API!"
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

export default app;
