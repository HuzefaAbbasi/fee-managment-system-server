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

// login
//email, password
userRouter.post("/user/login", login);
// to get all users
userRouter.get("/user", getAllUsers);
userRouter.get("/user/:id", hasToken, adminAccess, getUser);
// const userSchema = new mongoose.Schema({
//   name: {type: String, required: true},
//   email: {type: String, required: true},
//   password: {type: String, required: true},
//   phone: {type: String, required: true},
//   type: {type: String, required: true},
// });
userRouter.post("/user", validateUser, createUser);
// userRouter.post("/user", hasToken, adminAccess, validateUser, createUser);

userRouter.put("/user/:id", hasToken, adminAccess, validateUser, updateUser);

userRouter.delete("/user/:id", hasToken, adminAccess, deleteUser);

export default userRouter;
