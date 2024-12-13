const express = require('express');
const router = express.Router();
const Order = require('../models/orderArticle'); 
const User = require('../models/user');

router.get('/dashboard/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ 
        message: 'Vous devez fournir votre identifiant' 
      });
    }

    // Find all orders for the client
    const orders = await Order.find({ clientId: id });
    if (!orders || orders.length === 0) {
      return res.json({ 
        message: 'Aucune commande trouvée' 
      });
    }

    // Get order statistics
    const count = await Order.aggregate([
      { $match: { clientId: id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Calculate different order statuses
    const countPending = await Order.countDocuments({ clientId: id, status: 'pending' });
    const countCancel = await Order.countDocuments({ clientId: id, status: 'cancelled' });
    const countDelivered = await Order.countDocuments({ clientId: id, status: 'delivered' });
    const totalOrders = orders.length;

    // Send complete response
    return res.status(200).json({
      orders,
      statistics: {
        totalOrders,
        pendingOrders: countPending,
        cancelledOrders: countCancel,
        deliveredOrders: countDelivered
      }
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    return res.status(500).json({ 
      message: 'Une erreur est survenue lors de la récupération des données' 
    });
  }
});

router.get('/profile/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching profile:', err.message);
    res.status(500).json({ message: 'Erreur lors de la récupération du profil' });
  }
});

router.put('/profile/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const user = await User.findByIdAndUpdate(id, updatedData, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error('Error updating profile:', err.message);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil' });
  }
});


module.exports = router;