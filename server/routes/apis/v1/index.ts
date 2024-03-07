import { Router } from 'express'
import permissionRoutes from './permissionRoutes'
import roleRoutes from './roleRoutes'

const api = Router().use(permissionRoutes).use(roleRoutes)

export default Router().use('/v1', api)
