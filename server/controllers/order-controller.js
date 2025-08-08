import orderServices from '../services/order-services.js';
import helpers from '../utils/helpers.js';

const { successResponse } = helpers;

export const orderController = {
  // Créer une nouvelle commande
  createOrder: async (req, res, next) => {
    try {
      const userId = req.user._id;
      const orderData = req.body;

      const order = await orderServices.createOrder(userId, orderData);
      
      successResponse(res, order, 'Commande créée avec succès', 201);
    } catch (error) {
      next(error);
    }
  },

  // Récupérer toutes les commandes de l'utilisateur connecté
  getUserOrders: async (req, res, next) => {
    try {
      const userId = req.user._id;
      const queryParams = req.query;

      const result = await orderServices.getUserOrders(userId, queryParams);
      
      successResponse(res, result, 'Commandes récupérées avec succès');
    } catch (error) {
      next(error);
    }
  },

  // Récupérer une commande spécifique
  getOrderById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const order = await orderServices.getOrderById(id, userId);
      
      successResponse(res, order, 'Commande récupérée avec succès');
    } catch (error) {
      next(error);
    }
  },

  // Annuler une commande
  cancelOrder: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { cancelReason } = req.body;
      const userId = req.user._id;

      const order = await orderServices.cancelOrder(id, userId, cancelReason);
      
      successResponse(res, order, 'Commande annulée avec succès');
    } catch (error) {
      next(error);
    }
  },

  // Admin: Récupérer toutes les commandes
  getAllOrders: async (req, res, next) => {
    try {
      const queryParams = req.query;

      const result = await orderServices.getAllOrders(queryParams);
      
      successResponse(res, result, 'Commandes récupérées avec succès');
    } catch (error) {
      next(error);
    }
  },

  // Admin: Mettre à jour le statut d'une commande
  updateOrderStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status, cancelReason } = req.body;

      const order = await orderServices.updateOrderStatus(id, status, cancelReason);
      
      successResponse(res, order, 'Statut de la commande mis à jour avec succès');
    } catch (error) {
      next(error);
    }
  },

  // Obtenir les statistiques des commandes (Admin)
  getOrderStats: async (req, res, next) => {
    try {
      const stats = await orderServices.getOrderStats();
      
      successResponse(res, stats, 'Statistiques des commandes récupérées avec succès');
    } catch (error) {
      next(error);
    }
  }
};

export default orderController;