import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

// Routes
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

// Initializations
const app = express();
import "./database";
import "./utils/initialSetup";

// Settings
app.set("port", process.env.PORT || 3000);

// Middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Server listening
app.listen(app.get("port"), () => {
  console.log(`Server on port: ${app.get("port")}`);
});
