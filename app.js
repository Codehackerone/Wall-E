const express = require("express");
const bodyParser= require("body-parser");
const cors= require("cors");
const mongoose = require("mongoose");
const cluster= require("cluster");
const userRouter= require("./routes/user.routes");

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



//Routes
app.use('/user', userRouter);


//Index route
app.get('/', (req, res) => {
    res.send({error: false, message: 'Welcome to Wall-E'})
})




//Start server

// app.listen(port, () => {
//  console.log(`Wall-E running on port ${port}`)
// })

const numCPUs = require('os').cpus().length;

if(cluster.isMaster){
    console.log(`Master ${process.pid} is running`);
    for(let i=0; i< numCPUs;i++){
        cluster.fork()
    }
} else{
    app.listen(process.env.PORT, () => {
        console.log(`Server ${process.pid} is running on port ${process.env.PORT}`);
    });
}