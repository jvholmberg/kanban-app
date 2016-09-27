var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  StoryBoard = mongoose.model('StoryBoard'),
  socketio;


module.exports = function(app, io) {
  app.use('/api/storyboard', router);
  socketio = io;
};

router.get('/', (req, res, next) => {
  // StoryBoard was created successfully
  StoryBoard.find((err, storyBoard) => {
    if (err) return next(err);
    return res.status(200).json(storyBoard);
  });
});
router.post('/', (req, res, next) => {
  StoryBoard.create(req.body, (err, small) => {
    if (err) return next(err);

    // StoryBoard was created successfully
    StoryBoard.find((err, storyBoard) => {
      if (err) return next(err);

      // Use socket.io to push changes to user
      socketio.emit('ITEM_ADDED', storyBoard);
    });
  });
});
