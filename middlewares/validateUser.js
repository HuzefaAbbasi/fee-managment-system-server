import Joi from "joi";

//Joi schema for user data validation
const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6),
  phone: Joi.string().required(),
  type: Joi.string().required(),
});

const updateUserSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().optional().min(6),
  phone: Joi.string().optional(),
  type: Joi.string().optional(),
}).min(1);

// Middleware for validating user data
export const validateUser = (req, res, next) => {
  const user = req.body;
  let schema;

  // Determine which schema to use based on request method
  if (req.method === "POST") {
    schema = userSchema;
  } else if (req.method === "PUT" || req.method === "PATCH") {
    schema = updateUserSchema;
  } else {
    // Unsupported HTTP method
    return next(new Error("Unsupported HTTP method", 400));
  }

  // Validate request body against schema
  const { error } = schema.validate(user);
  if (error) {
    // Validation failed, send error response
    return next(new Error(error.details[0].message, 400));
  }
  // Validation passed, proceed to next middleware
  next();
};
