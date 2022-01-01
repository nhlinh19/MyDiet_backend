const md5 = require('md5');
const AWS = require('aws-sdk');
const bluebird = require('bluebird');

require('dotenv').config();
AWS.config.update(
    {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.ASW_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    }
);
AWS.config.setPromisesDependency(bluebird);
const s3 = new AWS.S3();

module.exports = {
    gravatar: email => {
        const hashed = md5(email);
        return `https://www.gravatar.com/avatar/${hashed}.jpg?d=identicon`;
    },
    // Upload image stream to S3 bucket with the given path.
    // Returns the image web address.
    uploadImage: async (image, path) => {
        try {
            const params = {
                Body: image,
                Bucket: process.env.BUCKET_NAME,
                Key: path,
                ContentType: `image/${path.split('.').pop()}`
            };
            return await (await s3.upload(params).promise()).Location;
        }
        catch (error) {
            return '';
        }
    }
}