import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import userRouter from "../backend/routes/user.js";
import { MONGO_URL } from "../backend/config.js";

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
