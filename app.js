const express = require('express')
const app = express()
const mongoose = require('mongoose')
const MONGO_URL = "mongodb://127.0.0.1:27017/hotelbook"
const PORT = 8001
const Listings = require('./models/listing')
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const Reviews = require("./models/review")


main()
    .then(()=>{
        console.log("connected to DB successfully!")
    })
    .catch((err)=>{
        console.log(err)
    })


app.set('view engine' , 'ejs')
app.set("views" , path.join(__dirname , "views"))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"))
app.engine('ejs' , ejsMate)
app.use(express.static(path.join(__dirname , "public")))

async function main(){
    await mongoose.connect(MONGO_URL)
}

app.get('/' , (req,res)=>{
    res.render("listings/home.ejs")
})

// INDEX route
app.get('/listing' , async (req , res)=>{
    const alllistings = await Listings.find({})
    res.render("listings/index.ejs" , {alllistings})
})


app.listen(PORT , ()=>{
    console.log(`app is listening on ${PORT}`)
})

// New Route  (this route is for creating a new listing)
app.get('/listing/new' , (req , res)=>{
    res.render('listings/new.ejs')
})

// SHOW Route
app.get('/listing/:id' , async (req,res)=>{
    let {id} = req.params
    const listingID = await Listings.findById(id)
    res.render('listings/show.ejs' , {listingID})
})

// CREATE route
app.post('/listing' , async (req , res , next)=>{
    try {
        const CreatedListing = new Listings(req.body.listing)
        await CreatedListing.save()
        res.redirect('/listing')
        console.log(CreatedListing)
    } catch (err) {
        next(err)
    }
})

// EDIT route
app.get('/listing/:id/edit' , async (req,res)=>{
    let {id} = req.params
    const listingID = await Listings.findById(id)
    res.render('listings/edit.ejs' , {listingID})
})

// UPDATE route
app.put('/listing/:id' , async (req , res)=>{
    let {id} = req.params
    await Listings.findByIdAndUpdate(id , {...req.body.listing})
    res.redirect('/listing')
})

// DELETE route
app.delete('/listing/:id' , async (req , res)=>{
    let {id} = req.params
    let DeletedListing = await Listings.findByIdAndDelete(id)
    console.log(DeletedListing)
    res.redirect('/listing')
})

// REVIEW route
app.post('/listing/:id/reviews' , async (req , res)=>{
    let listing = await Listings.findById(req.params.id)
    let newReview = new Reviews(req.body.review)
    listing.reviews.push(newReview)

    await newReview.save()
    await listing.save()
    res.redirect(`/listing/${listing._id}`)
})

app.use((err , req , res , next)=>{
    res.send("Something went wrong")
})