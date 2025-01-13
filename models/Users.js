const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // password: { type: String, required: true },
    phone: { type: String },
    address:{
      street: { type: String, required: true }, // Detailed address or street name
      pincode: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true }
    },
    role:{type: String,default:"User"},
    // wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // References Product collection
    // role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    // createdAt: { type: Date, default: Date.now }
});
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);
module.exports=User;