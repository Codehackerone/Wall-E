const User= require('../models/user.model');
const bcrypt= require("bcrypt");
const jwt= require('jsonwebtoken');

exports.getProfile = async (req, res) => {
    res.send(req.user);
}

exports.getFavorites = async (req, res) => {
    res.send(req.user.favorites);
}

exports.signup = async (req, res) => {
    const { name, userName, email, password, phoneNumber } = req.body;
    const data= await User.findOne({ userName, email });

    if (data) {
     return res.status(400).send({ error: true, message: "User already exists." });
    }

    if(!phoneNumber) {
     phoneNumber= "-";
    }

    const user = new User({ name, userName, email, password, phoneNumber });

    try {
        await user.save();
        res.send({ error: false, user });
    } catch (e) {
        res.status(400).send({error: true, message: e.message});
    }
}

exports.login = async (req, res) => {
    const { userName, password, phoneNumber } = req.body;
    const user= {}

    if(!phoneNumber) {
    user = await User.findOne({ userName });
    }
    else {
    user = await User.findOne({ phoneNumber });
    }

    if (!user) {
        return res.status(400).send({ error: true, message: "User does not exist." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).send({ error: true, message: "Incorrect password." });
    }

    const token = jwt.sign({ userName: user.userName, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.send({ error: false, token });
}

// FINISH UPDATE CONTROLLER

// exports.update = async (req, res) => {
//     const { name, userName, email, password, phoneNumber } = req.body;
//     const user= await User.findOne({ _id: req.user._id });

//     if(!phoneNumber) {
//     user.name= name;
//     user.userName= userName;
//     user.email= email;
//     user.password= password;
//     }
//     else {
//     user.name= name;
//     user.userName= userName;
//     user.email= email;
//     user.password= password;
//     user.phoneNumber= phoneNumber;
//     }

//     try {
//         await user.save();
//         res.send({ error: false, user });
//     } catch (e) {
//         res.status(400).send({error: true, message: e.message});
//     }
// }