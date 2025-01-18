const mongoose=require("mongoose");
const Schema=mongoose.Schema

const cartSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
        quantity: { type: Number }
      }
    ],
    // createdAt: { type: Date, default: Date.now }
  });
  
  const Cart= mongoose.model('Cart', cartSchema);
  module.exports =Cart;
  