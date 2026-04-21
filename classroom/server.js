const express = require('express');
const app = express();
const users = require('./routes/user')
const posts = require('./routes/post')
const PORT = 3000
app.get('/' , (req , res)=>{
    res.send("Root Route");
})
app.use('/users' , users);
app.use('/posts' , posts);
app.listen(PORT , ()=>{
    console.log(`app is listening on ${PORT}`)
})