import { NextFunction, Request, Response } from 'express'
import roleService from '../services/role.service'

export const getRoles = async (req: Request, res: Response, next: NextFunction) => {
    console.log(`===> (ExpressJS) GET: ${req.originalUrl}`)
    try {
        let page = parseInt(req.query.page as string) || 1
        let limit = parseInt(req.query.limit as string) || 5
        if (page < 0) page = 1
        if (limit < 5) limit = 5
        const offset = page * limit - limit
        const result = await roleService.getRoles(offset, limit)
        return res.json({
            statusCode: 200,
            data: {
                meta: {
                    current: page,
                    pageSize: limit,
                    total: result.total,
                },
                result: result.roles,
            },
        })
    } catch (error) {
        console.log(error)
        return res.json({
            statusCode: 400,
            error,
            message: 'Đã xảy ra lỗi khi lấy thông tin role!!',
        })
    }
}

export const createRole = async (req: Request, res: Response, next: NextFunction) => {
    console.log(`===> (ExpressJS) POST: ${req.originalUrl}`)
    try {
        const roleCreated = await roleService.createRole(req.body)
        return res.json({
            statusCode: 200,
            data: {
                roleCreated,
            },
            message: 'Tạo role thành công!',
        })
    } catch (error) {
        console.log(error)
        return res.json({
            statusCode: 400,
            error,
            message: 'Đã xảy ra lỗi khi tạo role!',
        })
    }
}

export const updateRole = async (req: Request, res: Response, next: NextFunction) => {
    console.log(`===> (ExpressJS) PUT: ${req.originalUrl}`)
    try {
        const roleUpdated = await roleService.updateRole({
            id: parseInt(req.params.id as string),
            dataUpdate: req.body,
        })
        return res.json({
            statusCode: 200,
            data: {
                roleUpdated,
            },
            message: 'Cập nhật role thành công',
        })
    } catch (error) {
        console.log(error)
        return res.json({
            statusCode: 400,
            error,
            message: 'Đã xảy ra lỗi khi cập nhật role!',
        })
    }
}

export const deleteRole = async (req: Request, res: Response, next: NextFunction) => {
    console.log(`===> (ExpressJS) DELETE: ${req.originalUrl}`)
    try {
        const roleDeleted = await roleService.deleteRole(+req.params.id)
        res.json({
            statusCode: 200,
            data: {
                roleDeleted,
            },
            message: 'Xóa role thành công!',
        })
    } catch (error) {
        console.log(error)
        res.json({
            statusCode: 400,
            error,
            message: 'Đã xảy ra lỗi khi xóa role!',
        })
    }
}

const rolesController = {
    getRoles,
    createRole,
    updateRole,
    deleteRole,
}

export default rolesController
