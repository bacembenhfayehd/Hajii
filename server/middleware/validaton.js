import joi from 'joi'
import helpers from '../utils/helpers.js';

const { errorResponse } = helpers;


const schemas = {
  register: joi.object({
    name: joi.string().min(2).max(50).required().messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters',
      'any.required': 'Name is required'
    }),
    email: joi.string().email().required().messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),
    password: joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    })
  }),

  login: joi.object({
    email: joi.string().email().required().messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),
    password: joi.string().required().messages({
      'any.required': 'Password is required'
    })
  })
};

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }));
      
      return errorResponse(res, 'Validation failed', 400, { errors });
    }
    
    next();
  };
};



export const validateRegister = validate(schemas.register);
export const validateLogin = validate(schemas.login);
