const mongoose=require("mongoose");

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    // sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' }, // Optional: If the review is for a seller
    rating: { type: Number, required: true }, // 1 to 5
    comment: { type: String },
    createdAt: { type: Date, default: Date.now }
  });
  
  const Review= mongoose.model('Review', reviewSchema);
  module.exports =Review;
  