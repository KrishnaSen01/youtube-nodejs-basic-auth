const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = async(filePath)=> {
    try {
        const result = await cloudinary.uploader.upload(filePath);
        return {
            url: result.secure_url,
            publicId: result.public_id
        };
    } catch (error) {
        console.error('Error while uploading a cloudinary', error);
        throw new Error('Error while uploading a cloudinary');
    }
}

module.exports = {uploadToCloudinary};// this is a shorthand for { uploadToCloudinary: uploadToCloudinary } // if uploadToCloudinary is a variable or a function reference