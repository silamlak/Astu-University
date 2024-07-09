import express from 'express'
import { addDepartment, addDepartmentOfficer, logout, refresh, signin } from '../controllers/collegeController.js'
const router = express.Router()

router.post('/sign_in', signin)
router.get('/refresh', refresh)
router.post('/logout', logout)
router.post('/add/department', addDepartment)
router.post('/add/department_officer', addDepartmentOfficer)

export default router