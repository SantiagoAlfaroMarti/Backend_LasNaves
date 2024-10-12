import { Router } from "express";
import { router as authRoutes } from './entities/auth/auth.routes'
import { router as accessesRoutes } from './entities/access/access.routes'
import { router as personRoutes } from './entities/person/person.routes'
import { router as roomRoutes } from './entities/room/room.routes'
import { router as accessHistoriesRoutes } from './entities/accessHistory/accessHistory.routes'
import { router as administrationRoutes } from './entities/administration/administration.routes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/accesses', accessesRoutes)
router.use('/persons', personRoutes)
router.use('/rooms', roomRoutes)
router.use('/access_histories', accessHistoriesRoutes)
router.use('/administration', administrationRoutes)

export default router