var express = require('express');
var path = require('path');
var router = express.Router();

//Render: for pug files
//SendFile: for html

/* GET home page. */
router.get('/', function(req, res, next) 
{
  // res.render('index.pug', { title: "Where'sYaBoi" });
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

router.get('/tokyo', function(req, res, next) 
{
  // res.render('tokyo.pug', { title: "Where'sYaBoi" });
  //simple send the html
  res.sendFile(path.join(__dirname, '../views/tokyo.html'));
});

router.get('/all-locations', function(req, res, next) 
{
  res.sendFile(path.join(__dirname, '../views/all-locations.html'));
  // res.render('all-locations.pug', { title: "Where'sYaBoi" });
});

module.exports = router;
