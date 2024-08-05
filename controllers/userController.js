import CatchAsyncError from "../utils/catchAsyncError.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const login = CatchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      status: "failed",
      message: "Please provide email and password",
    });
  }
  const user = await User.findOne({ email: email }).select("+password");
  // const isMatch = await user.comparePassword(password);
  if (!user) {
    return res.status(401).json({
      status: "failed",
      message: "Invalid email or password",
    });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.status(200).json({
    status: "success",
    token: token,
    user: user,
  });
});

export const createUser = CatchAsyncError(async (req, res, next) => {
  const { name, email, password, phone, type } = req.body;
  const userExist = await User.findOne({ email: email });
  if (userExist) {
    return res.status(400).json({
      status: "failed",
      message: "User already exist",
    });
  }
  const user = await User.create({
    name,
    email,
    password,
    phone,
    type,
  });
  res.status(201).json({
    status: "User created successfully",
    data: user,
  });
});

export const getAllUsers = CatchAsyncError(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    data: users,
  });
});

export const getUser = CatchAsyncError(async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      status: "failed",
      message: "User not found",
    });
  }
  res.status(200).json({
    status: "success",
    data: user,
  });
});

export const updateUser = CatchAsyncError(async (req, res, next) => {
  const userId = req.params.id;
  const { name, email, phone, type } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      status: "failed",
      message: "User not found",
    });
  }
  user.name = name;
  user.email = email;
  user.phone = phone;
  user.type = type;

  await user.save();

  res.status(200).json({
    status: "success",
    data: user,
  });
});

export const deleteUser = CatchAsyncError(async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      status: "failed",
      message: "User not found",
    });
  }
  User.findByIdAndDelete(userId);
  res.status(200).json({
    status: "success",
    message: "User deleted successfully",
  });
});
