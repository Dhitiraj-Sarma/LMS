import express from "express";

import {
  getAllCourses,
  getAllCourseDetails,
} from "../../controllers/student-controller.js";

const router = express.Router();

router.get("/get", getAllCourses);
router.get("/get/details/:id", getAllCourseDetails);

export default router;
