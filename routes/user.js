const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')
const {saveRedirectUrl} = require('../middlewares')

// for signup
router.get('/signup' , (req , res)=>{
    res.render("users/signup")
})

router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    async (req, res) => {
        req.flash("success", "Welcome back to Empire's Hotel, you are Logged In");

        const redirectUrl = res.locals.redirectUrl || "/listing";

        delete req.session.redirectUrl;

        res.redirect(redirectUrl);
    }
);

// for login
router.get('/login' , (req , res)=>{
    res.render("users/login.ejs")
})

router.post('/login' ,
    saveRedirectUrl ,
    passport.authenticate('local' , 
        {failureRedirect: '/login' , 
            failureFlash: true}) , 
            async(req , res)=>{
                req.flash("success" , "Welcome back to Empire's Hotel , you are Logged In")
                let redirectUrl = res.locals.redirectUrl || '/listing'
                delete req.session.redirectUrl;
                res.redirect(redirectUrl)
        })

// for logout
router.get('/logout' , (req , res)=>{
    req.logOut((err)=>{
        if(err){
            next(err)
        }
        req.flash("success" , "You are logged Out")
        res.redirect('/listing')
    })
})

module.exports = router;