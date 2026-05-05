const express = require('express');
const router = express.Router();
const {listingSchema} = require('../schema')
const {reviewSchema}= require("../schema")
const Listings = require('../models/listing')
const listing = require('../models/listing')
const {isLoggedIn , isOwner} = require('../middlewares');
const { populate } = require('../models/review');


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
    const listingID = await Listings.findById(id)
    .populate({path: "reviews" , 
            populate:{
                path: "createdBy",
            },
    })
    .populate("owner")

    if(!listing){
        req.flash("error" , "listing you trying to acess does not exist!!!")
        res.redirect('/listing')
    }
    console.log(listingID)
    res.render('listings/show.ejs' , {listingID})
})

// CREATE route
router.post('/' ,isLoggedIn , async (req , res , next)=>{
    try {
        const CreatedListing = new Listings(req.body.listing)
        CreatedListing.owner = req.user._id
        await CreatedListing.save()
        req.flash("success" , "new listing created!!!")
        res.redirect('/listing')
        console.log(CreatedListing)
    } catch (err) {
        next(err)
    }
})

// EDIT route
router.get('/:id/edit' ,isLoggedIn , isOwner , async (req,res)=>{
    let {id} = req.params
    const listingID = await Listings.findById(id)
    res.render('listings/edit.ejs' , {listingID})
})

// UPDATE route
// in update route we will split the findbyidandupdate into two that is findyByID and then Update. WHY?
// fist we find where is the info of thelisting in the db and then th user who is trying to update wether is the owner of that listing or not?
router.put('/:id' ,isLoggedIn , isOwner , async (req , res)=>{
    let {id} = req.params
    await Listings.findByIdAndUpdate(id , {...req.body.listing})
    req.flash("success" , "Listing updated successfully!!!")
    res.redirect('/listing')
})

// DELETE route
router.delete('/:id' , isLoggedIn , isOwner ,  async (req , res)=>{
    let {id} = req.params
    let DeletedListing = await Listings.findByIdAndDelete(id)
    req.flash("success" , "listing deleted!!!")
    console.log(DeletedListing)
    res.redirect('/listing')
})

module.exports = router;