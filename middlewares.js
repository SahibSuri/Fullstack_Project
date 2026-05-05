const Listings = require('./models/listing')
const Reviews = require('./models/review')

// in middlewares always remember to call the next() not doing this will make it stuck
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        console.log("Saved redirect URL:", req.session.redirectUrl);

        req.flash("error", "You must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        console.log("Redirect URL loaded:", res.locals.redirectUrl);
    }
    next();
};

module.exports.isOwner = async (req , res , next)=>{
    let {id} = req.params;
    let listing = await Listings.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error" , "You dont have the permission to do this");
        return res.redirect(`/listing/${id}`)
    }
    next()
}

module.exports.isReviewcreatedBy = async (req , res , next)=>{
    let {id , reviewId} = req.params;
    let review = await Reviews.findById(reviewId);
    if(!review.createdBy.equals(res.locals.currUser._id)){
        req.flash("error" , "You can't delete this review");
        return res.redirect(`/listing/${id}`)
    }
    next()
}

// module.exports.ValidateListing = (req , res , next)=>{
//     let {error} = listingSchema.validate(req.body);
//     if(error){
//         let errMsg = error.details.map((el) => el.message).join(",")
//         throw new ExpressError(400, errMsg);
//     }else{
//         next()
//     }
// }