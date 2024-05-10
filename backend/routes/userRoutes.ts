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

router.post("/", async (req: Request, res: Response) => {
  connectDB();
  try {
    console.log("Creating a new user with data:", req.body);
    //Create new User to add
    const {username, email, firstName, lastName } = req.body;
    if (!username || !email || !firstName || !lastName) {
      console.error("Missing required fields", req.body);
      return res.status(400).send("Missing required fields");
    }

    const userToAdd = new User({
      username,
      email,
      firstName,
      lastName,
    });

    const newUser = await userToAdd.save();
    console.log("New user created:", newUser);
    res.status(201).send(newUser);
  } catch (error) {
    console.error("Error adding the user:", error);
    res.status(500).send("Internal Server Error");
  }
});

export { router as userEndpoints };
