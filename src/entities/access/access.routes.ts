import { Router } from "express";
import { cancelReservation, currentRoomOccupants, getActiveReservation, registerEntry, registerExit, registerReserve } from "./access.controller";
import { auth } from "../../middlewares/auth";

const router = Router()

router.post('/entry',auth, registerEntry)
router.post('/exit',auth, registerExit)
router.post('/reserve',auth, registerReserve)
router.put('/reservations/:id',auth, cancelReservation);
router.get('/reservations/info',auth, getActiveReservation);
router.get('/current/room/:room_id',auth, currentRoomOccupants)

export { router }