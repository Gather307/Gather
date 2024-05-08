import mongoose, { Schema } from "mongoose";

export type IItem = {
    _id: Schema.Types.ObjectId,
    eventName: string,
    toShare: boolean,
    type: string,
    owner: Schema.Types.ObjectId,
    group: Schema.Types.ObjectId,
    notes: string,
    price: number,
    quantity: number,
    created: Date,
    lastModified: Date,
};

// Mongoose schema
const itemSchema = new Schema({
    eventName: { type: String, required: true },
    toShare: { type: Boolean, required: true },
    type: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, required: true },
    group: { type: Schema.Types.ObjectId, required: true },
    notes: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    created: { type: Date, required: true, default: Date.now },
    lastModified: { type: Date, required: true, default: Date.now },
});

const Event =
    mongoose.models["items"] || mongoose.model("items", itemSchema);

export default Event;
