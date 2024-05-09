import mongoose, { Schema } from "mongoose";

export type IUser = {
    _id: Schema.Types.ObjectId;
    username: string;
    groups: Schema.Types.ObjectId[] | null;
    friends: Schema.Types.ObjectId[] | null;
    wishlist: string[] | null;
    joined: Date;
};

//groupId and digitalWaiver seem to require a schema
//currently there is no schema for them so I am leaving them as null for now
//can groupId just be a string and digitalWaiver be a boolean?
const UserSchema = new Schema<IUser>({
    username: { type: String, required: true },
    groups: { type: [Schema.Types.ObjectId], required: true, default: [] },
    friends: { type: [Schema.Types.ObjectId], required: true, default: [] },
    wishlist: { type: [String], required: true, default: [] },
    joined: { type: Date, required: true, default: Date.now }
});

const User = mongoose.models["users"] || mongoose.model("users", UserSchema);

export default User;
