import { Router } from "express";
import { createContact, deleteContact, getContacts, rejectContact, resolveContact } from "../controllers/contact.controller.js";

const router = Router();

router.post("/create", createContact);
router.get("/get-all", getContacts);
router.delete("/delete/:id", deleteContact);
router.put("/resolve/:id", resolveContact);
router.put("/reject/:id", rejectContact);

export default router;