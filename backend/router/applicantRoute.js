import express from 'express'
import { applyTransfer, checkTransfer } from '../controllers/applicantController.js'
const router = express.Router()

router.post('/apply', applyTransfer)
router.get('/check', checkTransfer)

export default router