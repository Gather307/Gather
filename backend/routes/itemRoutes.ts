import express from "express";
import { Request, Response } from "express";
import Item, { IItem } from "../models/itemSchema";
import connectDB from "../connection";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await Item.find({});
    if (users.length === 0) {
      res.status(404).send("No items found"); // Return a 404 status code if no users are found
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
    console.log("Creating a new item with data:", req.body);
    //Create new Item to add
    const {name, toShare, isPrivate, type, basket, notes, price, quantity} = req.body;
    if (!name || toShare == null || !basket || isPrivate == null || quantity == null) {
      console.error("Missing required fields", req.body);
      return res.status(400).send("Missing required fields");
    }

    const itemToAdd = new Item({
      name,
      toShare,
      isPrivate,
      type,
      basket,
      notes,
      price,
      quantity
    });

    const newItem = await itemToAdd.save();
    console.log("New item created:", newItem);
    res.status(201).send(newItem);
  } catch (error) {
    console.error("Error adding the item:", error);
    res.status(500).send("Internal Server Error");
  }
});

export { router as itemEndpoints};