import Course from "../models/Course.js";

export const getAllCourses = async (req, res) => {
  try {
    const courseList = await Course.find({});

    if (courseList.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Course Found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      data: courseList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error Occured in getAllStudentCourses Controller",
    });
  }
};

export const getAllCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const courseDetails = await Course.findById(id);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "No Course details Found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      data: courseDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error Occured in getAllStudentCourses Controller",
    });
  }
};
