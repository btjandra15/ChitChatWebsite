const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const User = require('../models/User');

// Configure AWS with access and secret key.
aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_REGIONS,
});

// Create an S3 instance that multer-s3 will use
const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'chit-chat-website-images',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      // Use the original file extension
      const fileExtension = file.originalname.split('.').pop();
      cb(null, `${file.fieldname}-${Date.now()}.${fileExtension}`);
    }
  })
});

exports.setProfilePic = (req, res) => {
  const uploadSingleImage = upload.single('profileImage'); // The field name should be 'profileImage'

  uploadSingleImage(req, res, async (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });

    const imageUrl = req.file.location;
    const userId = req.body.userID;

    try {
      await User.findByIdAndUpdate(userId, { profilePictureUrl: imageUrl });
      res.status(200).json({ success: true, message: 'Profile picture updated successfully', imageUrl });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
};

exports.setBannerImage = (req, res) => {
  const uploadBannerImage = upload.single('bannerImage'); // The field name should be 'bannerImage'

  uploadBannerImage(req, res, async (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });

    const imageUrl = req.file.location;
    const userId = req.body.userID;

    try {
      await User.findByIdAndUpdate(userId, { bannerUrl: imageUrl });
      res.status(200).json({ success: true, message: 'Banner image updated successfully', imageUrl });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
};
