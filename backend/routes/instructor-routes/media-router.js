import express from "express";
import multer from "multer";
import {
  uploadMediaToCloudinary,
  deleteMediaFromCloudinary,
} from "../../helpers/cloudinary.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const result = await uploadMediaToCloudinary(req.file.path);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error uploading file",
    });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Assest Id is required",
      });
    }

    await deleteMediaFromCloudinary(id);

    return res.status(200).json({
      success: true,
      message: "Assest deleted successfully from cloudinary",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error uploading file",
    });
  }
});

router.post("/bulk-upload", upload.array("files", 10), async (req, res) => {
  try {
    const uploadPromises = req.files.map((fileItem) =>
      uploadMediaToCloudinary(fileItem.path)
    );

    const result = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error Bulk uploading files",
    });
  }
});

export default router;
