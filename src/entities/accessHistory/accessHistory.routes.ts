import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { getAccessHistories, getRoomAccessHistories } from "./accessHitory.controller";

const router = Router()

router.get('/',auth, getAccessHistories)
router.get('/room/:room_id',auth, getRoomAccessHistories)

export { router }