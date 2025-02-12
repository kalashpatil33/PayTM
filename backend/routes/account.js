const express = require('express');
const authMiddleware = require('../middleware');
const { Account } = require('../db');
const router = express.Router();
const { default: mongoose } = require('mongoose');
router.get('/balance', authMiddleware, async (req, res) => {
    try {
        const { userID } = req;
        // console.log(userID);
        if (!userID) {
            return res.status(400).json({ error: "User ID is required" });
        }
        const account = await Account.find({ userId: new mongoose.Types.ObjectId(userID) });
        // console.log(account[0].balance);
        if (!account) {
            return res.status(404).json({ error: "Account not found" });
        }
        res.status(200).json({ balance: account[0].balance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})


router.post("/transfer", async (req, res) => {
    try {
        const { senderId, receiverId, amount } = req.body;
        const senderAccount = Account.findById(senderId);
        if (!senderAccount) {
            res.status(404).json({ error: "Sender account not found" });
        }
        if (senderAccount.balance < amount) {
            res.status(400).json({ error: "Insufficient balance" });
        }

        const receiverAccount = Account.findById(receiverId);
        if (!receiverAccount) {
            res.status(404).json({ error: "Receiver account not found" });
        }
        await Account.updateOne({ _id: senderId }, { $inc: { balance: -amount } });
        await Account.updateOne({ _id: receiverId }, { $inc: { balance: amount } });
        res.status(200).json({ message: "Transfer successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})
// although the above request is a bad solution because we can have moongose failure node failure or anything like that in such cases it is very hard to maintain the consistency of the database. 
//The best solution is here now

router.post("/safetransfer", async (req, res) => {
    const { senderId, receiverId, amount } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();
    const fromAccount = await Account.findOne({ userId: senderId }).session(session);
    if (!fromAccount || fromAccount.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({ error: "Insufficient balance" }); // Rollback the transaction
    }
    const toAccount = await Account.findOne({ userId: receiverId }).session(session);
    if (!toAccount) {
        await session.abortTransaction();
        return res.status(404).json({ error: "Receiver account not found" }); // Rollback the transaction            
    }
    await Account.updateOne({ userId: senderId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: receiverId }, { $inc: { balance: amount } }).session(session);
    await session.commitTransaction();
    res.status(200).json({ message: "Transfer successful" });
})
module.exports = router;