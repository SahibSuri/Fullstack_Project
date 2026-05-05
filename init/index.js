const mongoose = require('mongoose')
const initData = require('./data')
const listing = require('../models/listing')

const MONGO_URL = "mongodb://127.0.0.1:27017/hotelbook"

main()
    .then(()=>{
        console.log("Database connected Succesfully!")
    })
    .catch((err)=>{
        console.log(err)
    })

    async function main(){
    await mongoose.connect(MONGO_URL)
}

const initDB = async () =>{
    await listing.deleteMany({})
    initData.data = initData.data.map((obj) => ({...obj , owner: "69f60629445e48f010b50599"}))
    await listing.insertMany(initData.data)   //.data isliye kyuki vaha pe data.js ki file me data object bana ke export kiya hai
    console.log("Data was INITIALIZED")
}

initDB()