import Vote from "../models/vote.model.js";

export const addVote = async (req, res) => {
  try {
    const { userId, electionId, position, candidateId } = req.body;

    const existingVote = await Vote.findOne({
      userId,
      electionId,
      position,
    });

    if (existingVote) {
      return res.status(400).json({ message: "You have already voted." });
    }

    const newVote = new Vote({
      userId,
      electionId,
      position,
      candidateId,
    });
    await newVote.save();
    res.status(201).json({ message: "Vote added successfully." });
  } catch (error) {
    console.error("Error adding vote:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getVotes = async (req, res) => {
  try {
    const { electionId } = req.params;
    const votes = await Vote.find({ electionId }).populate("candidateId");
    res.status(200).json(votes);
  } catch (error) {
    console.error("Error fetching votes:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getVoteByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const votes = await Vote.find({ userId }).populate("candidateId");
    res.status(200).json(votes);
  } catch (error) {
    console.error("Error fetching votes:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getVoteByElection = async (req, res) => {
  try {
    const { electionId } = req.params;
    const votes = await Vote.find({ electionId }).populate("candidateId");
    res.status(200).json(votes);
  } catch (error) {
    console.error("Error fetching votes:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getVoteByPosition = async (req, res) => {
  try {
    const { position } = req.params;
    const votes = await Vote.find({ position }).populate("candidateId");
    res.status(200).json(votes);
  } catch (error) {
    console.error("Error fetching votes:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getVoteByCandidate = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const votes = await Vote.find({ candidateId }).populate("candidateId");
    res.status(200).json(votes);
  } catch (error) {
    console.error("Error fetching votes:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


