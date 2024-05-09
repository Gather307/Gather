import express from "express";
import mongoose from "mongoose";
import { Request, Response } from "express";
import Group, { IGroup } from "../models/groupSchema";

const router = express.Router();

router.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await Group.find({});
    if (users.length === 0) {
      res.status(404).send("No groups found"); // Return a 404 status code if no users are found
    } else {
      res.send(users); // Return the found users
    }
  } catch (error) {
    res.status(500).send("Internal Server Error"); // Handle any unexpected errors
  }
});

export { router as groupEndpoints};