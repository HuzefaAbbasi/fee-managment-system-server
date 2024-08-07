import Joi from "joi";

const StudentSchema = Joi.object({
    name: Joi.string().required(),
    fatherName: Joi.string().required(),
    rollNo: Joi.string().required(),
    class: Joi.string().required(),
});

export const validateStudent = (req, res, next) => {
    const student = req.body;
    const schema = StudentSchema;
    const { error } = schema.validate(student);
    if (error) {
        return next(new Error(error.details[0].message, 400));
    }
    next();
}