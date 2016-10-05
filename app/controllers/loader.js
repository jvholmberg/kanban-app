var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Story = mongoose.model('Story'),
  Board = mongoose.model('Board'),
  Item = mongoose.model('Item');

module.exports = function(app, io) {
  app.use('/api', router);
};

/*
* Load a complete story
*/
router.get('/story/:id', (req, res, next) => {
  let id = req.params.id;

  Story.findById(id, (err, story) => {
    Board.find({
      _story: id
    }, (err, boards) => {
      if (err) return next(err);
      return res.status(200).json(boards);
    });
  });


});
