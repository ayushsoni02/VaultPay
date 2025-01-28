import {jwt,decode} from 'jsonwebtoken';
import { JWT_SECRET } from "./config";
import {Request,Response,NextFunction} from 'express';

export const userMiddleware = async (req,res,next)=>{
    const header = req.headers['authorization'];
    const decoded = await jwt.verify(header,JWT_SECRET);
    if(decoded){
        req.userId = decoded.id;
        next();
    }else{
        res.status(403).json({
            message:'you are not logged in',
        });
    }
};

module.exports = {
    userMiddleware:userMiddleware
}

