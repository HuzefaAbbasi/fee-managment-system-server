import CatchAsyncError from "../utils/catchAsyncError.js";

export const adminAccess = CatchAsyncError(async (req, res, next) => {
  if (req.user && req.user.type == "admin") {
    return next();
  }
  return res.status(403).json({
    status: "failed",
    message: "You are not authorized to access this route",
  });
});

export const reportAccess = CatchAsyncError(async (req, res, next) => {
  if (
    (req.user && req.user.type == "report-access") ||
    req.user.type == "admin"
  ) {
    return next();
  }
  return res.status(403).json({
    status: "failed",
    message: "You are not authorized to access this route",
  });
});
