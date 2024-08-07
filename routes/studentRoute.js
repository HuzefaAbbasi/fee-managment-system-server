import express from "express";
import {
  getStudentData,
  createStudent,
  updateStudentData,
} from "../controllers/studentController.js";
import { validateStudent } from "../middlewares/validateStudent.js";
import { hasToken } from "../middlewares/hasToken.js";

const studentRouter = express.Router();

// data example to be passed in the body
// {
//     name: "John Doe",
//     fatherName: "John Doe Sr.",
//     rollNo: "123",
//     class: "10th",
// }
studentRouter.post("/student", hasToken, validateStudent, createStudent);
// pass student id in the URL ... /student/123
// body will be same as above
studentRouter.put("/student/:id", hasToken, validateStudent, updateStudentData);
// to get a specific student passs in URL ... /student/123
studentRouter.get("/student/:id", hasToken, getStudentData);

export default studentRouter;
