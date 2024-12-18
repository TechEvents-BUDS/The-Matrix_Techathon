import { Router } from "express";
import { verifyAuth } from "../middlewares/auth.middleware";
import { ROLES } from "../utils/constants";
import { chat } from "../controllers/chat.controller";
const router = Router();

router.get("/chat", verifyAuth(Object.values(ROLES)), chat);

export default router;
