import mongoose, { Schema } from "mongoose";

export type IUser = {
    _id: Schema.Types.ObjectId;
};

//groupId and digitalWaiver seem to require a schema
//currently there is no schema for them so I am leaving them as null for now
//can groupId just be a string and digitalWaiver be a boolean?
const UserSchema = new Schema({
});

const User =
    mongoose.models["userTest"] || mongoose.model("userTest", UserSchema);

export default User;
