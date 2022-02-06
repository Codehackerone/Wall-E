const express = require('express');
const controller = require("../controllers/user.controller");
const auth= require('../middlewares/login.middleware');


const route= express.Router();

//get profile
route.get('/me', auth, controller.getProfile);
//favorites
route.get('/favorites',  auth, controller.getFavorites);

//signup
route.post('/signup', controller.signup);
//login
route.post('/login', controller.login);
//update
route.patch('/update', auth, controller.update);

module.exports= route;