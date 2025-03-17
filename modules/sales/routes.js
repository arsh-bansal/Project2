import { Router } from "express";
import { saveSales, getTodaySales, getSalesHistory, getTotalSales, getFilteredChartData, getFilteredSalesByDay, getFilteredCustomerDistribution } from "./controller.js";

const router = Router();

router.post("/savesales", saveSales);
router.get("/todaysales", getTodaySales);
router.get("/saleshistory", getSalesHistory);
router.get("/totalsales", getTotalSales);
router.get("/filteredchartdata", getFilteredChartData);
router.get("/filteredsalesbyday", getFilteredSalesByDay);
router.get("/filteredcustomerdistribution", getFilteredCustomerDistribution);

export default router;
