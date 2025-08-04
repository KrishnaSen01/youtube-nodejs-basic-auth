const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware");
const uploadMiddleware = require("../middleware/upload-middleware"); // multer middleware
const { uploadImageController, fetchImageController, deleteImageByID } = require("../controllers/image-controller");

const router = express.Router();

//upload the image
router.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
  uploadMiddleware.single("image"), // uploading a single file
  uploadImageController
);

//to get all the image
router.get('/get', authMiddleware, fetchImageController);

//delete image from database
router.delete('/delete/:id', authMiddleware, adminMiddleware, deleteImageByID);

module.exports = router;
