const Image = require("../models/Image");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");

const { uploadToCloudinary } = require("../helpers/cloudinaryHelper"); //This is JavaScript syntax of a destructuring assignment used with require() to import a specific function (or property) from a module.
/*const {uploadToCloudinary}:
This is the destructuring assignment part.
It's saying: "From the object that require('../helpers/cloudinaryHelper') returns, find a property (or key) named uploadToCloudinary and assign its value to a new constant variable also named uploadToCloudinary."

In simpler terms, it's a shortcut for:

const cloudinaryHelper = require('../helpers/cloudinaryHelper');
const uploadToCloudinary = cloudinaryHelper.uploadToCloudinary;
*/

const uploadImageController = async (req, res) => {
  try {
    //check if file is missing in req object
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "File is required. Please upload an image",
      });
    }

    // upload to cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);

    // store the image url and publicId along with the uploaded user id in database
    const newlyUploadedImage = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });
    await newlyUploadedImage.save();

    //delete the file from local stroage
    // fs.unlinkSync(req.file.path); // file will save in database but will not save in local storage(i.e. upload folder)

    res.status(201).json({
      success: true,
      messsage: "image uploaded successfully",
      image: newlyUploadedImage,
    });
    /*o/p on postman
    {
      "success": true,
      "messsage": "image uploaded successfully",
      "image": {
          "url": "https://res.cloudinary.com/dvginlv5x/image/upload/v1752516019/q4pa6lbrdfdagp6srnjt.png",
          "publicId": "q4pa6lbrdfdagp6srnjt",
          "uploadedBy": "686193b5c8aa93ea594452e2",
          "_id": "687545b7a043b4141ce701d9",
          "createdAt": "2025-07-14T18:00:23.264Z",
          "updatedAt": "2025-07-14T18:00:23.264Z",
          "__v": 0
      }
  }
      */

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
};

const fetchImageController = async (req, res) => {
  try {
    //soring and pagination
    console.log(req.query.page);
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skip = (page-1)*limit;

    const sortBy = req.query.sortBy || 'createdAt';
    
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    console.log(req.query.sortOrder);//my //
    console.log(sortOrder);//my //
    
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages/limit);

    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

    if (images) {
      res.status(200).json({
        success: true,
        currentPage: page,
        totalPage: totalPages,
        totalImages: totalImages,
        data: images,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "some error occured in fetchImageController! please try again",
    });
  }
};

const deleteImageByID = async (req, res) => {
  try {
    const getCurrentIdOfImageToBeDeleted = req.params.id;
    const userId = req.userInfo.userId;
    const image = await Image.findById(getCurrentIdOfImageToBeDeleted);

    if (!image) {
      return res.status(404).json({
        success: true,
        message: "Image not found",
      });
    }

    //check if this image is uploaded by the current user who is trying to delete this image
    console.log(image.uploadedBy);
    console.log(image.uploadedBy.toString());
    console.log(userId);
    
    if (image.uploadedBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to delete this image because you haven't uploaded it",
      });
    }

    //delete this image first from your cloudinary storage
    await cloudinary.uploader.destroy(getCurrentIdOfImageToBeDeleted);

    //delete this image from mongodb database
    await Image.findByIdAndDelete(getCurrentIdOfImageToBeDeleted);

    res.status(200).json({
      success: true,
      messsage: "Image deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "some error occured in deleteImageById! please try again",
    });
  }
};

module.exports = {
  uploadImageController,
  fetchImageController,
  deleteImageByID
};
