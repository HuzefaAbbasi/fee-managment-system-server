import mongoose from "mongoose";
import AutoIncrement from "mongoose-sequence";

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

// Apply the auto-increment plugin to the schema
challanSchema.plugin(AutoIncrement(mongoose), { inc_field: "challanNo" });

const Challan = mongoose.model("Challan", challanSchema);

export default Challan;
