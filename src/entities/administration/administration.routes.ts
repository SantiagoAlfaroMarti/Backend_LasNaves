import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { generateDailyReport, getDateReport, getRoomUsageStats } from "./administration.controller";
import { isAdmin } from "../../middlewares/isAdmin";


const router = Router()

router.post('/daily-report',auth,isAdmin, generateDailyReport)
router.get('/room-usage',auth,isAdmin, getRoomUsageStats)
router.get('/reports',auth,isAdmin, getDateReport)

export { router }