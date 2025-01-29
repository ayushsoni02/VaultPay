const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: { type: String, unique: true, required: true },  
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
});

const userModel = mongoose.model("user", userSchema);


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
    }
});


const AccountModel = mongoose.model("account", AccountSchema);

module.exports = {
    userModel,
    AccountModel
};
