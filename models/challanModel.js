import mongoose from "mongoose";
import sequence from "mongoose-sequence";

// Initialize mongoose-sequence with mongoose
const AutoIncrement = sequence(mongoose);

const challanSchema = new mongoose.Schema(
  {
    challanNo: {
      type: Number,
      // required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Student",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    admissionFee: { type: Number },
    tuitionFee: {
      type: Number,
      required: true,
    },
    generalFund: { type: Number },
    studentIdCardFund: { type: Number },
    redCrossFund: { type: Number },
    medicalFund: { type: Number },
    studentWelfareFund: { type: Number },
    scBreakageFund: { type: Number },
    magazineFund: { type: Number },
    librarySecutityFund: { type: Number },
    boardUniRegdExamDues: { type: Number },
    sportsFund: { type: Number },
    miscellaneousFund: { type: Number },
    boardUniProcessingFee: { type: Number },
    transportFund: { type: Number },
    burqaFund: { type: Number },
    collegeExaminationFund: { type: Number },
    computerFee: { type: Number },
    secondShiftFee: { type: Number },
    fineFund: { type: Number },
    dueDate: { type: Date, required: true },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const currentYear = new Date().getFullYear();
const yearPrefix = currentYear.toString().slice(-2); // Get the last two digits of the year
const startSeq = parseInt(yearPrefix) * 1000; // Create the starting sequence, e.g., 24000 for 2024

challanSchema.plugin(AutoIncrement, {
  inc_field: "challanNo",
  start_seq: startSeq,
});

const Challan = mongoose.model("Challan", challanSchema);

export default Challan;
