import express from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";

import { UserModel } from "../db.js";
import { JWT_SECRET } from "../config.js";
import userAuth from "../middleware/userAuth.js";

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
          res.json({ message: "Unabe too update db hash" });
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
userRouter.get("/", (req, res) => {
  res.json({ message: "setup corn job" });
});


export default userRouter;
