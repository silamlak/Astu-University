import express from 'express'
const router = express.Router()

router.post('/signin', signin)

export default router