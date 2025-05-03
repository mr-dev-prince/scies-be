import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: [
      "cultural",
      "sports",
      "technical",
      "management",
      "social",
      "election",
      "other",
    ],
    default: "cultural",
  },
  date: {
    type: Date,
    required: true,
  },
  imageUrl: {
    type: String,
    default: null,
  },
});

const Event = mongoose.model("Event", eventSchema);
export default Event;
