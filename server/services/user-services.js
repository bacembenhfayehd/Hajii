import Comment from "../models/Comment.js";
import Product from "../models/Product.js";

class UserService {
  async addComment() {
    try {
      const { productId, content } = req.body;
      const userId = req.user._id;

      const product = await Product.findById(productId);
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      
      const comment = await Comment.create({
        content,
        product: productId,
        user: userId,
      });

      if (product.comments !== undefined) product.comments.push(comment._id);
      await product.save();

      res.status(201).json({
        success: true,
        data: comment,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
      next();
    }
  }
}

const userService = new UserService();

export default userService;
