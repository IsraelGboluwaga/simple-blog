const cloudinary = require('cloudinary');

module.exports = (file) => {
    const options = { folder: 'becky-api' };
    cloudinary.v2.uploader.upload(file, options, (err, result) => {
        if (err) {
            throw err;
        }

        if (!result) {
            throw 'No cloudinary response';
        }

        return result.url;
    });
}