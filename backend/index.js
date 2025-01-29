require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser'); 


const { userRouter } = require('./route/user.js');
const {accountRouter} = require('./route/account.js');

const cors = require('cors');
const { default: mongoose } = require('mongoose');
const app = express();
app.use(cookieParser());
app.use(cors());
app.use(express.json());


app.use('/api/v1/user',userRouter);
app.use('/api/v1/account',accountRouter);


async function main(){
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(3000);

    console.log('Server is running on port 3000');
}

main();

