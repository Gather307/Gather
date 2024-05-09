import { Express, Request, Response } from "express";
import User, { IUser } from "./userSchema";

const express = require("express"); // 1. includes Express
const app: Express = express(); // 2. initializes Express
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello world!')
});

app.get("/users", async (req: Request, res: Response) => {
  const users = await User.find({});
  res.send(users);
});

app.listen(3001);