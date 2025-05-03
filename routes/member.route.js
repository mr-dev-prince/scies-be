import { Router } from "express";
import {
  createMember,
  deleteMember,
  getAllMembers,
} from "../controllers/member.controller.js";

const router = Router();

router.post("/create", createMember);
router.delete("/delete/:memberId", deleteMember);
router.get("/get-all", getAllMembers);

export default router;
