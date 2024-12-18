import { Router } from "express";
import { verifyAuth } from "../middlewares/auth.middleware";
import {
  getQuestions,
  createQuestions,
  getDiagnosis,
  generateQuestionsFromAI
} from "../controllers/question.controller";
import { ROLES } from "../utils/constants";
const router = Router();

router.get("/", verifyAuth(Object.values(ROLES)), getQuestions);
router.post("/add", verifyAuth(Object.values(ROLES)), createQuestions);
router.post("/diagnosis", verifyAuth(Object.values(ROLES)), getDiagnosis);
router.get("/generate", verifyAuth(Object.values(ROLES)), generateQuestionsFromAI);

export default router;
