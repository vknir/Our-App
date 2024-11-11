import express from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";


import { UserModel, PostsModel } from "../db.js";
import { JWT_SECRET } from "../config.js";
import userAuth from "../middleware/userAuth.js";
import userPostsRouter from "../routes/userPosts.js";
import mongoose, { Types } from "mongoose";

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
        res.json({ message: "Unable to update DB", status: 401 });
      }

      if (hash) {
        const newUser = {
          username: username,
          email: email,
          password: hash,
          followers: [],
          following: [],
          pfp: `{}`,
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
            status: 200,
          });
        } catch (e) {
          console.log(e);
          res.json({ message: "Username already in use hash", status: 401 });
        }
      }
    });
  } catch (e) {
    console.log(e);
    res.json({ message: "Username already in use", status: 401 });
  }
});

userRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const inputValidator = z.object({
      username: z.string(),
      password: z.string(),
    });

    inputValidator.parse({ username, password });

    const findUser = await UserModel.findOne({ username: username });

    try {
      bcrypt.compare(password, findUser.password, (e, result) => {
        if (e) throw e;
        if (result) {
          const token = jwt.sign({ _id: findUser._id }, JWT_SECRET);
          res.json({ token: token, status: 200 });
        } else {
          res.json({ message: "invalid creds result", status: 401 });
        }
      });
    } catch (e) {
      res.json({ message: "Invalid credentails compare", status: 401 });
    }
  } catch (e) {
    console.log(e);
    res.json({ message: "Invalid credentails", status: 401 });
  }
});

userRouter.get("/profile/:username", async (req, res) => {
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
    res.json({ message: "User doesnot exist ", status: 401 });
  }
});

userRouter.get('/info/:userid', async (req, res)=>{
  const  userID= new mongoose.Types.ObjectId( req.params.userid);
  const currentUser = await UserModel.findById(userID);

  const response={
    username:currentUser.username,
    _id: currentUser._id,
    pfp:currentUser.pfp
  }

  res.json({message:response}).status(200)


})
userRouter.use(userAuth);

userRouter.post("/follow/:username", async (req, res) => {
  try {
    const findUser = await UserModel.findOne({ username: req.params.username });
    if (findUser === null) throw " user doesnot exist finduser";

    const currentUser = await UserModel.findOne({
      username: req.body.username,
    });

    currentUser.following.push(findUser._id);
    currentUser.save();

    findUser.followers.push(currentUser._id);
    findUser.save();

    res.json({ message: "user followed", status: 200 });
  } catch (e) {
    console.log(e);
    res.json({ message: " user does not exist ", status: 401 });
  }
});

userRouter.get("/feed", async (req, res) => {
  const currentUserId = new mongoose.Types.ObjectId(req.body._id);
  const currentUser = await UserModel.findById(currentUserId);

  const findPosts = currentUser.following.map(async (follow) => {
    const response = await UserModel.findById(
      new mongoose.Types.ObjectId(follow)
    ).populate("posts");

    return response.posts;
  });
  let feed = [];
  const followersPost = await Promise.all(findPosts);

  followersPost.forEach((follower) => {
    follower.forEach((post) => {
      feed.push(post._id);
    });
  });
  
  res.json({feed:feed, status: 200 });
});

userRouter.get("/create", (req, res) => {
  res.json({ message: "send create page form", status: 200 });
});

userRouter.get('/exists', async (req, res)=>{
  try{
  const currentUser= await UserModel.findOne( {username: req.body.username})
    if(currentUser === null)
      throw 'user dose not exsit /exists'
    res.json({message:'user exists',status:200})
}catch(e)
  {
    res.json({message:'user does not exist /exists ', status:404})
  }
})


userRouter.use("/posts", userPostsRouter);

export default userRouter;
