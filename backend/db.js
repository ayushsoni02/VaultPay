const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({


    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
});


const userModel = mongoose.model("user", userSchema);

console.log("pass the user model");
const AccountSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    balance: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    vaultBalance: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    }
});


const AccountModel = mongoose.model("account", AccountSchema);

const TransactionSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const TransactionModel = mongoose.model("Transaction", TransactionSchema);

module.exports = {
    userModel,
    AccountModel,
    TransactionModel
};
