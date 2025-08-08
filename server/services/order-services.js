import Order from '../models/Order.js';
import Product from '../models/Product.js';
import helpers from '../utils/helpers.js';

const { AppError } = helpers;

class OrderService {
  // Créer une nouvelle commande
  async createOrder(userId, orderData) {
    const { items, shippingAddress, paymentMethod, notes } = orderData;

    // Vérifier la disponibilité des produits et calculer les prix
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        throw new AppError(`Produit avec l'ID ${item.product} introuvable`, 404);
      }

      if (product.stock < item.quantity) {
        throw new AppError(`Stock insuffisant pour ${product.name}. Stock disponible: ${product.stock}`, 400);
      }

      const subtotal = product.price * item.quantity;
      
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        subtotal
      });

      totalAmount += subtotal;
    }

    // Créer la commande
    const order = new Order({
      user: userId,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      notes: notes || '',
      totalAmount: totalAmount + 7.000 // Ajouter les frais de livraison
    });

    await order.save();

    // Décrémenter le stock des produits
    await this._updateProductStock(items, 'decrement');

    // Populer les détails pour la réponse
    return await this._populateOrder(order);
  }

  // Récupérer les commandes d'un utilisateur
  async getUserOrders(userId, queryParams) {
    const { page = 1, limit = 10, status, sortBy = 'createdAt', sortOrder = 'desc' } = queryParams;

    const query = { user: userId };
    if (status) query.status = status;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('items.product', 'name category brand images')
        .sort(sortOptions)
        .limit(parseInt(limit))
        .skip(skip),
      Order.countDocuments(query)
    ]);

    return {
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalOrders: total,
        hasNext: parseInt(page) < Math.ceil(total / parseInt(limit)),
        hasPrev: parseInt(page) > 1
      }
    };
  }

  // Récupérer une commande par ID
  async getOrderById(orderId, userId = null) {
    const query = { _id: orderId };
    if (userId) query.user = userId;

    const order = await Order.findOne(query)
      .populate('user', 'name email')
      .populate('items.product', 'name category brand images');

    if (!order) {
      throw new AppError('Commande introuvable', 404);
    }

    return order;
  }

  // Annuler une commande
  async cancelOrder(orderId, userId, cancelReason) {
    const order = await Order.findOne({ _id: orderId, user: userId });

    if (!order) {
      throw new AppError('Commande introuvable', 404);
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      throw new AppError('Cette commande ne peut plus être annulée', 400);
    }

    // Restaurer le stock des produits
    await this._restoreProductStock(order.items);

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancelReason = cancelReason;

    await order.save();
    return order;
  }

  // Admin: Récupérer toutes les commandes
  async getAllOrders(queryParams) {
    const { page = 1, limit = 20, status, sortBy = 'createdAt', sortOrder = 'desc' } = queryParams;

    const query = {};
    if (status) query.status = status;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'name email')
        .populate('items.product', 'name category brand')
        .sort(sortOptions)
        .limit(parseInt(limit))
        .skip(skip),
      Order.countDocuments(query)
    ]);

    return {
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalOrders: total,
        hasNext: parseInt(page) < Math.ceil(total / parseInt(limit)),
        hasPrev: parseInt(page) > 1
      }
    };
  }

  // Admin: Mettre à jour le statut d'une commande
  async updateOrderStatus(orderId, status, cancelReason = null) {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new AppError('Commande introuvable', 404);
    }

    // Si on annule une commande, restaurer le stock
    if (status === 'cancelled' && order.status !== 'cancelled') {
      await this._restoreProductStock(order.items);
      if (cancelReason) {
        order.cancelReason = cancelReason;
      }
    }

    await order.updateStatus(status);
    return await this._populateOrder(order);
  }

  // Obtenir les statistiques des commandes
  async getOrderStats() {
    const [statusStats, totalOrders, revenueResult] = await Promise.all([
      Order.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$totalAmount' }
          }
        }
      ]),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: { $in: ['delivered'] } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    ]);

    return {
      statusStats,
      totalOrders,
      totalRevenue: revenueResult[0]?.total || 0
    };
  }

  // Méthodes privées
  async _updateProductStock(items, operation = 'decrement') {
    const operations = items.map(item => {
      const increment = operation === 'decrement' ? -item.quantity : item.quantity;
      return Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: increment } },
        { new: true }
      );
    });

    await Promise.all(operations);
  }

  async _restoreProductStock(orderItems) {
    const operations = orderItems.map(item => 
      Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      )
    );

    await Promise.all(operations);
  }

  async _populateOrder(order) {
    return await order.populate([
      { path: 'user', select: 'name email' },
      { path: 'items.product', select: 'name category brand images' }
    ]);
  }
}

export default new OrderService();