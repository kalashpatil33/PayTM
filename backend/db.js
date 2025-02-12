
const mongoose = require("mongoose");
const { string } = require("zod");
require('dotenv').config();
const uri = process.env.MONGO_URI;
mongoose
    .connect(uri)
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.error("Error connecting to DB:", err));
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

const User = mongoose.model("User", userSchema);
const AccountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        default: 0
    }
});

const Account = mongoose.model('Account', AccountSchema);

module.exports = { User, Account };