import mongoose from "mongoose";
import Nomination from "./nomination.model.js";

const positionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  maxCandidates: {
    type: Number,
    default: 1,
  },
});

const electionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  nominationCloseDate: {
    type: Date,
    required: true,
  },
  positions: {
    type: [positionSchema],
    required: true,
  },
  imageUrl: {
    type: String,
    default: null,
  },
});

electionSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      await Nomination.deleteMany({ electionId: this._id });
      next();
    } catch (error) {
      next(error);
    }
  }
);

const Election = mongoose.model("Election", electionSchema);
export default Election;
