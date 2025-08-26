import Comment from "../models/Comment.js";
import Product from "../models/Product.js";

import helpers from "../utils/helpers.js";

const { successResponse, errorResponse, AppError } = helpers;

class UserController {
  addComment = async (req, res, next) => {
    try {
      const { productId, content } = req.body;
      const userId = req.user._id;

      // Check if product exists
      const product = await this.getProduct(productId);

      // Create the comment
      const comment = await Comment.create({
        content,
        product: productId,
        user: userId,
      });

      // Add comment reference to product
      if (product.comments !== undefined) {
        product.comments.push(comment._id);
      }
      await product.save();

      // Return success response
      return successResponse(res, comment, "Comment added successfully", 201);
    } catch (error) {
      return errorResponse(res, error.message, error.statusCode || 500);
    }
  };

  getProduct = async (productId) => {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new AppError("Produit non trouvé", 404);
      }
      return product;
    } catch (error) {
      throw error;
    }
  };

  // You can add other user-related methods here
  // async getUserProfile(req, res, next) { ... }
  // async updateUserProfile(req, res, next) { ... }
  // etc.
}

const userController = new UserController();
export default userController;
