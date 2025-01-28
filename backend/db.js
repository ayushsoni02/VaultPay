const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    userName:{type:String,unique:true},
    password:String,
    firstName:String,
    lastName:String,
    password:String
});


export const userModel = mongoose.model("user",userSchema);