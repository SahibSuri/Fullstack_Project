const express = require('express');
const router = express.Router();
const {listingSchema} = require('../schema')
const {reviewSchema}= require("../schema")
const Listings = require('../models/listing')
const listing = require('../models/listing')
const {isLoggedIn} = require('../middlewares')


router.get('/' , async (req , res)=>{
    const alllistings = await Listings.find({})
    res.render("listings/index.ejs" , {alllistings})
})

// New Route  (this route is for creating a new listing)
router.get('/new' , isLoggedIn , (req , res)=>{
    console.log(req.user)
    res.render('listings/new.ejs')
})

// SHOW Route
router.get('/:id' , async (req,res)=>{
    let {id} = req.params
    const listingID = await Listings.findById(id).populate("reviews")
    if(!listing){
        req.flash("error" , "listing you trying to acess does not exist!!!")
        res.redirect('/listing')
    }
    res.render('listings/show.ejs' , {listingID})
})

// CREATE route
router.post('/' ,isLoggedIn , async (req , res , next)=>{
    try {
        const CreatedListing = new Listings(req.body.listing)
        await CreatedListing.save()
        req.flash("success" , "new listing created!!!")
        res.redirect('/listing')
        console.log(CreatedListing)
    } catch (err) {
        next(err)
    }
})

// EDIT route
router.get('/:id/edit' ,isLoggedIn , async (req,res)=>{
    let {id} = req.params
    const listingID = await Listings.findById(id)
    res.render('listings/edit.ejs' , {listingID})
})

// UPDATE route
router.put('/:id' ,isLoggedIn , async (req , res)=>{
    let {id} = req.params
    await Listings.findByIdAndUpdate(id , {...req.body.listing})
    res.redirect('/listing')
})

// DELETE route
router.delete('/:id' , isLoggedIn , async (req , res)=>{
    let {id} = req.params
    let DeletedListing = await Listings.findByIdAndDelete(id)
    req.flash("success" , "listing deleted!!!")
    console.log(DeletedListing)
    res.redirect('/listing')
})

module.exports = router;