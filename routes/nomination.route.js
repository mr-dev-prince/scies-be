import { Router } from "express";
import {
  acceptNomination,
  createNomination,
  deleteNomination,
  getNominations,
  pendingNominations,
  rejectNomination,
} from "../controllers/nomination.controller.js";

const router = Router();

router.post("/create", createNomination);
router.post("/delete", deleteNomination);
router.get("/get-all", getNominations);
router.get("/pending", pendingNominations);
router.post("/accept/:nominationId", acceptNomination);
router.post("/reject/:nominationId", rejectNomination);

export default router;
