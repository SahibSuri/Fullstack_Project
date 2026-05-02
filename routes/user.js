const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')

// for signup
router.get('/signup' , (req , res)=>{
    res.render("users/signup")
})

router.post('/signup' , async (req , res)=>{
    try {
        let {username , email , password} = req.body;
        const newUser = new User({email , username});
        const registeredUser = await User.register(newUser , password);
        console.log(registeredUser);
        req.flash("success" , "User registered successfully!!!")
        res.redirect('/listing')
    } catch (e) {
        req.flash("error" , e.message)
        res.redirect('/signup')
    }
})

// for login
router.get('/login' , (req , res)=>{
    res.render("users/login.ejs")
})

router.post('/login' ,passport.authenticate('local' , {failureRedirect: '/login' , failureFlash: true}) , async(req , res)=>{
    req.flash("success" , "Welcome back to Empire's Hotel , you are Logged In")
    res.redirect('/listing')
})

module.exports = router;