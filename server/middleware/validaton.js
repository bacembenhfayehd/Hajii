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
  }),

  productCreate: joi.object({
    name: joi.string().min(2).max(100).trim().required().messages({
      'string.min': 'Le nom du produit doit contenir au moins 2 caractères',
      'string.max': 'Le nom du produit ne peut pas dépasser 100 caractères',
      'any.required': 'Le nom du produit est obligatoire'
    }),
    description: joi.string().min(10).max(2000).trim().required().messages({
      'string.min': 'La description doit contenir au moins 10 caractères',
      'string.max': 'La description ne peut pas dépasser 2000 caractères',
      'any.required': 'La description est obligatoire'
    }),
    price: joi.number().positive().precision(2).required().messages({
      'number.positive': 'Le prix doit être positif',
      'any.required': 'Le prix est obligatoire'
    }),
    category: joi.string().valid(
      'parfum-homme',
      'parfum-femme', 
      'teint-fond',
      'rouge-a-levre',
      'mascara',
      'vernis-ongles',
      'autres'
    ).required().messages({
      'any.only': 'Catégorie invalide. Les catégories autorisées sont: parfum-homme, parfum-femme, teint-fond, rouge-a-levre, mascara, vernis-ongles, autres',
      'any.required': 'La catégorie est obligatoire'
    }),
    stock: joi.number().integer().min(0).required().messages({
      'number.min': 'Le stock ne peut pas être négatif',
      'number.integer': 'Le stock doit être un nombre entier',
      'any.required': 'Le stock est obligatoire'
    }),
    brand: joi.string().min(2).max(50).trim().required().messages({
      'string.min': 'La marque doit contenir au moins 2 caractères',
      'string.max': 'La marque ne peut pas dépasser 50 caractères',
      'any.required': 'La marque est obligatoire'
    }),
    sku: joi.string().max(20).trim().optional().messages({
      'string.max': 'Le SKU ne peut pas dépasser 20 caractères'
    }),
    isActive: joi.boolean().optional()
  }),

  productUpdate: joi.object({
    name: joi.string().min(2).max(100).trim().optional().messages({
      'string.min': 'Le nom du produit doit contenir au moins 2 caractères',
      'string.max': 'Le nom du produit ne peut pas dépasser 100 caractères'
    }),
    description: joi.string().min(10).max(2000).trim().optional().messages({
      'string.min': 'La description doit contenir au moins 10 caractères',
      'string.max': 'La description ne peut pas dépasser 2000 caractères'
    }),
    price: joi.number().positive().precision(2).optional().messages({
      'number.positive': 'Le prix doit être positif'
    }),
    category: joi.string().valid(
      'parfum-homme',
      'parfum-femme', 
      'teint-fond',
      'rouge-a-levre',
      'mascara',
      'vernis-ongles',
      'autres'
    ).optional().messages({
      'any.only': 'Catégorie invalide'
    }),
    stock: joi.number().integer().min(0).optional().messages({
      'number.min': 'Le stock ne peut pas être négatif',
      'number.integer': 'Le stock doit être un nombre entier'
    }),
    brand: joi.string().min(2).max(50).trim().optional().messages({
      'string.min': 'La marque doit contenir au moins 2 caractères',
      'string.max': 'La marque ne peut pas dépasser 50 caractères'
    }),
    sku: joi.string().max(20).trim().optional().messages({
      'string.max': 'Le SKU ne peut pas dépasser 20 caractères'
    }),
    isActive: joi.boolean().optional()
  }),

  bulkStockUpdate: joi.object({
    updates: joi.array().items(
      joi.object({
        productId: joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
          'string.pattern.base': 'ID produit invalide',
          'any.required': 'ID produit obligatoire'
        }),
        newStock: joi.number().integer().min(0).required().messages({
          'number.min': 'Le nouveau stock ne peut pas être négatif',
          'number.integer': 'Le nouveau stock doit être un nombre entier',
          'any.required': 'Nouveau stock obligatoire'
        })
      })
    ).min(1).required().messages({
      'array.min': 'Au moins une mise à jour est requise',
      'any.required': 'Liste des mises à jour obligatoire'
    })
  }),

  // Query validation schemas
  productQuery: joi.object({
    page: joi.number().integer().min(1).optional().messages({
      'number.min': 'La page doit être supérieure à 0',
      'number.integer': 'La page doit être un nombre entier'
    }),
    limit: joi.number().integer().min(1).max(100).optional().messages({
      'number.min': 'La limite doit être supérieure à 0',
      'number.max': 'La limite ne peut pas dépasser 100',
      'number.integer': 'La limite doit être un nombre entier'
    }),
    category: joi.string().valid(
      'parfum-homme',
      'parfum-femme', 
      'teint-fond',
      'rouge-a-levre',
      'mascara',
      'vernis-ongles',
      'autres'
    ).optional(),
    search: joi.string().max(100).optional(),
    isActive: joi.boolean().optional(),
    minPrice: joi.number().min(0).optional(),
    maxPrice: joi.number().min(0).optional(),
    brand: joi.string().max(50).optional(),
    sortBy: joi.string().valid('name', 'price', 'stock', 'createdAt', 'category', 'brand').optional(),
    sortOrder: joi.string().valid('asc', 'desc').optional()
  }),

  mongoId: joi.object({
    id: joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
      'string.pattern.base': 'ID invalide',
      'any.required': 'ID obligatoire'
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
export const validateProductCreate = validate(schemas.productCreate);
export const validateProductUpdate = validate(schemas.productUpdate);
export const validateBulkStockUpdate = validate(schemas.bulkStockUpdate);
export const validateProductQuery = validate(schemas.productQuery, 'query');
export const validateMongoId = validate(schemas.mongoId, 'params');
