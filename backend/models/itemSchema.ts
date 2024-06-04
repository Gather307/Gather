import mongoose, { Schema } from "mongoose";

// Defining the type for an item object, specifying the structure of the item data.
export type IItem = {
  _id: Schema.Types.ObjectId;
  name: string;
  toShare: boolean;
  isPrivate: boolean;
  type: string;
  basket: Schema.Types.ObjectId; // ObjectId referencing the basket to which the item belongs.
  notes: string;
  price: number;
  quantity: number;
  created: Date; // Timestamp for when the item was created.
  lastModified: Date; // Timestamp for when the item was last modified.
};

// Defining the data types and requirements for each field in our item schema.
const itemSchema = new Schema({
  name: { type: String, required: true },
  toShare: { type: Boolean, required: true },
  isPrivate: { type: Boolean, required: true },
  type: { type: String, required: true },
  basket: { type: Schema.Types.ObjectId, required: true },
  notes: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  created: { type: Date, required: true, default: Date.now },
  lastModified: { type: Date, required: true, default: Date.now },
});

// Create a model for the item schema, using the existing "items" model if it exists, otherwise creating a new one.
const Event = mongoose.models["items"] || mongoose.model("items", itemSchema);

export default Event;
