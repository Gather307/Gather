import express from "express";
import { Request, Response } from "express";
import Item, { IItem } from "../models/itemSchema.js";
import { authenticateUser } from "../auth.js";
import connectDB from "../connection.js";

const router = express.Router();

router.get("/", authenticateUser, async (req: Request, res: Response) => {
  connectDB();
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

router.get(
  "/:itemid",
  authenticateUser,
  async (req: Request, res: Response) => {
    // Ensure the database connection
    connectDB();
    try {
      // Use findById correctly with the id parameter from the request
      const itemById = await Item.findById(req.params.itemid);

      // Check if item is null or undefined
      if (!itemById) {
        return res.status(404).send("No item found"); // Use return to exit the function after sending the response
      }
      // Send the found item
      res.send(itemById);
      console.log("Sent item");
    } catch (error) {
      console.log("Now trying to find by Name");
      try {
        const itemsByName = await Item.find({ name: req.params.itemid });
        console.log(itemsByName);
        if (!itemsByName) {
          return res.status(404).send("No items found"); // Use return to exit the function after sending the response
        }

        // Send the found item
        res.send(itemsByName);
        console.log("Sent items");
      } catch (error) {
        console.error("Error fetching group:", error); // Log the error for debugging
        res.status(500).send("Internal Server Error");
      }
    }
  }
);

router.post("/", authenticateUser, async (req: Request, res: Response) => {
  connectDB();
  try {
    console.log("Creating a new item with data:", req.body);
    //Create new Item to add
    const { name, toShare, isPrivate, type, basket, notes, price, quantity } =
      req.body;
    if (
      !name ||
      toShare == null ||
      !basket ||
      isPrivate == null ||
      quantity == null
    ) {
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
      quantity,
    });

    const newItem = await itemToAdd.save();
    console.log("New item created:", newItem);
    res.status(201).send(newItem);
  } catch (error) {
    console.error("Error adding the item:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.patch("/:id", authenticateUser, async (req: Request, res: Response) => {
  // Get user ID from URL
  const { id } = req.params;
  const updatedData: Partial<IItem> = req.body; //Not a full update only partial

  try {
    connectDB();

    const updatedItem = await Item.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    }).lean();
    if (!updatedItem) {
      return res.status(404).send("Item not found");
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error("Error updating item: ", error);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/:id", authenticateUser, async (req: Request, res: Response) => {
  connectDB();
  const { id } = req.params;
  try {
    const item = await Item.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).send({ message: "item not found" });
    }

    res.status(200).send({ message: "item Deleted Successfully", item });
  } catch (error) {
    console.error("Error deleting the item:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

export { router as itemEndpoints };
