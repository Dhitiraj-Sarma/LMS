import Course from "../models/Course";

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
	const courseList = await Course.find({})

	res.status(200).json({
		success: true
	})
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Some Error in get all courses Controller",
    });
  }
};

export const getCourseDetails = async (req, res) => {
  try {
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
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Some Error in update course Controller",
    });
  }
};
