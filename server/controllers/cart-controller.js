import cartService from '../services/cart-service.js';
import orderServices from '../services/order-services.js';
import helpers from '../utils/helpers.js';

const { successResponse } = helpers;

export const cartController = {
  // Récupérer le panier de l'utilisateur
  getCart: async (req, res, next) => {
    try {
      const userId = req.user._id;

      const cart = await cartService.getOrCreateCart(userId);
      const total = await cartService.calculateCartTotal(cart);

      const response = {
        cart: {
          ...cart.toObject(),
          total,
          itemCount: cart.items.length
        }
      };

      successResponse(res, response, 'Panier récupéré avec succès');
    } catch (error) {
      next(error);
    }
  },

  // Ajouter un produit au panier
  addToCart: async (req, res, next) => {
    try {
      const { product: productId, quantity = 1 } = req.body;
      const userId = req.user._id;

      const { cart, total } = await cartService.addToCart(userId, productId, quantity);

      const response = {
        cart: {
          ...cart.toObject(),
          total,
          itemCount: cart.items.length
        }
      };

      successResponse(res, response, 'Produit ajouté au panier avec succès');
    } catch (error) {
      next(error);
    }
  },

  // Mettre à jour la quantité d'un produit dans le panier
  updateCartItem: async (req, res, next) => {
    try {
      const { productId } = req.params;
      const { quantity } = req.body;
      const userId = req.user._id;

      const { cart, total } = await cartService.updateCartItemQuantity(userId, productId, quantity);

      const response = {
        cart: {
          ...cart.toObject(),
          total,
          itemCount: cart.items.length
        }
      };

      successResponse(res, response, 'Quantité mise à jour avec succès');
    } catch (error) {
      next(error);
    }
  },

  // Supprimer un produit du panier
  removeFromCart: async (req, res, next) => {
    try {
      const { productId } = req.params;
      const userId = req.user._id;

      const { cart, total } = await cartService.removeFromCart(userId, productId);

      const response = {
        cart: {
          ...cart.toObject(),
          total,
          itemCount: cart.items.length
        }
      };

      successResponse(res, response, 'Produit supprimé du panier avec succès');
    } catch (error) {
      next(error);
    }
  },

  // Vider le panier
  clearCart: async (req, res, next) => {
    try {
      const userId = req.user._id;

      const { cart, total } = await cartService.clearCart(userId);

      const response = {
        cart: {
          ...cart.toObject(),
          total,
          itemCount: 0
        }
      };

      successResponse(res, response, 'Panier vidé avec succès');
    } catch (error) {
      next(error);
    }
  },

  // Créer une commande directement depuis le panier
  createOrderFromCart: async (req, res, next) => {
    try {
      const userId = req.user._id;
      const { shippingAddress, paymentMethod, notes } = req.body;

      // Convertir le panier en items de commande
      const items = await cartService.convertCartToOrderItems(userId);

      // Créer la commande
      const orderData = {
        items,
        shippingAddress,
        paymentMethod,
        notes
      };

      const order = await orderServices.createOrder(userId, orderData);

      // Vider le panier après création de la commande
      await cartService.clearCart(userId);

      successResponse(res, order, 'Commande créée avec succès depuis le panier', 201);
    } catch (error) {
      next(error);
    }
  }
};

export default cartController;