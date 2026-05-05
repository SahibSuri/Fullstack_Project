const express = require('express')
const app = express()
const mongoose = require('mongoose')
const MONGO_URL = "mongodb://127.0.0.1:27017/hotelbook"
const PORT = 8001
const Listings = require('./models/listing')
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')


const {listingSchema} = require('./schema')
const {reviewSchema}= require("./schema")
const Reviews = require("./models/review")
const listing = require('./models/listing')

// these two are for reconstructing routes so that routes becomes manageable easily and app.js have less complexity
const listingRouter = require('./routes/listing')
const reviewRouter = require('./routes/review')
const userRouter = require('./routes/user')
// --------------------------------------------------------//

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

app.listen(PORT , ()=>{
    console.log(`router is listening on ${PORT}`)
})

const sessionOptions={
    secret: "Sahibsuri",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000*60*60*24*3,
        maxAge: 1000*60*60*24*3,
        httpOnly: true
    }
}

app.get('/' , (req,res)=>{
    res.render('/listings/home')
})

// sessions and flash
app.use(session(sessionOptions))
app.use(flash())
// always remeber ki routes require hone se pehle hi hume sessions or flash ko use karna padega

app.use(passport.initialize())
app.use(passport.session())  // a web browser needs the ability to identify the user as they browse from page to page
passport.use(new LocalStrategy(User.authenticate()))

// to serialize user into the session
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req , res , next)=>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user
    next()
})

app.get('/demouser' , async (req , res)=>{
    let fakeUser = new User({
        email: "student@gmail.com",
        username: "Student"
    })

    let registeredUser  = await User.register(fakeUser , "sahibsuri")
    res.send(registeredUser)
})

// for listings
app.use('/listing' , listingRouter);
// for reviews
app.use('/listing/:id/reviews' , reviewRouter);
// for user
app.use('/' , userRouter)

app.use((err , req , res , next)=>{
    console.error(err);
    res.status(500).send(err.message)
})