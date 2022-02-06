const jwt= require('jsonwebtoken');
const User= require('../models/user.models');

const auth = async (req, res, next) => {
 try {
     const token = req.header('Authorization').replace('Bearer ', '')
     const decoded = jwt.verify(token, process.env.JWT_SECRET)
     const user = await User.findOne({ userName: decoded.userName, email: decoded.email })

     if (!user) {
         throw new Error()
     }

     req.user = user
     
     next()
 } catch (e) {
     res.status(401).send({ error: true, message: "User has not authenticated." })
 }
}

module.exports= auth;