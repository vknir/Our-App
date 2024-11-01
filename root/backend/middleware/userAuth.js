import bodyParser from "body-parser";
import jwt from 'jsonwebtoken'


import { JWT_SECRET } from '../config.js';
import { UserModel } from "../db";

async function userAuth(req, res, next)
{
    const token = req.headers.authorization;

    try{
        const decoded = jwt.verify( token , JWT_SECRET)
        console.log(decoded)
        next();
    }catch(e)
    {
        console.log(e)
        res.json({message:"Invalid token"})
    }
}

export default userAuth;