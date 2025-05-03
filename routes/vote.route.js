import { Router } from "express";
import { addVote, getVotes } from "../controllers/vote.controller.js";

const router = Router();

router.post("/add", addVote);
router.get("/getAllVotes", getVotes);

export default router;
