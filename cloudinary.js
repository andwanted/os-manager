const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'devjlsmtj',
  api_key: '294715196823732',
  api_secret: '8y4VaFZP-G0Zf0yySsm6S__IkYM'
});

module.exports = cloudinary;

