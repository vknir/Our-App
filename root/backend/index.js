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
const io=new Server(  httpServer,{})
const port = process.env.PORT || 3000;
const port2= process.env.PORT || 3001;

io.on('connection', (socket)=>{

})

async function main() {
  await mongoose.connect(MONGO_URL);
  
  httpServer.listen(port2, ()=>{
    console.log(`httpserver io listening on ${port2}`)
  })
  
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

main();

app.use(cors());
app.use("/user", userRouter);
app.use("/p", pRouter);
app.get("/", (req, res) => {
  res.json({ message: "setup corn job" });
});
