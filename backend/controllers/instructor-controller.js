import Course from "../models/Course.js";

export const addNewCourse = async (req, res) => {
  try {
    const courseData = req.body;
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
    const courseList = await Course.find({});

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
    const CourseDetails = await Course.findById(id);
    if (!CourseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: CourseDetails,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Some Error in get course details Controller",
    });
  }
};

export const updateCourseByID = async (req, res) => {
  try {
	const { id } = req.params;
	const courseData = req.body;

	const updatedCourse = await Course.findByIdAndUpdate(id, courseData, {
	  new: true,
	});

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
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Some Error in update course Controller",
    });
  }
};
