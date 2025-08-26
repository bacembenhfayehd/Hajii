import Comment from "../models/Comment.js";
import Product from "../models/Product.js";
import helpers from "../utils/helpers.js";

const {AppError,errorResponse,successResponse} = helpers

class AdminSerice {
async getProductComments(productId, options = {}) {
    try {
      const { page = 1, limit = 10, sort = '-createdAt' } = options;
      const skip = (page - 1) * limit;

      // Check if product exists
      const product = await Product.findById(productId);
      if (!product) {
        throw new AppError('Product not found', 404);
      }

      // Get comments with user population
      const comments = await Comment.find({ product: productId })
        .populate({
          path: 'user',
          select: 'name email createdAt' // Only include necessary user fields
        })
        .populate({
          path: 'product',
          select: 'name' // Include product name for reference
        })
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(); // Convert to plain JavaScript objects for better performance

      // Get total count for pagination
      const totalComments = await Comment.countDocuments({ product: productId });

      return {
        comments,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalComments / limit),
          totalComments,
          hasNextPage: page < Math.ceil(totalComments / limit),
          hasPrevPage: page > 1
        },
        product: {
          _id: product._id,
          name: product.name
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Get all comments for admin dashboard
  async getAllComments(options = {}) {
    try {
      const { 
        page = 1, 
        limit = 20, 
        sort = '-createdAt',
        search = '',
        productId = null,
        userId = null,
        startDate = null,
        endDate = null
      } = options;
      
      const skip = (page - 1) * limit;

      // Build filter query
      const filter = {};
      
      if (productId) filter.product = productId;
      if (userId) filter.user = userId;
      
      // Date range filter
      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
      }

      // Text search in comment content
      if (search) {
        filter.content = { $regex: search, $options: 'i' };
      }

      // Get comments with full population for admin view
      const comments = await Comment.find(filter)
        .populate({
          path: 'user',
          select: 'name email createdAt isActive'
        })
        .populate({
          path: 'product',
          select: 'name price category'
        })
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      // Get total count for pagination
      const totalComments = await Comment.countDocuments(filter);

      // Get summary statistics
      const stats = await this.getCommentStats();

      return {
        comments,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalComments / limit),
          totalComments,
          hasNextPage: page < Math.ceil(totalComments / limit),
          hasPrevPage: page > 1
        },
        stats,
        filters: {
          search,
          productId,
          userId,
          startDate,
          endDate
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Get comment statistics for admin dashboard
  async getCommentStats() {
    try {
      const totalComments = await Comment.countDocuments();
      const commentsThisMonth = await Comment.countDocuments({
        createdAt: { 
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) 
        }
      });
      
      const commentsToday = await Comment.countDocuments({
        createdAt: { 
          $gte: new Date(new Date().setHours(0, 0, 0, 0)) 
        }
      });

      // Most active products by comments
      const topProductsByComments = await Comment.aggregate([
        {
          $group: {
            _id: '$product',
            commentCount: { $sum: 1 }
          }
        },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product'
          }
        },
        {
          $unwind: '$product'
        },
        {
          $project: {
            productName: '$product.name',
            commentCount: 1
          }
        },
        {
          $sort: { commentCount: -1 }
        },
        {
          $limit: 5
        }
      ]);

      return {
        totalComments,
        commentsThisMonth,
        commentsToday,
        topProductsByComments
      };
    } catch (error) {
      throw error;
    }
  }

  // Get a single comment with full details
  async getCommentById(commentId) {
    try {
      const comment = await Comment.findById(commentId)
        .populate({
          path: 'user',
          select: 'name email createdAt isActive'
        })
        .populate({
          path: 'product',
          select: 'name price category images'
        });

      if (!comment) {
        throw new AppError('Comment not found', 404);
      }

      return comment;
    } catch (error) {
      throw error;
    }
  }

  // Delete a comment (admin only)
  async deleteComment(commentId) {
    try {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        throw new AppError('Comment not found', 404);
      }

      // Remove comment reference from product
      await Product.findByIdAndUpdate(
        comment.product,
        { $pull: { comments: commentId } }
      );

      // Delete the comment
      await Comment.findByIdAndDelete(commentId);

      return { message: 'Comment deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
}



const adminService = new AdminSerice
export default adminService;