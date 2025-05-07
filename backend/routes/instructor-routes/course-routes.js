import express from "express";
import {
  addNewCourse,
  getAllCourses,
  getCourseDetailsById,
  updateCourseByID,
} from "../../controllers/instructor-controller.js";
import {
  authenticate,
  checkInstructorRole,
} from "../../middleware/auth-middleware.js";

const router = express.Router();

router.use(authenticate);
router.use(checkInstructorRole);

router.post("/add", addNewCourse);
router.get("/get", getAllCourses);
router.get("/get/details/:id", getCourseDetailsById);
router.put("/update/:id", updateCourseByID);

export default router;
