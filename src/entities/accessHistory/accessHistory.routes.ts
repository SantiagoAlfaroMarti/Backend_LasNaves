import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { getAccessHistories, getRoomAccessHistories } from "./accessHistory.controller";
import { isAdmin } from "../../middlewares/isAdmin";

const router = Router()

router.get('/',auth,isAdmin, getAccessHistories)
router.get('/room/:room_id',auth,isAdmin, getRoomAccessHistories)

export { router }