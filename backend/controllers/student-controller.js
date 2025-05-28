import Course from "../models/Course.js";

export const getAllCourses = async (req, res) => {
  try {
    // extract filters/sort from query
    const {
      category = "",
      level = "",
      primaryLanguage = "",
      sortBy = "price-lowtohigh",
      page = "1",
      limit = "10",
    } = req.query;

    // build mongoose filters
    const filters = {};
    if (category) {
      filters.category = { $in: category.split(",") };
    }
    if (level) {
      filters.level = { $in: level.split(",") };
    }
    if (primaryLanguage) {
      filters.primaryLanguage = { $in: primaryLanguage.split(",") };
    }

    // build sort object
    let sort = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sort.pricing = 1;
        break;
      case "price-hightolow":
        sort.pricing = -1;
        break;
      case "title-atoz":
        sort.title = 1;
        break;
      case "title-ztoa":
        sort.title = -1;
        break;
      default:
        sort.pricing = 1;
    }

    // parse pagination params
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const perPage = Math.max(1, parseInt(limit, 10) || 10);
    const skip = (pageNum - 1) * perPage;

    // count total matching docs
    const total = await Course.countDocuments(filters);

    // fetch paginated data
    const courseList = await Course.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(perPage);

    // build pagination info
    const totalPages = Math.ceil(total / perPage);

    res.status(200).json({
      success: true,
      data: courseList,
      pagination: {
        total, // total matched documents
        page: pageNum,
        limit: perPage,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    console.error("getAllCourses error:", error);
    res.status(500).json({
      success: false,
      message: "Error occurred in getAllCourses controller",
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
