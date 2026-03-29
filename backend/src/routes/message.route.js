import express from "express";
import { protectRoute } from "../middleware/auth.middleware";
import {
  getAllContacts,
  getChatPartnerIds,
  getMessages,
  sendMessage,
} from "../controllers/message.controller";
import { arcjetPortection } from "../middleware/arcjet.middleware";

const router = express.Router();

router.use(arcjetPortection, protectRoute);
router.get("/contacts", getAllContacts);

router.get("/chats", getChatPartnerIds);

router.get("/:id", getMessages);

router.post("/send/:id", sendMessage);

export default router;
