const md5 = require("md5");
const AWS = require("aws-sdk");
const bluebird = require("bluebird");

require("dotenv").config();
AWS.config.update({
  accessKeyId: "AKIAYSIOZSV5ISG7Q47K",
  secretAccessKey: "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",
  region: "ap-southeast-1",
});
AWS.config.setPromisesDependency(bluebird);
const s3 = new AWS.S3();

module.exports = {
  gravatar: (email) => {
    const hashed = md5(email);
    return `https://www.gravatar.com/avatar/${hashed}.jpg?d=identicon`;
  },
  // Upload image stream to S3 bucket with the given path.
  // Returns the image web address.
  uploadImage: async (image, path) => {
    try {
      const params = {
        Body: image,
        Bucket: "my-diet",
        Key: path,
        ContentType: `image/${path.split(".").pop()}`,
      };
      return await (
        await s3.upload(params).promise()
      ).Location;
    } catch (error) {
      return error;
    }
  },
};
