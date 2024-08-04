import express from "express";
import {
  addCollegeOfficer,
  addDepartment,
  addDepartmentOfficer,
  allDepartment,
  allDepartmentOfficer,
  applicationDetail,
  applicationList,
  applicationStatus,
  checkinFileStatus,
  createStudent,
  DepartmentDelete,
  DepartmentOfficerDelete,
  DepartmentOfficerUpdate,
  DepartmentUpdate,
  fetchapprovedUser,
  getUser,
  logout,
  refresh,
  signin,
  StudentDetail,
  studentList,
  studentRenewal,
  studentStatus,
  updateUser,
  addToArchive,
  getArchive,
  getArchiveDetail,
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
router.get("/student/:id", StudentDetail);
router.put("/application/status/:id", applicationStatus);
router.get("/application", applicationList);
router.get("/student", studentList);
router.post("/add/student", createStudent);
router.get("/list/student", fetchapprovedUser);
router.put("/student/renewal", studentRenewal);
router.put("/student/checkin/status", checkinFileStatus);
router.put("/student/status", studentStatus);

router.get("/departmet/officer", allDepartmentOfficer);
router.put("/departmet/officer/update/:id", DepartmentOfficerUpdate);
router.delete("/departmet/officer/delete/:id", DepartmentOfficerDelete);

router.get("/departmet", allDepartment);
router.put("/departmet/update/:id", DepartmentUpdate);
router.delete("/departmet/delete/:id", DepartmentDelete);

router.post("/archive/add", addToArchive);
router.get("/archive", getArchive);
router.get("/archive/:id", getArchiveDetail);


export default router;
