import express from "express";
import {
  getStudentData,
  createStudent,
  updateStudentData,
} from "../controllers/studentController.js";
import { validateStudent } from "../middlewares/validateStudent.js";
import { hasToken } from "../middlewares/hasToken.js";

const studentRouter = express.Router();

studentRouter.post("/student", hasToken, validateStudent, createStudent);
// pass student id in the URL ... /student/123
// body will be same as above
studentRouter.put("/student/:id", hasToken, validateStudent, updateStudentData);
// to get a specific student passs in URL ... /student/123
studentRouter.get("/student/:rollNo", hasToken, getStudentData);

export default studentRouter;
