const express = require('express');
const cookieParser = require('cookie-parser')
const app = express();
const session = require('express-session')
const flash = require('connect-flash')
const users = require('./routes/user')
const posts = require('./routes/post')
const path = require('path')
const PORT = 3000

app.set('view engine' , 'ejs');
app.set('views' , path.join(__dirname , "views"))

const sessionOptions = {
    secret: "Sahibsuri",
    resave: false,
    saveUninitialized: true
}

app.use(session(sessionOptions))
app.use(flash())

app.get('/register' , (req , res)=>{
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    console.log(req.session.name)
    if(name === "anonymous"){
        req.flash("error" , "user not registered")
    }else{
        req.flash("success" , "user registered successfully")
    }
    res.redirect('/hello')
})

app.get('/hello' , (req , res)=>{
    res.locals.smessages = req.flash("success")
    res.locals.emessages = req.flash("error")
    res.render('page.ejs' , {name: req.session.name})
})

app.listen(PORT , ()=>{
    console.log(`app is listening on ${PORT}`)
})