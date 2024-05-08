import mongoose, { Mongoose, Schema } from "mongoose";

export type IGroup = {
    _id: Schema.Types.ObjectId;
    groupname: string;
    private: boolean;
    description: string;
    members: Schema.Types.ObjectId[] | null;
    items: Schema.Types.ObjectId[] | null;
    created: Date;
};

const Group = new Schema<IGroup>({
    groupname: { type: String, required: true },
    private: { type: Boolean, required: true },
    description: { type: String, required: true },
    members: { type: [Schema.Types.ObjectId], required: true, default: [] },
    items: { type: [Schema.Types.ObjectId], required: true, default: [] },
    created: { type: Date, required: true, default: Date.now },
});

export default mongoose.models["groups"] || mongoose.model("groups", Group);
