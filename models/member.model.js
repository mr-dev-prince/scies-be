import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  enrollmentNumber: {
    type: String,
    required: true,
    unique: true,
  },
  position: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
});

const Member = mongoose.model("Member", memberSchema);

export default Member;
