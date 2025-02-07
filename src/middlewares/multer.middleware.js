import multer from 'multer'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public")
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname); // Add unique prefix to the filename
    }
})


export const upload = multer({
    storage,
    limits:{
        fileSize:1024*1024*5
    }
})


export const uploadImages = upload.array('images',5);

