import Joi from "joi";

//Joi schema for user data validation
const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6),
  phone: Joi.string().length(11).required(),
  type: Joi.string().required(),
});

// Middleware for validating user data
export const validateUser = (req, res, next) => {
  const user = req.body;
  const schema = userSchema;
  // Validate request body against schema
  const { error } = schema.validate(user);
  if (error) {
    // Validation failed, send error response
    return next(new Error(error.details[0].message, 400));
  }
  // Validation passed, proceed to next middleware
  next();
};
