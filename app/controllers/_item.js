var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Board = mongoose.model('Board'),
  socketio;


module.exports = function(app, io) {
  socketio = io;
  app.use('/api/item', router);
};

router.get('/', (req, res, next) => {
  console.log(req.body);
});
router.post('/', (req, res, next) => {
  let obj = req.body;
  obj['_id'] = new mongoose.Types.ObjectId();

  //var itemId = new mongoose.Types.ObjectId();
  Board.findByIdAndUpdate(
    obj.boardId,
    {$push: {'items': obj}},
    {safe: true, upsert: true, new : true},
    (err, board) => {
      if (err) return next(err);
      socketio.emit('BOARD_ITEM_ADDED', obj);
    }
  );
  console.log(req.body);
});
router.put('/', (req, res, next) => {
  console.log(req.body);
});
