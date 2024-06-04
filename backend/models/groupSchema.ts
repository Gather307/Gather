import mongoose, { Schema } from "mongoose";

// Defining the type for a group object, specifying structure of group data.
export type IGroup = {
  _id: Schema.Types.ObjectId;
  groupName: string;
  privateGroup: boolean;
  description: string;
  members: Schema.Types.ObjectId[]; // Array of ObjectIds referencing the members of the group.
  baskets: Schema.Types.ObjectId[]; // Array of ObjectIds referencing the baskets of the group.
  created: Date;
};

// Defining the data types and requirements for each field in our group schema
const GroupSchema = new Schema<IGroup>({
  groupName: { type: String, required: true },
  privateGroup: { type: Boolean, required: true },
  description: { type: String, required: true },
  members: { type: [Schema.Types.ObjectId], required: true, default: [] },
  baskets: { type: [Schema.Types.ObjectId], required: true, default: [] },
  created: { type: Date, required: true, default: Date.now },
});

// Create a model for the group schema, using the existing "group" model if it exists, otherwise creating a new one.
const Group =
  mongoose.models["groups"] || mongoose.model("groups", GroupSchema);

export default Group;
