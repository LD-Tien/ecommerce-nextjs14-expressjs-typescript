import { NextFunction, Request, Response, Router } from 'express'
import permissionService from '../services/permission.service'

export const getPermissions = async (req: Request, res: Response, next: NextFunction) => {
    console.log(`===> (ExpressJS) GET: ${req.originalUrl}`)
    try {
        let page = parseInt(req.query.page as string) || 1
        let limit = parseInt(req.query.limit as string) || 5
        if (page < 0) page = 1
        if (limit < 5) limit = 5
        const offset = (page - 1) * limit
        const result = await permissionService.getPermissions(offset, limit)
        return res.status(200).json({
            statusCode: 200,
            data: {
                meta: {
                    current: page,
                    pageSize: limit,
                    total: result.totalPermissions,
                },
                result: result.permissions,
            },
        })
    } catch (error: any) {
        console.log(error)
        return res.status(400).json({
            statusCode: 400,
            error: error.message,
            message: 'Đã xảy ra lỗi khi lấy danh sách permission!',
        })
    }
}

export const getAllPermissions = async (req: Request, res: Response, next: NextFunction) => {
    console.log(`===> (ExpressJS) GET: ${req.originalUrl}`)
    try {
        const result = await permissionService.getAllPermissions()
        return res.status(200).json({
            statusCode: 200,
            data: result,
        })
    } catch (error: any) {
        console.log(error)
        return res.status(400).json({
            statusCode: 400,
            error: error.message,
            message: 'Đã xảy ra lỗi khi lấy danh sách permission!',
        })
    }
}

export const createPermission = async (req: Request, res: Response, next: NextFunction) => {
    console.log(`===> (ExpressJS) POST: ${req.originalUrl}`)
    try {
        const result = await permissionService.createPermission(req.body)
        return res.status(200).json({
            statusCode: 200,
            data: {
                permission: result,
            },
            message: 'Tạo permission thành công!',
        })
    } catch (error: any) {
        console.log(error)
        return res.status(400).json({
            statusCode: 400,
            error: error.message,
            message: 'Đã xảy ra lỗi khi tạo permission!',
        })
    }
}

export const updatePermission = async (req: Request, res: Response, next: NextFunction) => {
    console.log(`===> (ExpressJS) PUT: ${req.originalUrl}`)
    try {
        const result = await permissionService.updatePermission({
            id: parseInt(req.params.id as string),
            permission: req.body,
        })
        return res.status(200).json({
            statusCode: 200,
            data: {
                permission: result,
            },
            message: 'Cập nhật permission thành công!',
        })
    } catch (error: any) {
        console.log(error)
        return res.status(400).json({
            statusCode: 400,
            error: error.message,
            message: 'Đã xảy ra lỗi khi cập nhật permission!',
        })
    }
}

export const deletePermission = async (req: Request, res: Response, next: NextFunction) => {
    console.log(`===> (ExpressJS) DELETE: ${req.originalUrl}`)
    try {
        const permission = await permissionService.deletePermission(+req.params.id)
        res.status(200).json({
            statusCode: 200,
            data: {
                permission,
            },
            message: 'Xóa permission thành công!',
        })
    } catch (error: any) {
        console.log(error)
        res.status(400).json({
            statusCode: 400,
            error: error.message,
            message: 'Đã xảy ra lỗi khi xóa permission!',
        })
    }
}

const permissionsController = {
    getPermissions,
    getAllPermissions,
    createPermission,
    updatePermission,
    deletePermission,
}

export default permissionsController
