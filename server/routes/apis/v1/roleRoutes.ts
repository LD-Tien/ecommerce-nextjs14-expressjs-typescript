import permissionsController from '../../../controllers/role.controller'
import { Router } from 'express'

const router = Router()

router.get('/roles', permissionsController.getRoles)
router.post('/roles', permissionsController.createRole)
router.put('/roles/:id', permissionsController.updateRole)
router.delete('/roles/:id', permissionsController.deleteRole)

export default router
