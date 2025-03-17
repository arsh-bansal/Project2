import { Router } from "express";
import {
  saveLogin,
  validateLogin,
  updatePassword,
} from "./controllers.js";

const router = Router();

router.post("/savelogin", saveLogin);
router.get("/validatelogin", validateLogin);
router.post("/updatepassword", updatePassword);

export default router;
