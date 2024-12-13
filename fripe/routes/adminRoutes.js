const express = require('express');
const OrderArticle = require('../models/orderArticle');
const Article = require('../models/article');
const User = require('../models/user');
const router = express.Router();

// Statistics Route
router.get('/statsDashboard', async (req, res) => {
  try {
    // Calculate total profits from delivered orders
    const totalProfitsResult = await OrderArticle.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalProfits = totalProfitsResult[0]?.total || 0;

    // Count total articles
    const totalProduct = await Article.countDocuments();

    // Count total users with 'client' role
    const totalUser = await User.countDocuments({ role: 'client' });

    // Return the calculated statistics
    res.status(200).json({
      totalProfits,
      totalProduct,
      totalUser
    });
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error);
    res.status(500).json({
      message: 'Something went wrong',
      error: error.message
    });
  }
});

module.exports = router;

