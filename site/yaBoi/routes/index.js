var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.pug', { title: "Where'sYaBoi" });
});

router.get('/tokyo', function(req, res, next) {
  res.render('tokyo.pug', { title: "Where'sYaBoi" });
});

router.get('/all-locations', function(req, res, next) {
  res.render('all-locations.pug', { title: "Where'sYaBoi" });
});

module.exports = router;
