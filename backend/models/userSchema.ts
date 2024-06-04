import mongoose, { Schema } from "mongoose";

// Defining the type for a user object, specifying the structure of the user data.
export type IUser = {
  _id: Schema.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  groups: Schema.Types.ObjectId[];
  friends: Schema.Types.ObjectId[];
  wishlist: string[];
  joined: Date;
};

// Defining the data types and requirements for each field in our user schema.
//groupId and digitalWaiver seem to require a schema
//currently there is no schema for them so I am leaving them as null for now
//can groupId just be a string and digitalWaiver be a boolean?
const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  groups: { type: [Schema.Types.ObjectId], required: true, default: [] },
  friends: { type: [Schema.Types.ObjectId], required: true, default: [] },
  wishlist: { type: [String], required: true, default: [] },
  joined: { type: Date, required: true, default: Date.now },
});

// Create a model for the user schema, using the existing "users" model if it exists, otherwise creating a new one.
const User = mongoose.models["users"] || mongoose.model("users", UserSchema);

export default User;
