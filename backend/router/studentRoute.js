import express from 'express'
import { checkinFilePage, checkinFileUploader, remainingPage, signup } from '../controllers/studentController.js'
const router = express.Router()

router.post('/signin', signup)
router.put('/check-in', checkinFileUploader)
router.post('/check-in/page', checkinFilePage)
router.post('/remain/page', remainingPage)

export default router