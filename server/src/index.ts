import express from "express";
import { config } from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import { errorMiddleware } from "./middlewares/error.middleware";
import { connectDb } from "./config/dbConnection";
// Routes imports
import authRoute from "./routes/auth.route";
import usersRoute from "./routes/user.route";
import questionRoute from "./routes/question.route";
import chatRoute from "./routes/chat.route"
import messageRoute from "./routes/message.route"


config();

const app = express();

// Middlewares
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.static("public"));
// For url inputs
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(morgan("dev"));
app.use(cookieParser());
app.disable("x-powered-by");
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Base Route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Boilerplate - API",
  });
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/questions", questionRoute);
app.use("/api/v1/messages", messageRoute);
app.use("/api/v1/chat", chatRoute)


// Middlewares
app.use(errorMiddleware);

// Listen To Server
const PORT = process.env.PORT || 8000;
// Connect To database first then start the server
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Database Connection Error: ${error}`);
  });
