import express from 'express'
import { checkinFileUploader, signup } from '../controllers/studentController.js'
const router = express.Router()

router.post('/signin', signup)
router.put('/check-in', checkinFileUploader)

export default router