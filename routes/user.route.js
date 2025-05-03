import { Router } from "express";
import {
  editStudent,
  editUser,
  getUnverifiedUsers,
  loginStudent,
  loginUser,
  registerStudent,
  registerUser,
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

export default router;
