import Challan from "../models/challanModel.js";
import Student from "../models/studentModel.js";
import CatchAsyncError from "../utils/catchAsyncError.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// it may be useless
const ADDMISSION_FILE_PATH = path.join(__dirname, "../storage/admission.json");
const FINE_FILE_PATH = path.join(__dirname, "../storage/fine.json");
const READMISSION_FILE_PATH = path.join(
  __dirname,
  "../storage/readdmission.json"
);
const SECONDSHIFT_FILE_PATH = path.join(
  __dirname,
  "../storage/secondshift.json"
);

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
  const { challanType, ...updatedData } = req.body;

  let FILE_PATH = ADDMISSION_FILE_PATH;
  if (challanType === "admission") {
    FILE_PATH = ADDMISSION_FILE_PATH;
  } else if (challanType === "fine") {
    FILE_PATH = FINE_FILE_PATH;
  } else if (challanType === "readdmission") {
    FILE_PATH = READMISSION_FILE_PATH;
  } else if (challanType === "secondshift") {
    FILE_PATH = SECONDSHIFT_FILE_PATH;
  }
  else{
    return res.status(400).json({ message: "Invalid challan type!" });
  }

  fs.writeFile(FILE_PATH, JSON.stringify(updatedData, null, 2), (err) => {
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

  // Extract search parameters
  const { challanNo, studentName, startDate, endDate, isPaid, rollNo } =
    req.query;

  // Build the query object
  let query = {};

  // Filter by date range
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

  // Filter by challan number
  if (challanNo) {
    query.challanNo = challanNo;
  }

  // Filter by student name (partial match using regex)
  if (studentName) {
    const students = await Student.find({
      name: { $regex: studentName, $options: "i" },
    }).select("_id");

    query.studentId = { $in: students };
  }
  if (rollNo) {
    const studentId = await Student.findOne({ rollNo: rollNo }).select("_id");
    query.studentId = studentId;
  }

  // Filter by isPaid status
  if (isPaid !== undefined) {
    query.isPaid = isPaid === "true"; // Convert isPaid to boolean
  }

  // Get total count of matching challans
  const totalChallans = await Challan.countDocuments(query);
  const totalPages = Math.ceil(totalChallans / limit);

  // Fetch matching challans with pagination
  const challans = await Challan.find(query)
    .populate("userId")
    .populate("studentId")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Send response
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
  // sending grade from frontend as class is a reserved word...
  const { studentName, fatherName, rollNo, grade, ...rest } = req.body;

  // Find the challan by its ID
  let challan = await Challan.findById(id);
  if (!challan) {
    return res.status(404).json({ message: "Challan not found!" });
  }

  // Try to find an existing student by roll number
  let student = await Student.findOne({ rollNo });

  if (student) {
    // If student exists, update their details
    student.name = studentName;
    student.fatherName = fatherName;
    student.class = grade;
  } else {
    // If student does not exist, create a new student
    student = await Student.create({
      name: studentName,
      fatherName: fatherName,
      rollNo: rollNo,
      class: grade,
    });

    // Update the studentId in challan with the new student's ID
    challan.studentId = student._id;
  }

  // Update challan with remaining data
  const challanData = { ...rest, studentId: challan.studentId };
  Object.assign(challan, challanData); // Update challan properties

  // Save the updated student and challan
  await student.save();
  await challan.save();

  // Respond with success
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

export const getFieldsSum = CatchAsyncError(async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const query = { isPaid: true };
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = new Date(end);
      }
    }

    const result = await Challan.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          admissionFee: { $sum: "$admissionFee" },
          tuitionFee: { $sum: "$tuitionFee" },
          generalFund: { $sum: "$generalFund" },
          studentIdCardFund: { $sum: "$studentIdCardFund" },
          redCrossFund: { $sum: "$redCrossFund" },
          medicalFund: { $sum: "$medicalFund" },
          studentWelfareFund: { $sum: "$studentWelfareFund" },
          scBreakageFund: { $sum: "$scBreakageFund" },
          magazineFund: { $sum: "$magazineFund" },
          librarySecutityFund: { $sum: "$librarySecutityFund" },
          boardUniRegdExamDues: { $sum: "$boardUniRegdExamDues" },
          sportsFund: { $sum: "$sportsFund" },
          miscellaneousFund: { $sum: "$miscellaneousFund" },
          boardUniProcessingFee: { $sum: "$boardUniProcessingFee" },
          transportFund: { $sum: "$transportFund" },
          burqaFund: { $sum: "$burqaFund" },
          collegeExaminationFund: { $sum: "$collegeExaminationFund" },
          computerFee: { $sum: "$computerFee" },
          secondShiftFee: { $sum: "$secondShiftFee" },
          fineFund: { $sum: "$fineFund" },
        },
      },
    ]);

    return res.status(200).json({
      status: "success",
      data: result.length ? result[0] : {}, // Return sums or empty object
    });
  } catch (error) {
    console.error("Error fetching sums:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch sums",
      error: error.message,
    });
  }
});
