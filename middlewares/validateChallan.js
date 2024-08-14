import Joi from "joi";

const challanValidationSchema = Joi.object({
  studentId: Joi.string().required(),
  userId: Joi.string().required(),
  admissionFee: Joi.number().optional(),
  tuitionFee: Joi.number().required(),
  generalFund: Joi.number().optional(),
  studentIdCardFund: Joi.number().optional(),
  redCrossFund: Joi.number().optional(),
  medicalFund: Joi.number().optional(),
  studentWelfareFund: Joi.number().optional(),
  scBreakageFund: Joi.number().optional(),
  magazineFund: Joi.number().optional(),
  librarySecutityFund: Joi.number().optional(),
  boardUniRegdExamDues: Joi.number().optional(),
  sportsFund: Joi.number().optional(),
  miscellaneousFund: Joi.number().optional(),
  boardUniProcessingFee: Joi.number().optional(),
  transportFund: Joi.number().optional(),
  burqaFund: Joi.number().optional(),
  collegeExaminationFund: Joi.number().optional(),
  computerFee: Joi.number().optional(),
  secondShiftFee: Joi.number().optional(),
  fineFund: Joi.number().optional(),
  dueDate: Joi.date().required(),
  isPaid: Joi.boolean().optional(),
});

export const validateChallan = (req, res, next) => {
  const { error } = challanValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
