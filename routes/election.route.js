import { Router } from "express";
import {
  createElection,
  deleteElection,
  getAllElections,
  getElectionResults,
} from "../controllers/election.controller.js";

const router = Router();

router.post("/create", createElection);
router.delete("/delete/:electionId", deleteElection);
router.get("/get-all", getAllElections);
router.get("/get-results", getElectionResults);

export default router;
