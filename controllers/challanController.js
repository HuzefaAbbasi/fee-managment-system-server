import Challan from "../models/challanModel.js";
import Student from "../models/studentModel.js";
import CatchAsyncError from "../utils/catchAsyncError.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE_PATH = path.join(__dirname, "../data.json");

export const getChallanData = CatchAsyncError(async (req, res) => {
  fs.readFile(DATA_FILE_PATH, "utf8", (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ status: "failed", message: "Data reading failed!" });
    }
    if (!data) {
      res.status(200).json({ status: "success", data: {} });
    }
    res.status(200).json({ status: "success", data: JSON.parse(data) });
  });
});

export const updateChallanData = CatchAsyncError((req, res) => {
  const updatedData = req.body;

  fs.writeFile(DATA_FILE_PATH, JSON.stringify(updatedData, null, 2), (err) => {
    if (err) {
      return res
        .status(500)
        .json({ status: "failed", message: "Data writing failed!" });
    }
    res
      .status(200)
      .json({ status: "success", message: "Data updated successfully!" });
  });
});

export const createChallan = CatchAsyncError(async (req, res) => {
  const challanInfo = req.body;
  const user = req.user;
  if (user.id !== challanInfo.userId) {
    return res.status(401).json({ message: "Unauthorized access!" });
  }
  const student = await Student.findById(challanInfo.studentId);
  if (!student) {
    return res.status(404).json({ message: "Student not found!" });
  }
  const challan = await Challan.create(challanInfo);
  await challan.save();
  res
    .status(201)
    .json({ status: "Successfully created challan!", data: challan });
});

export const getChallan = CatchAsyncError(async (req, res) => {
  const challan = await Challan.findById(req.params.id)
    .populate("userId")
    .populate("studentId");
  if (!challan) {
    return res.status(404).json({ message: "Challan not found!" });
  }
  res.status(200).json({ status: "success", data: challan });
});

// with search and pagination, search can be via challanNo or student name and date filter
export const getAllChallan = CatchAsyncError(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const skip = (page - 1) * limit;

  // Extract search parameter
  const { challanNo, studentName, startDate, endDate } = req.query;

  // Build the query object
  let query = {};
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) {
      query.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.createdAt.$lte = end;
    }
  }

  if (challanNo) {
    query = {
      ...query,
      challanNo: challanNo,
    };
  }
  console.log(studentName);
  if (studentName) {
    // Create a regular expression to match partial values

    const students = await Student.find({
      name: { $regex: studentName, $options: "i" },
    }).select("_id");

    console.log("ids: ", students);

    // Use the $or operator to search in both fields
    query = {
      ...query,
      studentId: { $in: students },
    };
    console.log(query);
  }

  const totalChallans = await Challan.countDocuments(query);
  const totalPages = Math.ceil(totalChallans / limit);

  const challans = await Challan.find(query)
    .populate("userId")
    .populate("studentId")
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: "success",
    data: challans,
    page,
    totalPages,
  });
});

export const updatePaymentStatus = CatchAsyncError(async (req, res) => {
  const { id } = req.params;
  const { isPaid } = req.body;

  const challan = await Challan.findById(id);
  if (!challan) {
    return res.status(404).json({ message: "Challan not found!" });
  }

  challan.isPaid = isPaid;
  await challan.save();

  res.status(200).json({ status: "success", data: challan });
});

export const updateChallan = CatchAsyncError(async (req, res) => {
  const { id } = req.params;
  const updatedChallanInfo = req.body;

  const challan = await Challan.findById(id);
  if (!challan) {
    return res.status(404).json({ message: "Challan not found!" });
  }

  challan = updatedChallanInfo;

  await challan.save();

  res.status(200).json({ status: "success", data: challan });
});

export const deleteChallan = CatchAsyncError(async (req, res) => {
  const { id } = req.params;

  const challan = await Challan.findById(id);
  if (!challan) {
    return res.status(404).json({ message: "Challan not found!" });
  }

  await Challan.findByIdAndDelete(id);

  res
    .status(200)
    .json({ status: "success", message: "Challan deleted successfully!" });
});
