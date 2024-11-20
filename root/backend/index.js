import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import {createServer} from 'http'
import { Server } from "socket.io";
import userRouter from "../backend/routes/user.js";
import pRouter from "./routes/p.js";
import { MONGO_URL } from "../backend/config.js";

const app = express();
const httpServer = createServer(app);
const io=new Server(  httpServer,{cors:{origins:['*']}})
const port = process.env.PORT || 3000;


io.on('connection', (socket)=>{
  console.log('hello')
})

async function main() {
  await mongoose.connect(MONGO_URL);
  
  httpServer.listen(port, ()=>{
    console.log(`httpserver io listening on ${port}`)
  })
  
  
}

main();

app.use(cors());
app.use("/user", userRouter);
app.use("/p", pRouter);
app.get("/", (req, res) => {
  res.json({ message: "setup corn job" });
});
