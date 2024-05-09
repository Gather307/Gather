import mongoose, { Schema } from "mongoose";

export type IGroup = {
    _id: Schema.Types.ObjectId;
    groupname: string;
    private: boolean;
    description: string;
    members: Schema.Types.ObjectId[] | null;
    baskets: Schema.Types.ObjectId[] | null;
    created: Date;
};

const GroupSchema = new Schema<IGroup>({
    groupname: { type: String, required: true },
    private: { type: Boolean, required: true },
    description: { type: String, required: true },
    members: { type: [Schema.Types.ObjectId], required: true, default: [] },
    baskets: { type: [Schema.Types.ObjectId], required: true, default: [] },
    created: { type: Date, required: true, default: Date.now },
});

const Group = mongoose.models["groups"] || mongoose.model("groups", GroupSchema);

export default Group;
