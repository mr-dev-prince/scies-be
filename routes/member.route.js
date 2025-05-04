import { Router } from "express";
import {
  createMember,
  deleteMember,
  getAllMembers,
  getUnVerifiedMembers,
  verifyMember,
} from "../controllers/member.controller.js";

const router = Router();

router.post("/create", createMember);
router.delete("/delete/:memberId", deleteMember);
router.get("/get-all", getAllMembers);
router.get("/unverified", getUnVerifiedMembers);
router.post("/verify/:memberId", verifyMember);

export default router;
