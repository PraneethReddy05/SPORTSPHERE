const mongoose=require("mongoose");
const Schema=mongoose.Schema

const productSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true},
    price: { type: Number, required: true },
    category: { 
      type: String, 
      required: true,
      enum: ['sports-equipment', 'apparel', 'footwear', 'accessories', 'fitness-gear', 'outdoor-sports'] // Restricts category to predefined values
    },
    stock: { type: Number, required: true },
    images: { type: String,default:"https://www.vallabhcomponent.com/assets/images/default.jpg" }, // Array of image URLs
    // rating: { type: Number, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }], // References Review collection
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' }, // References Seller collection
    // createdAt: { type: Date, default: Date.now }
  });
  
  const Product = mongoose.model('Product', productSchema);
  module.exports=Product;
  