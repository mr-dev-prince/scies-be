import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["query", "grievances", "suggestion"],
      required: true,
    },
    resolved: {
      type: Number,
      enum: [0, 1, 2], // 0: unresolved , 1: resolved, 2: in progress
      default: 2,
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model("Contact", contactSchema);
export default Contact;
