const express = require('express');
const { User, Account } = require('../db');
const { userverify } = require('../verify');
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require('../middleware');
require('dotenv').config();

router.post("/signup", async (req, res) => {
    try {
        // console.log(req.body);
        const { username, email, password } = req.body;
        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ error: "User Already Exists" });
        }
        // Validate request data using Zod
        const result = userverify.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error.format() });
        }
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        // Create and save the user
        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
        });
        await newUser.save();
        // Generate JWT token
        const token = jwt.sign({ id: newUser._id.toString() }, process.env.JWT_SECRET);
        await Account.create({ userId: newUser._id, balance: 1 + Math.random() * 1000 });
        res.status(201).json({ message: "User created successfully", token });
    } catch (error) {
        // console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.post("/signin", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }
        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: "1h" })
        res.status(200).json({ message: "signin successful", token });
    } catch (error) {
        // console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
//allow user to update their personal info including first name last name and password
router.put("/update", authMiddleware, async (req, res) => {
    try {
        const { userID, username, password } = req.body;
        if (!userID) {
            return res.status(400).json({ error: "User ID is required" });
        }
        // Create an object to store updated fields
        let updateFields = {};

        if (username) updateFields.username = username;

        // If user wants to update password, hash it
        if (password) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            updateFields.password = hashedPassword;
        }
        // Find user and update
        const updatedUser = await User.findByIdAndUpdate(
            userID,
            { $set: updateFields },
            { new: true } // Return the updated user
        );
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/bulk', async (req, res) => {
    const filter = req.query.filter || '';
    const users = await User.find({
        $or: [
            { username: { $regex: filter } }
        ]
    });
    res.json({       //this is done so as not to return passwords of user to the frontend.
        user: users.map(user => ({
            id: user._id,
            username: user.username, 
            email: user.email,
        }))
    })
})

router.get("/getUser", authMiddleware, async (req, res) => {
    // console.log("U are inside getUser",req.userID);
    const user = await User.findOne({
      _id: req.userID,
    });
    res.json(user);
  });
module.exports = router;