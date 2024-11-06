import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { JWT_SECRET } from "../config.js";
import { UserModel } from "../db.js";

async function userAuth(req, res, next) {
  const token = req.headers.authorization;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const currentUserId = new mongoose.Types.ObjectId(decoded._id);

    const currentUser = await UserModel.findById(currentUserId);

    req.body.username = currentUser.username;
    req.body._id = currentUser._id;
    next();
  } catch (e) {
    console.log(e);
    res.json({ message: "Invalid token" ,status:404});
  }
}

export default userAuth;
