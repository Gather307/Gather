import express from "express";
import { Request, Response } from "express";
import Basket, { IBasket } from "../models/basketSchema";
import connectDB from "../connection";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await Basket.find({});
    if (users.length === 0) {
      res.status(404).send("No baskets found"); // Return a 404 status code if no users are found
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
    console.log("Creating a new basket with data:", req.body);
    //Create new basket to add
    const {basketName, description, members, items} = req.body;
    if (!basketName || !description) {
      console.error("Missing required fields", req.body);
      return res.status(400).send("Missing required fields");
    }

    const basketToAdd = new Basket({
      basketName,
      description,
      members,
      items,
    });
    

    const newBasket = await basketToAdd.save();
    console.log("New basket created:", newBasket);
    res.status(201).send(newBasket);
  } catch (error) {
    console.error("Error adding the basket:", error);
    res.status(500).send("Internal Server Error");
  }
});

export { router as basketEndpoints};