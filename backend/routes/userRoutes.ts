import express from "express";
import { Request, Response } from "express";
import User, { IUser } from "../models/userSchema";
import connectDB from "../connection";
import { authenticateUser, generateAccessToken } from "../auth";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
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

router.get("/:userid", async (req: Request, res: Response) => {
  // Ensure the database connection
  connectDB();

  try {
    console.log("Here");

    // Use findById correctly with the id parameter from the request
    const user = await User.findById(req.params.userid);

    // Check if group is null or undefined
    if (!user) {
      return res.status(404).send("No users found"); // Use return to exit the function after sending the response
    }

    // Send the found user
    res.send(user);
    console.log("Sent user");
  } catch (error) {
    try {
      // Use findById correctly with the id parameter from the request
      const user = await User.findOne({ username: req.params.userid });

      // Check if group is null or undefined
      if (!user) {
        return res.status(404).send("No users found"); // Use return to exit the function after sending the response
      }

      // Send the found user
      res.send(user);
      console.log("Sent user");
    } catch (error) {
      console.error("Error fetching user:", error); // Log the error for debugging
      res.status(500).send("Internal Server Error");
    }
  }
});

router.post("/", async (req: Request, res: Response) => {
  connectDB();
  let { username, email, password, firstName, lastName } = req.body;
  let hashedPassword = "";
  let token: any;

  try {
    console.log(req.body);
    if (!username || !email || !password || !firstName || !lastName) {
      console.error("Missing required fields", req.body);
      return res.status(400).send("Missing required fields");
    }

    try {
      console.log("Registering user");
      const existingUser = await User.findOne({ username }).lean();
      if (existingUser != null) {
        return res.status(400).send("User already exists");
      } else {
        const salt = await bcrypt.genSalt(10);
        if (salt) {
          hashedPassword = await bcrypt.hash(password, salt);
          token = await generateAccessToken(username);
        }
      }
    } catch (error) {
      console.log("Error:", error);
    }

    if (hashedPassword === "") {
      return res.status(400).send("Failed to Register User");
    }
    console.log("Adding user to database");

    const userToAdd = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    const newUser = await userToAdd.save();
    res.status(201).send({ newUser, token });
  } catch (error) {
    console.error("Error adding the user:", error);
    res.status(500).send("Internal Server Error in Post");
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  connectDB();
  // Get user ID from URL
  const { id } = req.params;
  const updatedData: Partial<IUser> = req.body; //Not a full update only partial

  try {
    const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user: ", error);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  connectDB();
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({ message: "User deleted successfully", user });
  } catch (error) {
    console.error("Error deleting the user:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.delete("/:id/remove-friend", async (req: Request, res: Response) => {
  connectDB();
  const userId = req.params.id;
  const { friendId } = req.body; // Expecting friendId in the request body
  console.log(friendId);
  try {
    const user = await User.findById(userId);
    console.log(user);
    if (user) {
      // Remove the friend's ObjectId from the user's friends array
      user.friends = user.friends.filter(
        (friend: mongoose.Types.ObjectId) => !friend.equals(friendId),
      );
      await user.save();

      res.status(200).send({ message: "Friend removed successfully" });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error removing friend:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

export { router as userEndpoints };
