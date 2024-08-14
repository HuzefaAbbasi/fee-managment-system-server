import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRouter from "./routes/userRoute.js";
import studentRouter from "./routes/studentRoute.js";
import challanRouter from "./routes/challanRoute.js";
export const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error!");
});

// Routes
app.use("/api/", userRouter, studentRouter, challanRouter);

// Handle 404 error
app.all("*", (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found!`);
  err.statusCode = 404;
  next(err);
});
