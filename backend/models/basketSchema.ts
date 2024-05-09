import mongoose, { Schema } from "mongoose";

export type IBasket = {
    _id: Schema.Types.ObjectId;
    basketName: string;
    description: string;
    members: Schema.Types.ObjectId[] | null;
    items: Schema.Types.ObjectId[] | null;
    created: Date;
};

const BasketSchema = new Schema<IBasket>({
    basketName: { type: String, required: true },
    description: { type: String, required: true },
    members: { type: [Schema.Types.ObjectId], required: true, default: [] },
    items: { type: [Schema.Types.ObjectId], required: true, default: [] },
    created: { type: Date, required: true, default: Date.now },
});

const Basket = mongoose.models["basket"] || mongoose.model("basket", BasketSchema);

export default Basket;