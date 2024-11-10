import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import userRouter from "../backend/routes/user.js";
import { MONGO_URL } from "../backend/config.js";
import { PostsModel } from "./db.js";

const app = express();
const port = process.env.PORT || 3000;

async function main() {
  await mongoose.connect(MONGO_URL);
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

main();

app.use(cors());
app.use("/user", userRouter);
app.get("/", (req, res) => {
  res.json({ message: "setup corn job" });
});
app.get('/p/:postid', async(req, res)=>{
  try{
    const currentPostId= new mongoose.Types.ObjectId(req.params.postid)
    const currentPost= await PostsModel.findById(currentPostId);

    if(currentPost == null)
        throw 'Post does not exist '
    res.json({post: currentPost, status:200})  
  }catch(e)
  {
    console.log(e)
    res.josn({message:'Posts does not exist', status:404})
  }
})
