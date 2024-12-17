const mongoose = require('mongoose');

const orderArticleSchema = new mongoose.Schema({
  // Customer Information
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  methodPayment: { type: String, required: false },
  
  // Shipping Address
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true }
  },

  // Order Details
  orderDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending' 
  },
  totalAmount: { type: Number, required: true },

  // Order Items
  items: [{
    articleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article',
      required: true
    },
    price: { type: Number, required: true }
  }],

  // Optional Client Reference (for registered users)
  clientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client',
    required: false
  }
}, { 
  timestamps: true // Adds createdAt and updatedAt fields
});

// Add index for better query performance
orderArticleSchema.index({ orderDate: -1 });
orderArticleSchema.index({ status: 1 });
orderArticleSchema.index({ clientId: 1 });

module.exports = mongoose.model('OrderArticle', orderArticleSchema);
