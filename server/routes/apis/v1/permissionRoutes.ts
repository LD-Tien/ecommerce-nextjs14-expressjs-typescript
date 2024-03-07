import permissionsController from '../../../controllers/permission.controller'
import { Router } from 'express'

const router = Router()

router.get('/permissions', permissionsController.getPermissions)
router.get('/permissions/all', permissionsController.getAllPermissions)
router.post('/permissions', permissionsController.createPermission)
router.put('/permissions/:id', permissionsController.updatePermission)
router.delete('/permissions/:id', permissionsController.deletePermission)

export default router
