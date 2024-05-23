import mongoose, { Schema } from "mongoose";

export type IItem = {
  _id: Schema.Types.ObjectId;
  eventName: string;
  eventImage: string | null;
  eventType: string;
  location: string;
  description: string;
  wheelchairAccessible: boolean;
  spanishSpeakingAccommodation: boolean;
  startTime: Date;
  endTime: Date;
  volunteerEvent: boolean;
  groupsAllowed: Schema.Types.ObjectId[] | null;
  attendeeIds: Schema.Types.ObjectId[];
  registeredIds: Schema.Types.ObjectId[];
};

// Mongoose schema
const itemSchema = new Schema({
  eventName: { type: String, required: true },
  eventImage: { type: String, required: false },
  eventType: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  wheelchairAccessible: { type: Boolean, required: true },
  spanishSpeakingAccommodation: { type: Boolean, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  volunteerEvent: { type: Boolean, required: true },
  groupsAllowed: { type: [Schema.Types.ObjectId], required: false },
  attendeeIds: {
    type: [Schema.Types.ObjectId],
    required: false,
    default: [],
  },
  registeredIds: {
    type: [Schema.Types.ObjectId],
    required: true,
    default: [],
  },
});

const Event = mongoose.models["items"] || mongoose.model("items", itemSchema);

export default Event;
