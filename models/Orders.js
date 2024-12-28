const mongoose=require("mongoose");
const Schema=mongoose.Schema

const orderSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' }
      }
    ],
    totalAmount: { type: Number},
    status: { type: String, enum: ['pending', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    paymentMethod: { type: String, enum: ['credit card', 'UPI', 'COD'], required: true },
    deliveryAddress: { type: String, required: true },
    orderedAt: { type: Date, default: Date.now },
    // deliveredAt: { type: Date }
  });
  
  const Order = mongoose.model('Order', orderSchema);
  module.exports=Order;
  