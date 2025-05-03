import Nomination from "../models/nomination.model.js";

export const createNomination = async (req, res) => {
  const { electionId, userId, position } = req.body;

  if (!electionId || !userId || !position) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingNomination = await Nomination.findOne({
      electionId,
      userId,
    });

    if (existingNomination) {
      return res.status(400).json({
        message: "You are already nominated in this election.",
      });
    }

    const newNomination = new Nomination({
      electionId,
      userId,
      position,
    });

    await newNomination.save();

    res.status(201).json({
      message: "Nomination created successfully",
      nomination: newNomination,
    });
  } catch (error) {
    console.error("Error creating nomination:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getNominations = async (req, res) => {
  try {
    const nominations = await Nomination.find()
      .populate({
        path: "userId",
        select: "name email role",
      })
      .populate({
        path: "electionId",
        select: "name description startDate endDate positions",
      })
      .lean();

    const updatedNominations = nominations.map((nomination) => {
      return {
        ...nomination,
        user: nomination.userId,
        election: nomination.electionId,
      };
    });

    const finalNominations = updatedNominations.map(
      ({ userId, electionId, ...rest }) => rest
    );

    res.status(200).json({ nominations: finalNominations });
  } catch (error) {
    console.error("Error fetching nominations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteNomination = async (req, res) => {
  const { nominationId } = req.params;

  try {
    const nomination = await Nomination.findByIdAndDelete(nominationId);

    if (!nomination) {
      return res.status(404).json({ message: "Nomination not found" });
    }

    res.status(200).json({ message: "Nomination deleted successfully" });
  } catch (error) {
    console.error("Error deleting nomination:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const pendingNominations = async (req, res) => {
  try {
    const nominations = await Nomination.find({ status: "pending" });
    res.status(200).json({ nominations });
  } catch (error) {
    console.error("Error fetching pending nominations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const acceptNomination = async (req, res) => {
  const { nominationId } = req.params;

  try {
    const nomination = await Nomination.findByIdAndUpdate(
      nominationId,
      { status: "accepted" },
      { new: true }
    );

    if (!nomination) {
      return res.status(404).json({ message: "Nomination not found" });
    }

    res.status(200).json({ message: "Nomination accepted", nomination });
  } catch (error) {
    console.error("Error accepting nomination:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const rejectNomination = async (req, res) => {
  const { nominationId } = req.params;

  try {
    const nomination = await Nomination.findByIdAndUpdate(
      nominationId,
      { status: "rejected" },
      { new: true }
    );

    if (!nomination) {
      return res.status(404).json({ message: "Nomination not found" });
    }

    res.status(200).json({ message: "Nomination rejected", nomination });
  } catch (error) {
    console.error("Error rejecting nomination:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
