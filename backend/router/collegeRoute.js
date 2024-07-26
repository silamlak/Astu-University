import express from "express";
import {
  addCollegeOfficer,
  addDepartment,
  addDepartmentOfficer,
  applicationDetail,
  applicationList,
  applicationStatus,
  createStudent,
  fetchapprovedUser,
  getUser,
  logout,
  refresh,
  signin,
  updateUser,
} from "../controllers/collegeController.js";
const router = express.Router();

router.post("/sign_in", signin);
router.get("/refresh", refresh);
router.get("/get/:id", getUser);
router.put("/update/:id", updateUser);
router.post("/logout", logout);
router.post("/add/department", addDepartment);
router.post("/add/department_officer", addDepartmentOfficer);
router.post("/add/college_officer", addCollegeOfficer);
router.get("/application/:id", applicationDetail);
router.put("/application/status/:id", applicationStatus);
router.get("/application", applicationList);
router.post("/add/student", createStudent);
router.get("/list/student", fetchapprovedUser);

export default router;
