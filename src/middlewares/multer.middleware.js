import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp');
    },
    filename: function (req, file, cb) {
        // Get the original filename without extension
        const originalNameWithoutExt = path.parse(file.originalname).name;

        // Generate a random 6-digit number
        const randomSixDigits = Math.floor(100000 + Math.random() * 900000);

        // Get the file extension
        const ext = path.extname(file.originalname);

        // Construct the filename with original name and random number
        const fileName = `${originalNameWithoutExt}_${randomSixDigits}${ext}`;

        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

export default upload;