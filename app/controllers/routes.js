var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Story = mongoose.model('Story'),
  Board = mongoose.model('Board'),
  Item = mongoose.model('Item');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Generator-Express MVC'
  });
});

router.get('/dashboard', (req, res, next) => {
  Board.find((err, boards) => {
    if (err) return next(err);
    Item.find((err, items) => {
      if (err) return next(err);
      res.render('dashboard', {
        title: 'Dashboard',
        boards: boards,
        items: items
      });
    });
  });
});
