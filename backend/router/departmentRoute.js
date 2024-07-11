import express from 'express'
import { applicationDetail, applicationList, applicationStatus } from '../controllers/departmentController.js';
import { jwt_verify } from '../Check_JWT/jwt_check.js';
const router = express.Router()

router.get("/application/list", applicationList);
router.get("/application/list/detail/:id", applicationDetail);
router.put("/application/list/detail/status/:id", applicationStatus);

export default router