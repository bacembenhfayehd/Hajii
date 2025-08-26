import adminService from "../services/admin-services.js";
import helpers from "../utils/helpers.js";

const {successResponse,errorResponse,AppError} = helpers


class AdminController {
  
  getProductComments = async (req, res, next) => {
    try {
      const { productId } = req.params;
      const { page, limit, sort } = req.query;

      const result = await adminService.getProductComments(productId, {
        page,
        limit,
        sort
      });

      return successResponse(res, result, "Comments retrieved successfully");
    } catch (error) {
      return errorResponse(res, error.message, error.statusCode || 500);
    }
  };

  // Get all comments for admin dashboard
  getAllComments = async (req, res, next) => {
    try {
      const options = {
        page: req.query.page,
        limit: req.query.limit,
        sort: req.query.sort,
        search: req.query.search,
        productId: req.query.productId,
        userId: req.query.userId,
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };

      const result = await adminService.getAllComments(options);

      return successResponse(res, result, "Comments retrieved successfully");
    } catch (error) {
      return errorResponse(res, error.message, error.statusCode || 500);
    }
  };

  // Get comment statistics for admin dashboard
  getCommentStats = async (req, res, next) => {
    try {
      const stats = await  adminService.getCommentStats();

      return successResponse(res, stats, "Comment statistics retrieved successfully");
    } catch (error) {
      return errorResponse(res, error.message, error.statusCode || 500);
    }
  };

  // Get single comment details
  getCommentById = async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const comment = await  adminService.getCommentById(commentId);

      return successResponse(res, comment, "Comment retrieved successfully");
    } catch (error) {
      return errorResponse(res, error.message, error.statusCode || 500);
    }
  };

  // Delete comment (admin only)
  deleteComment = async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const result = await  adminService.deleteComment(commentId);

      return successResponse(res, result, "Comment deleted successfully");
    } catch (error) {
      return errorResponse(res, error.message, error.statusCode || 500);
    }
  };
}

const adminController = new AdminController();
export default adminController;