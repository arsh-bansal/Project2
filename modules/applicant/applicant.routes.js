import { Router } from "express";
const router = Router();
import {
  saveApplicant,
  getApplicant,
  updateApplicant,
} from "./applicant.controller";

router.post("/applicant", saveApplicant);
router.get("/applicant", getApplicant);
router.patch("/applicant", updateApplicant);

export default router;
