import { Router } from "express";
import {
  deleteUser,
  editStudent,
  editUser,
  getUnverifiedUsers,
  loginStudent,
  loginUser,
  registerStudent,
  registerUser,
  removeProfileImg,
  removeStudentProfileImg,
  verifyUser,
} from "../controllers/user.controller.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/edit/:userId", editUser);
router.get("/unverified", getUnverifiedUsers);
router.post("/register-student", registerStudent);
router.post("/login-student", loginStudent);
router.put("/edit-student/:studentId", editStudent);
router.post("/verify/:userId", verifyUser);
router.delete("/delete/:userId", deleteUser);
router.post("/remove-profile-img/:userId", removeProfileImg);
router.post("/remove-student-profile-img/:studentId", removeStudentProfileImg);

export default router;
