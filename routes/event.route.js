import { Router } from "express";
import {
  createEvent,
  deleteEvent,
  getElectionEvents,
  getEvents,
} from "../controllers/event.controller.js";

const router = Router();

router.post("/create", createEvent);
router.delete("/delete/:eventId", deleteEvent);
router.get("/get-all", getEvents);
router.get("/get-election-events", getElectionEvents);

export default router;
