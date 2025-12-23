const { Router } = require('express');
const { userMiddleware } = require('../middleware');
const { AccountModel, TransactionModel } = require('../db');
const { default: mongoose } = require('mongoose');
const accountRouter = Router();


accountRouter.get('/balance', userMiddleware, async (req, res) => {
    const account = await AccountModel.findOne({
        userId: req.userId
    });

    res.json({
        balance: account.balance,
        vaultBalance: account.vaultBalance
    })
});

accountRouter.post('/vault/deposit', userMiddleware, async (req, res) => {
    const { amount } = req.body;
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            const account = await AccountModel.findOne({ userId: req.userId }).session(session);

            if (!account || account.balance < amount) {
                throw new Error("Insufficient balance");
            }

            await AccountModel.updateOne(
                { userId: req.userId },
                { $inc: { balance: -amount, vaultBalance: amount } }
            ).session(session);
        });

        res.json({ message: "Deposited to Vault" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    } finally {
        session.endSession();
    }
});

accountRouter.post('/vault/withdraw', userMiddleware, async (req, res) => {
    const { amount } = req.body;
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            const account = await AccountModel.findOne({ userId: req.userId }).session(session);

            if (!account || account.vaultBalance < amount) {
                throw new Error("Insufficient vault balance");
            }

            await AccountModel.updateOne(
                { userId: req.userId },
                { $inc: { vaultBalance: -amount, balance: amount } }
            ).session(session);
        });

        res.json({ message: "Withdrawn from Vault" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    } finally {
        session.endSession();
    }
});


accountRouter.post('/transfer', userMiddleware, async (req, res) => {
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            const { amount, to } = req.body;

            const account = await AccountModel.findOne({
                userId: req.userId
            }).session(session);


            if (!account || account.balance < amount) {
                throw new Error("Insufficient balance");
            }

            const toAccount = await AccountModel.findOne({
                userId: to
            }).session(session);

            if (!toAccount) {
                throw new Error("Invalid Account");
            }

            await AccountModel.updateOne({
                userId: req.userId
            },
                {
                    $inc: { balance: -amount }
                }).session(session);


            await AccountModel.updateOne({
                userId: to
            }, {
                $inc: { balance: amount }
            }).session(session);

            // Record Transaction
            await TransactionModel.create([{
                senderId: req.userId,
                receiverId: to,
                amount: amount,
                timestamp: new Date()
            }], { session: session });
        });


        res.json({
            message: "Transfer successful"
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    } finally {
        session.endSession();
    }
});

accountRouter.get('/history', userMiddleware, async (req, res) => {
    try {
        const transactions = await TransactionModel.find({
            $or: [{ senderId: req.userId }, { receiverId: req.userId }]
        })
            .sort({ timestamp: -1 })
            .populate('senderId', 'firstName lastName')
            .populate('receiverId', 'firstName lastName')
            .exec();

        res.json({
            transactions: transactions.map(t => ({
                id: t._id,
                amount: t.amount,
                type: t.senderId._id.toString() === req.userId ? 'sent' : 'received',
                date: t.timestamp,
                otherParty: t.senderId._id.toString() === req.userId ? t.receiverId : t.senderId
            }))
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching history" });
    }
});

module.exports = {
    accountRouter: accountRouter
}
