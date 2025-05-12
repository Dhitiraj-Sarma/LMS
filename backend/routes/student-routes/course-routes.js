import express from "express";

import {
  getAllCourses,
  getAllCourseDetails,
} from "../../controllers/student-controller.js";
import {
  authenticate,
  checkStudentRole,
} from "../../middleware/auth-middleware.js";

const router = express.Router();

router.use(authenticate);
router.use(checkStudentRole);

router.get("/get", getAllCourses);
router.get("/get/details/:id", getAllCourseDetails);

export default router;
