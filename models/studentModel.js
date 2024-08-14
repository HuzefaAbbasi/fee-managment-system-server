import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    fatherName: { type: String, required: true },
    rollNo: { type: String, required: true },
    class: { type: String, required: true },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", StudentSchema);
export default Student;
