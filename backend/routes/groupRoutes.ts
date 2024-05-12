import express from "express";
import { Request, Response } from "express";
import Group, { IGroup } from "../models/groupSchema";
import connectDB from "../connection";


const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
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

router.post("/", async (req: Request, res: Response) => {
  connectDB();
  try {
    console.log("Creating a new group with data:", req.body);
    //Create new group to add
    const {groupName, privateGroup, description, members, baskets} = req.body;
    //*assuming groupname and privateGroup is required fields need to add a default description ("No description given") etc.
    //*ALSO do we want the baskets to be a list of baskets or just one basket (what we have) something to think 
    //about because arent there going to be multiple baskets per group
    if (!groupName || privateGroup == null || !description) {
      console.error("Missing required fields", req.body);
      return res.status(400).send("Missing required fields");
    }

    const GroupToAdd = new Group({
      groupName,
      privateGroup,
      description,
      members,
      baskets,
    });

    const newGroup = await GroupToAdd.save();
    console.log("New group created:", newGroup);
    res.status(201).send(newGroup);
  } catch (error) {
    console.error("Error adding the group:", error);
    res.status(500).send("Internal Server Error");
  }
});

export { router as groupEndpoints};