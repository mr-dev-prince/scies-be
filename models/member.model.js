import mongoose from "mongoose";

const POSITION_GROUPS = {
  Core: ["President", "Vice President", "Representative"],
  Cultural: [
    "Cultural Secretary",
    "Cultural Vice Secretary",
    "Cultural Coordinator",
  ],
  Discipline: [
    "Discipline Secretary",
    "Discipline Vice Secretary",
    "Discipline Cultural Coordinator",
    "Discipline Coordinator",
  ],
  "Women Cell": [
    "Women Cell Secretary",
    "Women Cell Vice Secretary",
    "Women Cell Coordinator",
  ],
  Treasury: [
    "Treasury Secretary",
    "Treasury Vice Secretary",
    "Treasury Coordinator",
  ],
  Media: ["Media Secretary", "Media Vice Secretary", "Media Coordinator"],
  Sport: ["Sport Secretary", "Sport Vice Secretary", "Sport Coordinator"],
  "Event Management": [
    "Event Management Secretary",
    "Event Management Vice Secretary",
    "Event Management Coordinator",
  ],
};

const ALLOWED_POSITIONS = Object.values(POSITION_GROUPS).flat();

const memberSchema = new mongoose.Schema({
  enrollmentNumber: {
    type: String,
    required: true,
    unique: true,
  },
  position: {
    type: String,
    required: true,
    enum: ALLOWED_POSITIONS,
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
