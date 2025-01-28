const express = require('express');
const mongoose = require('mongoose');

const {userRouter} = require('./route/index');

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/v1/user',userRouter);

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})

