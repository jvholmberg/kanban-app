var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Board = mongoose.model('Board'),
  socketio;


module.exports = function(app, io) {
  app.use('/api/board', router);
  socketio = io;
};

router.get('/', (req, res, next) => {
  Board.find((err, boards) => {
    if (err) return next(err);
    return res.status(200).json(boards);
  });
});
router.post('/', (req, res, next) => {
  Board.create(req.body, (err, board) => {
    if (err) return next(err);

    // Board was created successfully
    Board.findById(board._id, (err, board) => {
      if (err) return next(err);
      socketio.emit('BOARD_ADDED', board);
    });
  });
});
router.post('/', (req, res, next) => {
  // Board was created successfully

  console.log(res);



  // Board.findByIdAndUpdate(
  //       info._id,
  //       {$push: {"messages": {title: title, msg: msg}}},
  //       {safe: true, upsert: true, new : true},
  //       function(err, model) {
  //           console.log(err);
  //       }
  //   );
  //
  //   find((err, boards) => {
  //   if (err) return next(err);
  //
  //
  //   // Use socket.io to push changes to user
  //   socketio.emit('BOARD_ITEM_ADDED', boards);
  // });
});
