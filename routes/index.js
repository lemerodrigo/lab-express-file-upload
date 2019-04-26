const express = require('express');

const router = express.Router();
const Picture = require('../models/Picture');
const uploadCloud = require('../config/cloudinary.js');

router.get('/map', (req, res) => {
  res.render('map');
});

router.get('/', (req, res) => {
  Picture.find((err, pictures) => {
    res.render('index', { pictures });
  });
});

router.post('/upload', uploadCloud.single('photo'), (req, res, next) => {
  const imgPath = req.file.url;
  const imgName = req.file.originalname;

  const pic = new Picture({
    name: req.body.pictureName,
    path: imgPath,
    originalName: imgName,
  });

  pic.save((err) => {
    res.redirect('/');
  });
});

module.exports = router;
