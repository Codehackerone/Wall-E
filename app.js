const express = require("express");
const bodyParser= require("body-parser");
const cors= require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const port = process.env.PORT || 4000
const uri = process.env.MONGO_URI

const connectOptions = {
 useNewUrlParser: true,
 useUnifiedTopology: true
}

mongoose.connect(uri, connectOptions)
.then()
.catch(err => console.log(err))

mongoose.connection.once("open", () => {
 console.log("Connected to MongoDB successfully")
})

const app= express();
const secret= process.env.SECRET;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(port, () => {
 console.log(`Wall-E running on port ${port}`)
})