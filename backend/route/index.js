// import express from 'express';
// import cors from 'cors';
// const app = express();
// import {z} from 'zod';

const { Router } = require('express');
const userRouter = Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
import { z } from 'zod';
import { userModel } from '../db';
import { JWT_SECRET } from '../config';
import { userMiddleware } from '../middleware';


userRouter.post('/signup', async (req, res) => {
    const { userName, password, firstName, lastName } = req.body;
    const requiredBody = z.object({
        userName: z.string().min(4).uuid(),
        firstName: z.string(),
        lastName: z.string(),
        password: z.string()
            .min(6, "password should atleast 6 characters long")
            .regex(/[A-Z]/, 'password should contains atleast one uppercase')
            .regex(/[a-z]/, 'password should atleast contains one lowercase')
    })

    const parsedDatawithSucess = requiredBody.safeParse(req.body);
    if (!parsedDatawithSucess.success) {
        res.json({
            message: "Incorrect Ceredentials!",
            error: parsedDatawithSucess.error
        })
        return
    }


    const hashedPassword = await bcrypt.hash(password, 5);

    try{
        // await userModel.create({
        //     userName: userName,
        //     firstName: firstName,
        //     lastName: lastName,
        //     password: hashedPassword
        // })
    
        res.json({
            password: hashedPassword,
            message: "signup succeeded",
        })
    }catch(e){
        res.status(411).json({
            message:"Email already taken/Incorrect Input"
        })
    }
})


userRouter.post("/signin",async (req,res)=>{
    const {userName,password} = req.body;

    const user = await userModel.findOne({
        userName:userName,
    })

    if(!user){
        return res.status(403).json({
            message:"Incorrect Credentials"
        })
    }

    const PasswordMatch = await bcrypt.compare(password,user.password);

    if(PasswordMatch){
        const token = jwt.sign({
            id:user._id
        },JWT_SECRET)

        res.json({
            token:token,
            message:"You have looged in successfully"
        })
    }else{
        return res.status(403).json({
            message:"Incorrect Credentials!"
        })
    }
})


const updateBody = z.object({
    password:z.string().optional().min(5),
    lastName:z.string().optional(),
    firstName:z.string().optional()
})


userRouter.put('/',userMiddleware,async (req,res)=>{

  const {success} = updateBody.safeParse(req.body)
  if(!success){
    res.status(411).json({
        message:"Error while updating values"
    })
  }

  await userModel.updateOne({_id:req.userId},req.body);

  res.json({
    message:"updated Successfully!"
  })

})

userRouter.get('/bulk',userMiddleware,async(req,res)=>{
   const filter = req.body.filter || "";

   const users = await userModel.find({
    $or:[{
        firstName:{
            "$regex":filter
        }
    },{
        lastName:{
            "$regex":filter
        }
    }]
   });

   res.json({
    user:users.map(user=>({
        userName:user.userName,
        firstName:user.firstName,
        lastName:user.lastName,
        _id:user._id
    }))
   });
})


module.exports = {
    userRouter: userRouter
}


