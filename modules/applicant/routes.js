import { Router } from "express";
const router = Router();
import { saveApplicant, getApplicant, updateApplicant } from "./controller.js";

router.post("/applicant", saveApplicant);
router.get("/applicant", getApplicant);
router.patch("/applicant", updateApplicant);

export default router;
