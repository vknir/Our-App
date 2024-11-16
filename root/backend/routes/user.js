import express from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import { createHash } from "crypto";

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

      const gravatarHash = createHash("sha256").update(email).digest("hex");
      const gravatarURL = `https://www.gravatar.com/avatar/${gravatarHash}`;

      if (hash) {
        const newUser = {
          username: username,
          email: email,
          password: hash,
          followers: [],
          following: [],
          pfp: `${gravatarURL}`,
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
      followers: findUser.followers.reverse(),
      following: findUser.following.reverse(),
      posts: findUser.posts.reverse(),
    };

    res.json(userDetails);
  } catch (e) {
    console.log(e);
    res.json({ message: "User doesnot exist ", status: 401 });
  }
});

userRouter.get("/info/:userid", async (req, res) => {
  const userID = new mongoose.Types.ObjectId(req.params.userid);
  const currentUser = await UserModel.findById(userID);
  if (currentUser == null) res.json({ message: "Error user doen not exist" });
  const response = {
    username: currentUser.username,
    _id: currentUser._id,
    pfp: currentUser.pfp,
  };

  res.json({ message: response }).status(200);
});
userRouter.use(userAuth);

userRouter.get("/followcheck/:username", async (req, res) => {
  try {
    const currentUser = await UserModel.findOne({
      username: req.body.username,
    });

    const findUser = await UserModel.findOne({ username: req.params.username });

    if (currentUser == null || findUser == null) throw "user not found";

    const result = currentUser.following.find((_id) => {
      return JSON.stringify(_id) === JSON.stringify(findUser._id);
    });
    if (result != undefined) {
      res.json({ follows: true });
    } else {
      res.json({ follows: false });
    }
  } catch (e) {
    console.log(e);
    res.json({ message: "Error in /followcheck" });
  }
});

userRouter.post("/follow/:username", async (req, res) => {
  try {
    const findUser = await UserModel.findOne({ username: req.params.username });
    if (findUser === null) throw " user doesnot exist finduser";

    const currentUser = await UserModel.findOne({
      username: req.body.username,
    });

    if (JSON.stringify(findUser) === JSON.stringify(currentUser)) {
      res.json({ message: "Error cannot follow self", follow: 0, status: 400 });
    } else if (
      currentUser.following.find((account) => {
        return JSON.stringify(account) === JSON.stringify(findUser._id);
      })
    ) {
      res.json({ message: "User already followed", follow: 1, status: 200 });
    } else {
      currentUser.following.push(findUser._id);
      findUser.followers.push(currentUser._id);
      await currentUser.save();
      await findUser.save();
      res.json({
        message: "user followed sucessfully",
        follow: 2,
        status: 200,
      });
    }
  } catch (e) {
    console.log(e);
    res.json({ message: " user does not exist ", status: 401 });
  }
});

userRouter.post("/unfollow/:username", async (req, res) => {
  try {
    const currentUser = await UserModel.findOne({
      username: req.body.username,
    });
    const findUser = await UserModel.findOne({ username: req.params.username });

    if (currentUser == null || findUser == null) {
      throw "user not found";
    }

    const indexCurrent = currentUser.following.indexOf(findUser._id);
    const indexFind = findUser.followers.indexOf(currentUser._id);
    if (indexCurrent > -1 && indexFind > -1) {
      currentUser.following.splice(indexCurrent, 1);
      findUser.followers.splice(indexFind, 1);
    }

    await currentUser.save();
    await findUser.save();
    res.json({ message: "User unfollowed successfully" });
  } catch (e) {
    console.log(e);
    res.json({ message: "Error at /unfollow/:username" });
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
  feed.reverse();
  res.json({ feed: feed, status: 200 });
});

userRouter.get("/exists", async (req, res) => {
  try {
    const currentUser = await UserModel.findOne({
      username: req.body.username,
    });
    if (currentUser === null) throw "user dose not exsit /exists";
    res.json({ message: "user exists", status: 200 });
  } catch (e) {
    res.json({ message: "user does not exist /exists ", status: 404 });
  }
});

userRouter.post("/find", async (req, res) => {
  const text = req.body.text;
  const userQuery = await UserModel.find(
    { username: { $regex: text, $options: "i" } },
    "-password",

    { lean: true }
  ).select("-posts -following -email -followers -password");
  const postsQuery = await PostsModel.find({
    title: { $regex: text, $options: "i" },
  })
    .populate("userId", "-posts -following -email -followers -password")
    .select("-content");
  const finalResult = userQuery.concat(postsQuery);
  res.json({ finalResult });
});

userRouter.use("/posts", userPostsRouter);

export default userRouter;
