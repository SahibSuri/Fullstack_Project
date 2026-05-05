const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Review = require('./review')
const listingSchema = new Schema({
    title: {
        type: String ,
        required: true},
    description: String,
    image: {
        filename: {
            type: String,
            default: "listingimage"
        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b"
        }
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})
listingSchema.post("findOneAndDelete" , async (listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in: listing.reviews}})
    }
})
const listing = mongoose.model("listing" , listingSchema)
module.exports = listing

// in listingSchema the default logic tells if the image is null then this image should be displayed and the set logic tells us that if the image is there and the link is empty 