const express = require('express');
const OrderArticle = require('../models/orderArticle');
const Article = require('../models/article');
const router = express.Router();

// Create a new order
router.post('/orders', async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      phone,
      shippingAddress,
      items,
      totalAmount,
      clientId // optional
    } = req.body;

    // Validate items exist and are available
    const articleIds = items.map(item => item.articleId);
    const foundArticles = await Article.find({ 
      _id: { $in: articleIds },
      status: 'available' // only available articles
    });

    if (foundArticles.length !== items.length) {
      return res.status(400).json({ 
        message: 'One or more articles are unavailable or not found.' 
      });
    }

    // Create new order
    const newOrder = new OrderArticle({
      firstname,
      lastname,
      email,
      phone,
      shippingAddress,
      items,
      totalAmount,
      clientId,
      status: 'pending',
      methodPayment: 'cash'
    });

    // Mark articles as unavailable
    await Article.updateMany(
      { _id: { $in: articleIds } },
      { $set: { status: 'pending' } }
    );

    await newOrder.save();

    res.status(201).json({
      message: 'Order created successfully',
      order: newOrder
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ 
      message: 'Error creating order', 
      error: err.message 
    });
  }
});


// Create a new order pay with card
router.post('/ordersByCard', async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      phone,
      shippingAddress,
      items,
      totalAmount,
      clientId // optional
    } = req.body;

    // Validate items exist and are available
    const articleIds = items.map(item => item.articleId);
    const foundArticles = await Article.find({ 
      _id: { $in: articleIds },
      status: 'available' // only available articles
    });

    if (foundArticles.length !== items.length) {
      return res.status(400).json({ 
        message: 'One or more articles are unavailable or not found.' 
      });
    }

    // Create new order
    const newOrder = new OrderArticle({
      firstname,
      lastname,
      email,
      phone,
      shippingAddress,
      items,
      totalAmount,
      clientId,
      status: 'pending',
      methodPayment: 'card'
    });

    // Mark articles as unavailable
    await Article.updateMany(
      { _id: { $in: articleIds } },
      { $set: { status: 'pending' } }
    );

    await newOrder.save();

    res.status(201).json({
      message: 'Order created successfully',
      order: newOrder
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ 
      message: 'Error creating order', 
      error: err.message 
    });
  }
});

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await OrderArticle.find()
      .populate('items.articleId')
      .sort({ orderDate: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ 
      message: 'Error fetching client orders', 
      error: err.message 
    });
  }
});

// Get order by ID
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await OrderArticle.findById(req.params.id)
      .populate('items.articleId')
      .populate('clientId', 'firstname lastname email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }else{
      const articleIds = order.items.map(item => item.articleId);
      const foundArticles = await Article.find({ _id: { $in: articleIds } });
      order.items.forEach(item => {
        const foundArticle = foundArticles.find(article => article._id.equals(item.articleId));
        if (foundArticle) {
          item.article = foundArticle;
        }

      });
    }

    res.status(200).json(order);
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ 
      message: 'Error fetching order', 
      error: err.message 
    });
  }
});

// Update order status
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await OrderArticle.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();


    // Update the status of associated articles
    if (status === 'delivered') {
      for (const item of order.items) {
        await Article.findByIdAndUpdate(item.articleId, { status: 'sold' });
      }
    } else if (status === 'cancelled') {
      for (const item of order.items) {
        await Article.findByIdAndUpdate(item.articleId, { status: 'available' });
      }
    }


    res.status(200).json({ message: 'Order status updated', order });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ 
      message: 'Error updating order status', 
      error: err.message 
    });
  }
});

// Delete order
router.delete('/orders/:id', async (req, res) => {
  try {
    const order = await OrderArticle.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Release the articles back to available status
    const articleIds = order.items.map(item => item.articleId);
    await Article.updateMany(
      { _id: { $in: articleIds } },
      { $set: { status: 'available' } }
    );

    await order.deleteOne();
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error('Error deleting order:', err);
    res.status(500).json({ 
      message: 'Error deleting order', 
      error: err.message 
    });
  }
});

// Get client's orders
router.get('/orders/client/:clientId', async (req, res) => {
  try {
    const orders = await OrderArticle.find({ clientId: req.params.clientId })
      .populate('items.articleId')
      .sort({ orderDate: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error('Error fetching client orders:', err);
    res.status(500).json({ 
      message: 'Error fetching client orders', 
      error: err.message 
    });
  }
});


//statistics 

router.get('/statsOrders', async (req, res) => {
  try {
    // Count total articles
    const totalOrders = await OrderArticle.countDocuments();

    // Count sold articles (status: "sold")
    const soldOrders = await OrderArticle.countDocuments({ status: 'delivered' });

    // Count pending articles (status: "pending")
    const pendingOrders = await OrderArticle.countDocuments({ status: 'pending' });

    // count cancelled orders
    const cancelledOrders = await OrderArticle.countDocuments({ status: 'cancelled' });

    // Return the counts as a JSON response
    res.status(200).json({
      totalOrders,
      soldOrders,
      pendingOrders,
      cancelledOrders
    });
  } catch (error) {
    console.error('Error fetching article stats:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
});

module.exports = router;
