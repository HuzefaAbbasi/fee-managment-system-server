import CatchAsyncError from "../utils/catchAsyncError.js";
import Student from "../models/studentModel.js";

export const createStudent = CatchAsyncError(async (req, res) => {
  const student = new Student(req.body);
  const alreadyStudent = await Student.findOne({ rollNo: student.rollNo });
  if (alreadyStudent) {
    return res.status(400).json({
      status: "failed",
      message: "Student already exist",
    });
  }
  const newStudent = await student.save();
  res.status(201).json({
    status: "success",
    data: newStudent,
  });
});
export const getStudentData = CatchAsyncError(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    return res.status(400).json({
      status: "failed",
      data: "Student not found",
    });
  }
  res.status(200).json({
    status: "success",
    data: student,
  });
});
export const updateStudentData = CatchAsyncError(async (req, res) => {
  const newStudent = req.body;
  const student = await Student.findOne({ _id: req.params.id });
  if (!student) {
    return res.status(400).json({
      status: "failed",
      message: "Student not found",
    });
  }
  student.name = newStudent.name;
  student.fatherName = newStudent.fatherName;
  student.rollNo = newStudent.rollNo;
  student.class = newStudent.class;
  await student.save();

  res.status(200).json({
    status: "success",
    data: student,
  });
});
