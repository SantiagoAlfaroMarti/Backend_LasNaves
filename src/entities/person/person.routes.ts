import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { getAccessHistory, getCurrentAccess } from "./person.controller";


const router = Router()

router.get('/:id/current-access',auth, getCurrentAccess)
router.get('/:id/access-history',auth, getAccessHistory)

export { router }