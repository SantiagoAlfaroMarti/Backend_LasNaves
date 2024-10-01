import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { getCurrentRoomStatus } from "./room.controller";


const router = Router()

router.get('/:id/current-status',auth, getCurrentRoomStatus)

export { router }