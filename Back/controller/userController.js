const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();
const saltRounds = 5;
const KEY = process.env.KEY;

async function signup(req, res) {
    const { email, password, firstName, lastName, phone, bio } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await User.create({ email, password: hashedPassword, firstName, lastName, phone, bio });
        res.send('User registered successfully');
    } catch (error) {
        console.error(error);
        if (error.code === 11000)
            res.status(409).send('Email already exist');
        else
            res.status(500).send('Error registering new user');
    }
}

async function login(req, res) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, KEY);
            res.send({ token, id: user._id, isAdmin: user.isAdmin, firstName: user.firstName, lastName: user.lastName });
        } else
            res.status(401).send('Invalid email or password');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error during login');
    }
}

async function update(req, res) {
    const userId = req.params.id;
    const { email, password, firstName, lastName, phone, bio } = req.body;
    try {
        const updatedFields = {
            email: email || '',
            firstName: firstName || '',
            lastName: lastName || '',
            phone: phone || '',
            bio: bio || ''
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            updatedFields.password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, { new: true });

        if (!updatedUser)
            return res.status(404).send('User not found');

        res.send('Updated!');
    } catch (error) {
        console.error(error);
        if (error.code === 11000)
            res.status(409).send('Email already exist');
        else
            res.status(500).send('Update error');
    }
}

async function getUserInfos(req, res) {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user)
            return res.status(404).send('User not found');

        res.json(user);
    } catch (error) {
        res.status(500).send('Server error');
    }
}

async function getUsers(req, res) {
    if (!req.user.isAdmin)
        return res.status(403).send('Access denied. You are not admin!');
    try {
        const user = await User.find().select("firstName lastName email phone isAdmin");
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching users');
    }
}

module.exports = { signup, login, update, getUserInfos, getUsers };