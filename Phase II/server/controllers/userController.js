const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const User = require('../models/User');

const bucketName = 'chit-chat-website-images'
const bucketRegion = 'us-east-1';

const s3 = new aws.S3({
    accessKeyId: "AKIA5IQUIWIGKRA5DD5L",
    secretAccessKey: "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",
    region: bucketRegion,
});

const upload = (bucketName) =>
  multer({
    storage: multerS3({
      s3,
      bucket: bucketName,
      acl: 'public-read',
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}.jpeg`);
      },
    }),
  });

exports.setProfilePic = (req, res) => {
    const uploadeSingleImage = upload(bucketName).single('croppedImage');

    uploadeSingleImage(req, res, async(err) => {
        if(err) return res.status(400).json({ success: false, message: err.message });

        const imageUrl = req.file.location;
        const userId = req.body.userID;

        try {
            // Update the user's profilePictureUrl in MongoDB
            await User.findByIdAndUpdate(userId, { profilePictureUrl: imageUrl });

            res.status(200).json({ success: true, message: 'Profile picture updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    });
}