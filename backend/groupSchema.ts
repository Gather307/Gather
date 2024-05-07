import mongoose, { Mongoose, Schema } from "mongoose";

export type IGroup = {
};

const Group = new Schema<IGroup>({
});

export default mongoose.models["groups"] || mongoose.model("groups", Group);
