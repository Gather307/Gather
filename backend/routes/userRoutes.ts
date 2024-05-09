import express from "express";
import { Request, Response } from "express";
import User, { IUser } from "../models/userSchema";
import connectDB from "../connection";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  connectDB();

  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("No users found"); // Return a 404 status code if no users are found
    } else {
      res.send(users); // Return the found users
    }
  } catch (error) {
    res.status(500).send("Internal Server Error"); // Handle any unexpected errors
  }
});

export { router as userEndpoints};
