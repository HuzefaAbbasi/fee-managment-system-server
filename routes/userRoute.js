import express from "express";
import {
  login,
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

import { hasToken } from "../middlewares/hasToken.js";
import { adminAccess } from "../middlewares/isAuthorized.js";
import { validateUser } from "../middlewares/validateUser.js";

const userRouter = express.Router();

userRouter.post("/user/login", login);
// to get all users
userRouter.get("/user", hasToken, adminAccess, getAllUsers);
userRouter.get("/user/:id", hasToken, adminAccess, getUser);
userRouter.post("/user", hasToken, adminAccess, validateUser, createUser);
userRouter.put("/user/:id", hasToken, adminAccess, validateUser, updateUser);
userRouter.delete("/user/:id", hasToken, adminAccess, deleteUser);

export default userRouter;
