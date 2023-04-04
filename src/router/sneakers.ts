import { Router } from 'express'
import infoSneaker from '../controllers/infoSneaker'
import sneakersEqual from '../controllers/sneakersEqual'
import sneakersControllers from '../controllers/sneakersFilterControllers'

const router = Router()

router.get('/sneakers', sneakersControllers.filterSneakers)
router.get('/sneakers/infoSneaker', infoSneaker.infoSneaker)
router.get('/sneakers/sneakersEqual', sneakersEqual.sneakersEqual)
router.get('/', (req, res) => {
  res.send({ message: 'hellow' })
})

export default router
