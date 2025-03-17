import { Router } from "express";
import { saveSales } from "./controllers.js";

const router = Router();

router.post("/savesales", saveSales);
// Add other sales routes...

export default router;
