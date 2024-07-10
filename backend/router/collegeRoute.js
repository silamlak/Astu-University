import express from "express";
import {
  addCollegeOfficer,
  addDepartment,
  addDepartmentOfficer,
  applicationDetail,
  applicationList,
  applicationStatus,
  logout,
  refresh,
  signin,
} from "../controllers/collegeController.js";
const router = express.Router();

router.post("/sign_in", signin);
router.get("/refresh", refresh);
router.post("/logout", logout);
router.post("/add/department", addDepartment);
router.post("/add/department_officer", addDepartmentOfficer);
router.post("/add/college_officer", addCollegeOfficer);
router.get("/application/:id", applicationDetail);
router.put("/application/status/:id", applicationStatus);
router.get("/application", applicationList);

export default router;
