import { Router } from "express";
import { createContact, getContacts } from "../controllers/contact.controller.js";

const router = Router();

router.post("/create", createContact);
router.get("/get-all", getContacts);

export default router;