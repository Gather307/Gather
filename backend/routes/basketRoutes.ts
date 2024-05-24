import express from "express";
import { Request, Response } from "express";
import Basket, { IBasket } from "../models/basketSchema";
import connectDB from "../connection";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  connectDB();
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
router.get("/:bid", async (req: Request, res: Response) => {
  connectDB();
  // Use findById correctly with the id parameter from the request
  const basket = await Basket.findById(req.params.bid).maxTimeMS(2000);

  // Check if group is null or undefined
  if (!basket) {
    return res.status(404).send("No basket found."); // Use return to exit the function after sending the response
  }

  // Send the found user
  res.send(basket);
  console.log("Sent Group");
});

router.post("/", async (req: Request, res: Response) => {
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

router.patch("/:id", async (req: Request, res: Response) => {
  // Get user ID from URL
  const { id } = req.params;
  const updatedData: Partial<IBasket> = req.body; //Not a full update only partial

  try {
    connectDB();

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

router.delete("/:id", async (req: Request, res: Response) => {
  connectDB();
  const { id } = req.params;
  try {
    const basket = await Basket.findByIdAndDelete(id);

    if (!basket) {
      return res.status(404).send({ message: "basket not found" });
    }

    res.status(200).send({ message: "Basket Deleted Successfully", basket });
  } catch (error) {
    console.error("Error deleting the Basket:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

export { router as basketEndpoints };
