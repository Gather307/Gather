import mongoose, { Schema } from "mongoose";

export type IItem = {
    _id: Schema.Types.ObjectId,
    name: string,
    toShare: boolean,
    isPrivate: boolean,
    type: string,
    basket: Schema.Types.ObjectId,
    notes: string,
    price: number,
    quantity: number,
    created: Date,
    lastModified: Date,
};

// Mongoose schema
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

const Event = mongoose.models["items"] || mongoose.model("items", itemSchema);

export default Event;
