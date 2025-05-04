import Election from "../models/election.model.js";
import Nomination from "../models/nomination.model.js";
import User from "../models/user.model.js";

export const createNomination = async (req, res) => {
  const { electionId, userId, position } = req.body;

  if (!electionId || !userId || !position) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findById(userId);

    if (user) {
      return res
        .status(400)
        .json({ message: "Only Students can nominate for elections." });
    }

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
    const nominations = await Nomination.aggregate([
      {
        $match: {
          status: "pending",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "students",
          localField: "userId",
          foreignField: "_id",
          as: "student",
        },
      },
      {
        $lookup: {
          from: "elections",
          localField: "electionId",
          foreignField: "_id",
          as: "election",
        },
      },
      {
        $project: {
          _id: 1,
          position: 1,
          status: 1,
          userId: 1,
          electionId: 1,
          user: { $arrayElemAt: ["$user", 0] },
          student: { $arrayElemAt: ["$student", 0] },
          election: { $arrayElemAt: ["$election", 0] },
          isStudent: {
            $cond: {
              if: { $gt: [{ $size: "$student" }, 0] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          position: 1,
          status: 1,
          userId: 1,
          electionId: 1,
          userType: {
            $cond: { if: "$isStudent", then: "student", else: "user" },
          },
          userInfo: {
            $cond: {
              if: "$isStudent",
              then: {
                _id: "$student._id",
                name: "$student.name",
                email: "$student.email",
                profileImg: "$student.profileImg",
                enrollmentNumber: "$student.enrollmentNumber",
                role: "$student.role",
              },
              else: {
                _id: "$user._id",
                name: "$user.name",
                email: "$user.email",
                profileImg: "$user.profileImg",
                verified: "$user.verified",
                role: "$user.role",
              },
            },
          },
          election: {
            _id: "$election._id",
            name: "$election.name",
            description: "$election.description",
            startDate: "$election.startDate",
            nominationCloseDate: "$election.nominationCloseDate",
            positions: "$election.positions",
            imageUrl: "$election.imageUrl",
          },
        },
      },
    ]);

    res.status(200).json({ nominations });
  } catch (error) {
    console.error("Error fetching pending nominations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const acceptNomination = async (req, res) => {
  const { nominationId } = req.params;

  try {
    const nomination = await Nomination.findById(nominationId);

    if (!nomination) {
      return res.status(404).json({ message: "Nomination not found" });
    }

    const election = await Election.findById(nomination.electionId);

    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    const position = election.positions.find(
      (pos) => pos.title === nomination.position
    );

    if (!position) {
      return res.status(404).json({
        message: `Position '${nomination.position}' not found in this election`,
      });
    }

    const nominationsCount = await Nomination.countDocuments({
      electionId: nomination.electionId,
      position: nomination.position,
      status: "accepted",
    });

    if (nominationsCount >= position.maxCandidates) {
      return res.status(400).json({
        message: `Cannot accept nomination. Maximum candidates for position '${nomination.position}' reached.`,
      });
    }

    const updatedNomination = await Nomination.findByIdAndUpdate(
      nominationId,
      { status: "accepted" },
      { new: true }
    );

    res.status(200).json({
      message: "Nomination accepted successfully",
    });
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
