import { Router } from "express";
import { cancelReservation, currentRoomOccupants, registerEntry, registerExit, registerReserve } from "./acccess.controller";
import { auth } from "../../middlewares/auth";


const router = Router()

router.post('/entry',auth, registerEntry)
router.post('/exit',auth, registerExit)
router.post('/reserve',auth, registerReserve)
router.put('/reservations/:id',auth, cancelReservation);
router.get('/current/room/:room_id',auth, currentRoomOccupants)

export { router }