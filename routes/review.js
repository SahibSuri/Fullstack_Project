const express = require('express');
const router = express.Router({mergeParams: true});
const {listingSchema} = require('../schema')
const {reviewSchema}= require("../schema")
const Listings = require('../models/listing')
const listing = require('../models/listing')
const Reviews = require("../models/review")

// -----------------------REVIEWS-----------------------------------
// Add REVIEW route
router.post('/' , async (req , res)=>{
    console.log(req.params.id)
    let listing = await Listings.findById(req.params.id)
    let newReview = new Reviews(req.body.review)
    listing.reviews.push(newReview)

    await newReview.save()
    await listing.save()
    req.flash("success" , "review given")
    res.redirect(`/listing/${listing._id}`)
})

// Delete Review Route
router.delete('/:reviewId' , (async(req , res)=>{
    let{id , reviewId} = req.params;
    await Listings.findByIdAndUpdate(id , {$pull: {review: reviewId}});
    await Reviews.findByIdAndDelete(reviewId);
    req.flash("success" , "review deleted")
    res.redirect(`/listing/${id}`)
}))

module.exports = router;