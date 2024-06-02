import express from "express";
import { Request, Response } from "express";
import Basket, { IBasket } from "../models/basketSchema.js";
import connectDB from "../connection.js";
import { authenticateUser } from "../auth.js";

const router = express.Router();

router.get("/", authenticateUser, async (req: Request, res: Response) => {
  connectDB();
  try {
    const baskets = await Basket.find({});
    if (baskets.length === 0) {
      res.status(404).send("No baskets found"); // Return a 404 status code if no baskets are found
    } else {
      res.send(baskets); // Return the found baskets
    }
  } catch (error) {
    res.status(500).send("Internal Server Error"); // Handle any unexpected errors
  }
});

router.get(
  "/:basketid",
  authenticateUser,
  async (req: Request, res: Response) => {
    // Ensure the database connection
    connectDB();

    try {
      // Use findById correctly with the id parameter from the request
      const basketById = await Basket.findById(req.params.basketid);

      // Check if basket is null or undefined
      if (!basketById) {
        // If not found by ObjectId, try to find by basketName
        const basketsByName = await Basket.find({
          basketName: req.params.basketid,
        });

        if (!basketsByName.length) {
          return res.status(404).send("No baskets found"); // Use return to exit the function after sending the response
        }

        // Send the found baskets
        return res.send(basketsByName);
      }

      // Send the found basket by ObjectId
      res.send(basketById);
      console.log("Sent Basket:", basketById);
    } catch (error) {
      console.error("Error fetching basket:", error); // Log the error for debugging
      res.status(500).send("Internal Server Error");
    }
  },
);

router.post("/", authenticateUser, async (req: Request, res: Response) => {
  connectDB();
  try {
    console.log("Creating a new basket with data:", req.body);
    //Create new basket to add
    const { basketName, description, members, items } = req.body;
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

router.patch("/:id", authenticateUser, async (req: Request, res: Response) => {
  // Get basket ID from URL
  const { id } = req.params;
  const updatedData: Partial<IBasket> = req.body; // Not a full update, only partial

  try {
    connectDB();
    console.log(updatedData);
    const updatedBasket = await Basket.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    }).lean();
    if (!updatedBasket) {
      return res.status(404).send("Basket not found");
    }

    res.status(200).json(updatedBasket);
  } catch (error) {
    console.error("Error updating Basket: ", error);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/:id", authenticateUser, async (req: Request, res: Response) => {
  connectDB();
  const { id } = req.params;
  try {
    const basket = await Basket.findByIdAndDelete(id);

    if (!basket) {
      return res.status(404).send({ message: "Basket not found" });
    }

    res.status(200).send({ message: "Basket Deleted Successfully", basket });
  } catch (error) {
    console.error("Error deleting the Basket:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

export { router as basketEndpoints };
