var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  StoryBoard = mongoose.model('StoryBoard'),
  Board = mongoose.model('Board');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  Board.find(function (err, items) {
    if (err) return next(err);
    res.render('index', {
      title: 'Generator-Express MVC',
      item: items
    });
  });
});

router.get('/dashboard', function (req, res, next) {
  Board.find(function (err, boards) {
    if (err) return next(err);
    res.render('dashboard', {
      title: 'Dashboard',
      boards: boards
    });
  });
});
