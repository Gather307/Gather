import mongoose from "mongoose";
import { Express, Request, Response } from "express";
import User, { IUser } from "./userSchema";
import Group, { IGroup } from "./groupSchema";
import Basket, { IBasket } from "./basketSchema";

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

app.get("/groups", async (req: Request, res: Response) => {
  const groups = await Group.find({});
  res.send(groups);
});

app.get("/baskets", async (req: Request, res: Response) => {
  const baskets = await Basket.find({});
  res.send(baskets);
});

app.listen(3001);