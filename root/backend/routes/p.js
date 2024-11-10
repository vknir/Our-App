import express from "express";
import mongoose from "mongoose";

import { PostsModel, UserModel } from "../db.js";

const pRouter = express.Router();

pRouter.get("/:postid", async (req, res) => {
  try {
    const currentPostId = new mongoose.Types.ObjectId(req.params.postid);
    const currentPost = await PostsModel.findById(currentPostId)  
      

    if (currentPost == null) throw "Post does not exist ";
    res.json({ post: currentPost, status: 200 });
  } catch (e) {
    console.log(e);
    res.json({ message: "Posts does not exist", status: 404 });
  }
});

export default pRouter;
