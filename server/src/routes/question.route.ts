import { Router } from "express";
import { verifyAuth } from "../middlewares/auth.middleware";
import {
  getQuestions,
  createQuestions,
  getDiagnosis,
} from "../controllers/question.controller";
import { ROLES } from "../utils/constants";
const router = Router();

router.get("/", verifyAuth(Object.values(ROLES)), getQuestions);
router.post("/add", verifyAuth(Object.values(ROLES)), createQuestions);
router.post("/diagnosis", verifyAuth(Object.values(ROLES)), getDiagnosis);

export default router;
