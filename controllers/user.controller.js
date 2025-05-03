import Student from "../models/student.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashPassword, role });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const registerStudent = async (req, res) => {
  const { name, email, password, enrollmentNumber, role } = req.body;

  try {
    const existingUser = await Student.findOne({ enrollmentNumber });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new Student({
      name,
      email,
      password: hashPassword,
      enrollmentNumber,
      role,
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  const { role, email, password } = req.body;

  if (!role || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.verified) {
      return res.status(400).json({
        message: "You are not verified. Please contact admin for approval.",
      });
    }

    if ((role === "admin" || role === "faculty") && !user.verified) {
      return res.status(400).json({
        message: "You are not verified. Please contact C.E.O or Admin",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginStudent = async (req, res) => {
  const { enrollmentNumber, password } = req.body;

  if (!enrollmentNumber || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await Student.findOne({ enrollmentNumber });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Error logging in student:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const editUser = async (req, res) => {
  const { userId } = req.params;
  const { name, email, password, role, profileImg } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (profileImg) user.profileImg = profileImg;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (role) user.role = role;

    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const editStudent = async (req, res) => {
  const { studentId } = req.params;
  const { name, email, password, enrollmentNumber, profileImg } = req.body;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    if (name) student.name = name;
    if (email) student.email = email;
    if (enrollmentNumber) student.enrollmentNumber = enrollmentNumber;
    if (profileImg) student.profileImg = profileImg;
    if (password) student.password = await bcrypt.hash(password, 10);
    await student.save();
    res
      .status(200)
      .json({ message: "Student updated successfully", user: student });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUnverifiedUsers = async (req, res) => {
  try {
    const unverifiedUsers = await User.find({ verified: false });
    res.status(200).json({ unverifiedUsers });
  } catch (error) {
    console.error("Error fetching unverified users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.verified = true;
    await user.save();

    res.status(200).json({ message: "User verified successfully", user });
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
