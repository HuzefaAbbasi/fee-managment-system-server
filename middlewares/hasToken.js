import jwt from "jsonwebtoken";
import CatchAsyncError from "../utils/catchAsyncError.js";
import User from "../models/user.model.js";

// Middleware to verify token
export const hasToken = CatchAsyncError(async (req, res, next) => {
  // Get the token from the headers
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(404).json({
      message: "Please login to access this resource!",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);

    if (!req.user) {
      return next(new Error("User not found", 404));
    }

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token!" });
  }
});
