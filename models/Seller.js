const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const sellerSchema = new Schema({
    // name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // password: { type: String, required: true },
    phone: { type: String, required: true },
    storeName: { type: String, required: true },
    address: {
      street: { type: String, required: true }, // Detailed address or street name
      pincode: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true }
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', default:[] }], // References Product collection
    // rating: { type: Number, default: 0 },
    // bankDetails: {
    //   accountNumber: { type: String },
    //   ifsc: { type: String }
    // },
    // status: { type: String, enum: ['active', 'inactive', 'banned'], default: 'active' },
    // createdAt: { type: Date, default: Date.now }
  });
  
  sellerSchema.plugin(passportLocalMongoose); 
const Seller = mongoose.model('Seller', sellerSchema);
module.exports=Seller;
  