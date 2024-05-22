import express from "express";
import { Request, Response } from "express";
import Group, { IGroup } from "../models/groupSchema";
import connectDB from "../connection";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  connectDB();
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

router.get("/:groupid", async (req: Request, res: Response) => {
  // Ensure the database connection
  connectDB();

  try {
    console.log("Here");

    // Use findById correctly with the id parameter from the request
    const group = await Group.findById(req.params.groupid);

    // Check if group is null or undefined
    if (!group) {
      return res.status(404).send("No groups found"); // Use return to exit the function after sending the response
    }

    // Send the found user
    res.send(group);
    console.log("Sent Group");
  } catch (error) {
    console.error("Error fetching group:", error); // Log the error for debugging
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", async (req: Request, res: Response) => {
  connectDB();
  try {
    console.log("Creating a new group with data:", req.body);
    //Create new group to add
    const { groupName, privateGroup, description, members, baskets } = req.body;
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

router.patch("/:id", async (req: Request, res: Response) => {
  // Get user ID from URL
  const { id } = req.params;
  const updatedData: Partial<IGroup> = req.body; //Not a full update only partial

  try {
    connectDB();

    const updatedGroup = await Group.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    }).lean();
    if (!updatedGroup) {
      return res.status(404).send("Group not found");
    }

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.error("Error updating group: ", error);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  connectDB();
  const { id } = req.params;
  try {
    const group = await Group.findByIdAndDelete(id);

    if (!group) {
      return res.status(404).send({ message: "group not found" });
    }

    res.status(200).send({ message: "group Deleted Successfully", group });
  } catch (error) {
    console.error("Error deleting the group:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

export { router as groupEndpoints };
