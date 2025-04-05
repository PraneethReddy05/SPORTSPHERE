const express = require("express");
const router = express.Router({ mergeParams: true });
const Products = require("../models/Products.js");
const Review = require("../models/Reviews.js");
const WrapAsync = require("../utils/WrapAsync.js");

//Reviews
//adding a new review
router.post("/", WrapAsync(async(req,res)=>{
    let product = await Products.findById(req.params.id);
    // console.log(req.body.review);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    product.reviews.push(newReview);
    await newReview.save();
    await product.save();
    req.flash("success","New review created!");
    res.redirect(`/products/${product._id}`);
}));
//deleting reviews
router.delete("/:reviewId", WrapAsync(async(req,res)=>{
    let { id, reviewId} = req.params;
    await Products.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review successfully deleted!");
    res.redirect(`/products/${id}`);
}));

module.exports = router;