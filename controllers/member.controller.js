import Member from "../models/member.model.js";
import Student from "../models/student.model.js";

export const getAllMembers = async (req, res) => {
  try {
    const members = await Member.find({ verified: true }).populate(
      "student",
      "name email enrollmentNumber profileImg"
    );
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: "Error fetching verified members" });
  }
};

export const createMember = async (req, res) => {
  const { enrollmentNumber, position } = req.body;

  try {
    const existingMember = await Member.findOne({ enrollmentNumber });

    if (existingMember) {
      return res.status(400).json({ message: "Member already exists" });
    }

    const existingPosition = await Member.findOne({ position });

    if (existingPosition) {
      return res
        .status(400)
        .json({ message: "Member for this position already exist" });
    }

    const student = await Student.findOne({ enrollmentNumber });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const studentId = student._id;

    const newMember = new Member({
      enrollmentNumber,
      position,
      student: studentId,
    });

    await newMember.save();
    res.status(201).json(newMember);
  } catch (error) {
    res.status(500).json({ message: "Error creating member" });
  }
};

export const deleteMember = async (req, res) => {
  const { memberId } = req.params;

  try {
    const deletedMember = await Member.findByIdAndDelete(memberId);
    if (!deletedMember) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting member" });
  }
};

export const verifyMember = async (req, res) => {
  const { memberId } = req.params;

  try {
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    member.verified = true;
    await member.save();
    res.status(200).json({ message: "Member verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error verifying member" });
  }
};

export const getUnVerifiedMembers = async (req, res) => {
  try {
    const unverifiedMembers = await Member.find({ verified: false }).populate(
      "student",
      "name email enrollmentNumber profileImg"
    );
    res.status(200).json({ unverifiedMembers });
  } catch (error) {
    res.status(500).json({ message: "Error fetching unverified members" });
  }
};
