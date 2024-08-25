const express = require('express')
const mongoose = require('mongoose')
const bcrypt =require("bcrypt")
const path=require("path")
const cors =require("cors")
const upload = require("./middleware/Multer-img-upload")
const auth = require("./middleware/Auth-middleware")

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/hot-sauce',{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB...', err));

const userRoute=require('./routes/User')
const sauceRoute=require('./routes/Sauce')
app.use("/api/auth",userRoute);
app.use("/api/sauces",sauceRoute);
app.use("/images", express.static(path.join(__dirname, 'public/images')));

module.exports = app;





