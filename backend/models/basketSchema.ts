import mongoose, { Schema } from "mongoose";

// Defining the type for a basket object, specifying structure of basket data.
export type IBasket = {
  _id: Schema.Types.ObjectId; // Unique identifier for the basket, using MongoDB ObjectId.
  basketName: string;
  description: string;
  members: Schema.Types.ObjectId[]; // Array of ObjectIds referencing the members of the basket.
  items: Schema.Types.ObjectId[]; // Array of ObjectIds referencing the items of the basket.
  created: Date; // Timestamp for when the basket was creaed
};

// Defining the data types and requirements for each field in our basket schema
const BasketSchema = new Schema<IBasket>({
  basketName: { type: String, required: true },
  description: { type: String, required: true },
  members: { type: [Schema.Types.ObjectId], required: true, default: [] },
  items: { type: [Schema.Types.ObjectId], required: true, default: [] },
  created: { type: Date, required: true, default: Date.now },
});

// Create a model for the basket schema, using the existing "basket" model if it exists, otherwise creating a new one.
const Basket =
  mongoose.models["basket"] || mongoose.model("basket", BasketSchema);

export default Basket;
