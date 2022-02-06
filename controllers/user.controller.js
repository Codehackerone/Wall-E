const User = require('../models/user.models');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const getProfile = async (req, res) => {
    res.send(req.user);
}

const getFavorites = async (req, res) => {
    res.send(req.user.favorites);
}

const signup = async (req, res) => {
    const { name, userName, email, password, phoneNumber } = req.body;
    const data = await User.findOne({ userName, email });

    if (data) {
        return res.status(400).send({ error: true, message: "User already exists." });
    }

    if (!phoneNumber) {
        phoneNumber = "-";
    }

    const user = new User({ name, userName, email, password, phoneNumber });

    try {
        await user.save();
        res.send({ error: false, user });
    } catch (e) {
        res.status(400).send({ error: true, message: e.message });
    }
}

const login = async (req, res) => {
    const { userName, password, phoneNumber } = req.body;
    const user = {}

    if (!phoneNumber) {
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

const update = async (req, res) => {
    const updates= Object.keys(req.body);
    
    if(!updates){
        return res.status(400).send({ error: true, message: "No updates to be made." });
    }

    const allowedUpdates= ["name", "userName", "email", "password", "phoneNumber"];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error:true, message: 'Invalid updates!' })
    }

    
    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
}

module.exports= {
    getProfile,
    getFavorites,
    signup,
    login,
    update
}