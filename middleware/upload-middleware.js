const multer = require('multer');
const path = require('path');

// set our multer storage
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"uploads/")
    },
    filename: function(req,file,cb){
        cb(null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        )
    }
});

// file filter function
const checkFileFilter = (req,file,cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null, true);
    }else{
        cb(new Error('Not an image! Please upload only images'));
    }
}
/*
A MIME type (short for Multipurpose Internet Mail Extensions type, and now often referred to as media type or content type) is essentially a standardized label or identifier that indicates the nature and format of a file or a piece of data.
e.g.
text/plain: A plain text file.

text/html: An HTML web page.

image/jpeg: A JPEG image file.

image/png: A PNG image file.


*/

//multer middleware
module.exports = multer({
    storage: storage,
    filefilter: checkFileFilter,
    limit: {
        fileSize: 5*1024*1024 //5MB(5 Mega Bytes) file size limit we set
    }
})
