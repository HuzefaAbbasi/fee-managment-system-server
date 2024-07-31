import CatchAsyncError from "../utils/catchAsyncError";

export const adminAccess = CatchAsyncError(async (req, res, next) => {
  if (req.user && req.user.type === "admin") {
    next();
  }
  return res.status(403).json({
    status: "failed",
    message: "You are not authorized to access this route",
  });
});


