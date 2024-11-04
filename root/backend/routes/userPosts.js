import express from "express";
import { z } from "zod";
import mongoose, { Types } from "mongoose";

import { UserModel, PostsModel } from "../db.js";

const userPostsRouter = express.Router();
const postValidator = z.object({
  title: z.string().min(3),
  content: z.string(),
});

userPostsRouter.post("/create", async (req, res) => {
  const { title, content } = req.body;

  try {
    const newPost = {
      title: title,
      content: content,
      userId: req.body._id,
      date: new Date(),
      edited: false,
    };

    postValidator.parse(newPost);

    const currentPost = await PostsModel.create(newPost);
    const currentUserId = new mongoose.Types.ObjectId(req.body._id);

    const currentUser = await UserModel.findById(currentUserId);

    currentUser.posts.push(currentPost._id);
    currentUser.save();

    res.json({ message: "post added successfully",status:200 });
  } catch (e) {
    console.log(e);
    res.json({ mesage: "Title or content not valid" ,status:401});
  }
});

userPostsRouter.put("/:postid", async (req, res) => {
  const { title, content } = req.body;

  const updatedPost = {
    title: title,
    content: content,
    edited: true,
    date: new Date(),
    userId: req.body._id,
  };

  const currentPostID = new mongoose.Types.ObjectId(req.params.postid);

  try {
    if (req.params.postid.length != 24) throw "lengt issue";
    const postResponse = await PostsModel.findByIdAndUpdate(
      { _id: currentPostID },
      updatedPost
    );

    if (postResponse === null) throw "no such posts exists";

    res.json({ message: "post updated", status:200 });
  } catch (e) {
    console.log(e);
    res.json({ message: "no such posts exists" , status:401});
  }
});

userPostsRouter.delete("/:postid", async (req, res) => {
  const currentPostID = new mongoose.Types.ObjectId(req.params.postid);
  const currentUserId = new mongoose.Types.ObjectId(req.body._id);

  try {
    const currentUser = await UserModel.findById(currentUserId);

    const index = currentUser.posts.indexOf(req.params.postid);
    if (index > -1) {
      currentUser.posts.splice(index, 1);
    } else {
      throw "post does not exist if else";
    }

    currentUser.save();

    await PostsModel.findByIdAndDelete({ _id: currentPostID });

    res.json({ message: "post deleted", status:200 });
  } catch (e) {
    console.log(e);
    res.json({ message: "no such posts exists", status: 401 });
  }
});

export default userPostsRouter;
