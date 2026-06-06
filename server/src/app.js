import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/auth.route.js"
import expenseRoutes from "./routes/expense.route.js"
import managerRoutes from "./routes/manager.route.js"


const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// user routes
app.use("/api/auth", userRoutes);

// Expense routes
app.use("/api/expense", expenseRoutes)

// Manager routes
app.use("/api/manager",managerRoutes)


export default app;
