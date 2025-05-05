import { Router } from "express";
import {
  createElection,
  deleteElection,
  getAllElections,
} from "../controllers/election.controller.js";

const router = Router();

router.post("/create", createElection);
router.delete("/delete/:electionId", deleteElection);
router.get("/get-all", getAllElections);

export default router;
