import express from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";

import { UserModel, PostsModel } from "../db.js";
import { JWT_SECRET } from "../config.js";
import userAuth from "../middleware/userAuth.js";
import mongoose from "mongoose";

const userRouter = express.Router();

userRouter.use(bodyParser.urlencoded({ extended: false }));

const inputValidator = z.object({
  username: z.string().min(2).max(20),
  password: z.string().min(3),
});



userRouter.post("/sign-up", async (req, res) => {
  const { username, password } = req.body;

  try {
    inputValidator.parse({ username, password });

    bcrypt.hash(password, 3, async (err, hash) => {
      try {
        if (err) {
          throw err;
        }
      } catch (e) {
        console.log(e);
        res.json({ message: "Unable to update DB" });
      }

      if (hash) {
        console.log(hash);
        const newUser = {
          username: username,
          password: hash,
          followers: [],
          following: [],
          pfp: "",
          posts: [],
        };
        try {
          const dbResponse = await UserModel.create(newUser);
          console.log(dbResponse);

          const findUser = await UserModel.findOne({
            username: newUser.username,
          }).exec();

          const token = await jwt.sign(
            {
              _id: findUser._id,
            },
            JWT_SECRET
          );

          res.json({
            token: token,
          });
        } catch (e) {
          console.log(e);
          res.json({ message: "Username already in use hash" });
        }
      }
    });
  } catch (e) {
    console.log(e);
    res.json({ message: "Username already in use" });
  }
});

userRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    inputValidator.parse({ username, password });

    const findUser = await UserModel.findOne({ username: username });

    try {
      bcrypt.compare(password, findUser.password, (e, result) => {
        if (e) throw e;
        if (result) {
          const token = jwt.sign({ _id: findUser._id }, JWT_SECRET);
          res.json({token:token})
        }
        else{
            res.json({message:"invalid creds result"})
        }
      });
    } catch (e) {
      res.json({ message: "Invalid credentails compare" });
    }
  } catch (e) {
    console.log(e);
    res.json({ message: "Invalid credentails" });
  }
});

userRouter.use(userAuth)
userRouter.get("/feed", (req, res) => {
  res.json({ message: "display feed" });
});

userRouter.get('/create', (req, res)=>{
  res.json({message:"send create page form"})
})

userRouter.post('/create', async (req, res)=>{
    const {title , content}=req.body;

    try{
      const postValidator = z.object( {
        title: z.string().min(3),
        content: z.string(),
      })


      const newPost = {
        title:title,
        content: content,
        userId: req.body._id,
        date: new Date(),
      }

      const dbResponse = await PostsModel.create(newPost)
      const currentUserId = new mongoose.Types.ObjectId(req.body._id)

      const  currentUser = UserModel.findById(currentUserId)
      console.log(currentUser)

      console.log(dbResponse)

      res.json({message:'post added successfully'})
    }catch(e)
    {
      console.log(e)
      res.json({mesage:'Title or content not valid'})
    } 
})


export default userRouter;
