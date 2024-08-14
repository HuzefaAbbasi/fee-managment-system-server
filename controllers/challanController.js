import Challan from "../models/challanModel.js";
import CatchAsyncError from "../utils/catchAsyncError.js";

export const createChallan = CatchAsyncError(async (req, res) => {
  const challanInfo = req.body;
  const user = req.user;
  if (user._id !== challanInfo.userId) {
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
  const { search, date } = req.query;

  // Build the query object
  let query = {};

  if (date) {
    // Assuming date is in YYYY-MM-DD format and you want to find exact matches
    query.date = new Date(date);
  }

  if (search) {
    // Create a regular expression to match partial values
    const regex = new RegExp(search, "i"); // 'i' for case-insensitive matching

    // Use the $or operator to search in both fields
    query = {
      ...query,
      $or: [{ challanNo: regex }, { "studentId.name": regex }],
    };
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
