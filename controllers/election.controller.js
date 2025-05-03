import Election from "../models/election.model.js";

export const createElection = async (req, res) => {
  try {
    const {
      name,
      description,
      startDate,
      nominationCloseDate,
      endDate,
      positions,
      imageUrl,
    } = req.body;

    if (!name || !description || !startDate || !endDate || !imageUrl || !nominationCloseDate) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!positions || positions.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one position is required." });
    }

    const newElection = new Election({
      name,
      description,
      startDate,
      nominationCloseDate,
      endDate,
      positions,
      imageUrl,
    });

    await newElection.save();

    res.status(201).json({
      message: "Election created successfully",
      election: newElection,
    });
  } catch (error) {
    console.error("Error creating election:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllElections = async (req, res) => {
  try {
    const elections = await Election.aggregate([
      {
        $lookup: {
          from: "nominations",
          localField: "_id",
          foreignField: "electionId",
          as: "nominations",
        },
      },
      { $unwind: { path: "$nominations", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "nominations.userId",
          foreignField: "_id",
          as: "nominations.user",
        },
      },
      {
        $unwind: {
          path: "$nominations.user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "votes",
          let: {
            electionId: "$_id",
            position: "$nominations.position",
            candidateId: "$nominations.userId",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$electionId", "$$electionId"] },
                    { $eq: ["$position", "$$position"] },
                    { $eq: ["$candidateId", "$$candidateId"] },
                  ],
                },
              },
            },
            { $count: "voteCount" },
          ],
          as: "voteData",
        },
      },
      {
        $addFields: {
          "nominations.votes": {
            $ifNull: [{ $arrayElemAt: ["$voteData.voteCount", 0] }, 0],
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          description: { $first: "$description" },
          startDate: { $first: "$startDate" },
          endDate: { $first: "$endDate" },
          positions: { $first: "$positions" },
          imageUrl: { $first: "$imageUrl" },
          nominations: {
            $push: {
              _id: "$nominations._id",
              userId: "$nominations.userId",
              user: "$nominations.user",
              position: "$nominations.position",
              status: "$nominations.status",
              votes: "$nominations.votes",
            },
          },
        },
      },
    ]);

    res.status(200).json({ elections });
  } catch (error) {
    console.error("Error fetching elections with nominations:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getElectionById = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);

    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    res.status(200).json({ election });
  } catch (error) {
    console.error("Error fetching election:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateElection = async (req, res) => {
  try {
    const updatedElection = await Election.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedElection) {
      return res.status(404).json({ message: "Election not found" });
    }

    res
      .status(200)
      .json({ message: "Election updated", election: updatedElection });
  } catch (error) {
    console.error("Error updating election:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteElection = async (req, res) => {
  try {
    const electionId = req.params.id;

    const election = await Election.findByIdAndDelete(electionId);

    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    return res.status(200).json({
      message: "Election and related nominations deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting election:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
