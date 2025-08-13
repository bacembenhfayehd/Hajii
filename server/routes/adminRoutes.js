import express from 'express';
import { upload } from '../utils/cloudinary.js';
import { validateBulkStockUpdate, validateMongoId, validateProductCreate, validateProductQuery, validateProductUpdate } from '../middleware/validaton.js';
import { addProduct, bulkUpdateStock, deleteProduct, deleteProductImage, getAllProducts, getProduct, getProductStats, updateProduct } from '../controllers/product-controller.js';
import orderController from '../controllers/order-controller.js';


const router = express.Router();

// Product CRUD routes
router.post('/products', 
  upload.array('images', 5), // Max 5 images
  validateProductCreate,
  addProduct
);

router.get('/products', 
  validateProductQuery,
  getAllProducts
);

router.get('/products/stats', getProductStats);

router.get('/products/:id', 
  validateMongoId,
  getProduct
);

router.put('/products/:id', 
  validateMongoId,
  upload.array('images', 5),
  validateProductUpdate,
  updateProduct
);

router.delete('/products/:id', 
  validateMongoId,
  deleteProduct
);

router.delete('/products/:id/images/:imageIndex', 
  validateMongoId,
  deleteProductImage
);

router.patch('/products/bulk-stock', 
  validateBulkStockUpdate,
  bulkUpdateStock
);


router.get('/orders', orderController.getAllOrders);

export default router;