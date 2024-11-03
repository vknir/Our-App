import express from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";

import { UserModel } from "../db.js";
import { JWT_SECRET } from "../config.js";
import userAuth from "../middleware/userAuth.js";
import userPostsRouter from "../routes/userPosts.js";

const userRouter = express.Router();

userRouter.use(bodyParser.urlencoded({ extended: false }));

const inputValidator = z.object({
  username: z
    .string()
    .min(2, { message: "length should be greater than 1" })
    .max(20, { message: "length should be less than 21" }),
  password: z.string().min(3, { message: "too short" }),
  email: z.string().email({ message: "Email not valid" }),
});

userRouter.post("/sign-up", async (req, res) => {
  const { username, password, email } = req.body;

  try {
    inputValidator.parse({ username, password, email });

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
        const newUser = {
          username: username,
          email: email,
          password: hash,
          followers: [],
          following: [],
          pfp: "",
          posts: [],
        };
        try {
          await UserModel.create(newUser);

          const findUser = await UserModel.findOne({
            username: newUser.username,
          });

          const token = jwt.sign(
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

    const  inputValidator= z.object({
      username:z.string(),
      password:z.string(),
    })

    inputValidator.parse({ username, password });

    const findUser = await UserModel.findOne({ username: username });

    try {
      bcrypt.compare(password, findUser.password, (e, result) => {
        if (e) throw e;
        if (result) {
          const token = jwt.sign({ _id: findUser._id }, JWT_SECRET);
          res.json({ token: token });
        } else {
          res.json({ message: "invalid creds result" });
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

userRouter.get("/:username", async (req, res) => {
  try {
    const findUser = await UserModel.findOne({ username: req.params.username });
    if (findUser === null) throw "user does not exist find user";
    const userDetails = {
      username: findUser.username,
      pfp: findUser.pfp,
      followers: findUser.followers,
      following: findUser.following,
      posts: findUser.posts,
    };

    res.json(userDetails);
  } catch (e) {
    console.log(e);
    res.json({ message: "User doesnot exist " });
  }
});



userRouter.use(userAuth);

userRouter.post('/follow/:username', async (req, res)=>{
  try{
    const findUser= await UserModel.findOne( {username: req.params.username})
    if( findUser === null)
      throw ' user doesnot exist finduser'

    const currentUser = await UserModel.findOne({username: req.body.username})

    currentUser.following.push( findUser._id)
    currentUser.save()

    findUser.followers.push(currentUser._id)
    findUser.save()

    res.json({message:'user followed'})
    
  }catch(e)
  {
    console.log(e)
    res.json({message: ' user does not exist '})
  }
})


userRouter.get("/feed", (req, res) => {
  res.json({ message: "display feed" });
});

userRouter.get("/create", (req, res) => {
  res.json({ message: "send create page form" });
});

userRouter.use("/posts", userPostsRouter);

export default userRouter;
