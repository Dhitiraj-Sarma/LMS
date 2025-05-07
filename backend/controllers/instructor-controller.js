import Course from "../models/Course.js";

export const addNewCourse = async (req, res) => {
  try {
    const courseData = {
      ...req.body,
      instructorId: req.user._id,
      instructorName: req.user.userName,
    };
    const newlyCreatedCourse = new Course(courseData);

    const saveCourse = await newlyCreatedCourse.save();
    if (saveCourse) {
      res.status(200).json({
        success: true,
        message: "Course created successfully",
        data: saveCourse,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Some Error in add New Course Controller",
    });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courseList = await Course.find({ instructorId: req.user._id });

    res.status(200).json({
      success: true,
      data: courseList,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Some Error in get all courses Controller",
    });
  }
};

export const getCourseDetailsById = async (req, res) => {
  try {
    const { id } = req.params;

    const courseDetails = await Course.findOne({
      _id: id,
      instructorId: req.user._id,
    });

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found or unauthorized access",
      });
    }

    res.status(200).json({
      success: true,
      data: courseDetails,
    });
  } catch (error) {
    console.error("Course Details Error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error fetching course details",
    });
  }
};

export const updateCourseByID = async (req, res) => {
  try {
    const { id } = req.params;
    const courseData = req.body;

    delete courseData.instructorId;
    delete courseData.instructorName;

    const updatedCourse = await Course.findByIdAndUpdate(
      { _id: id, instructorId: req.user._id },
      courseData,
      {
        new: true,
      }
    );

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error("Update Course Error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error updating course",
      error: error.message,
    });
  }
};
