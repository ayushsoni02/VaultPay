const { Router } = require('express');
const { userMiddleware } = require('../middleware');
const { AccountModel } = require('../db');
const { default: mongoose } = require('mongoose');
const accountRouter = Router();


accountRouter.get('/balance', userMiddleware, async (req, res) => {
    const account = await AccountModel.findOne({
        userId: req.userId
    });

    res.json({
        balance: account.balance
    })
});


accountRouter.post('/transfer', userMiddleware,async (req, res) => {
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

module.exports = {
    accountRouter: accountRouter
}
