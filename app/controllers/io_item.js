var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Board = mongoose.model('Board'),
  socketio;

  /*
    {
      _board: 'Some id'
      user: 'admin@example.org',
      data: {},
      comment: 'This is a comment'
    }
  */

// TODO: remove app as input since all communications is going through socket.io
module.exports = function(app, io) {
  /*
  * Create a new board for story and when created transmit
  * new board to all users in realtime.
  *
  * @InParams: {_board, title, description}
  * @OutParams: {_id, _board, title, description, comments, history}
  */
  io.on('CREATE_IITEM', (data) => {
    data['_id'] = new mongoose.Types.ObjectId();

    Board.findByIdAndUpdate(
      data._board,
      {$push: {'items': data}},
      {safe: true, upsert: true, new : true},
      (err, board) => {
        if (err) return next(err);
        io.emit('UPDATE_ITEM', data);
    });
  });
  /*
  * Update an existing boards information and then transmit
  * changes to all users in realtime.
  *
  * @InParams: {_id, _board, title, description}
  * @InParams: {_id, _board, title, description, comment}
  * @InParams: {_id, _board, title, description, comment}
  * @OutParams: {_id, _board, title, description, comments, history}
  */
  io.on('UPDATE_ITEM', (data) => {
    Board.findOneAndUpdate(
      { 'items._id': data._id },
      { '$set': { 'items.$._board': data._board,
                  'items.$.title': data.title,
                  'items.$.description': data.description } },
      { '$push': { 'items.comments': data. } }
    );

    Board.findByIdAndUpdate(
      data._board,
      {$set: {'items': data.data.title}},
      {$set: {'description': data.data.description}},
      {$push: {'history': data.comment}},
      {safe: true, upsert: true, new : true},
      (err, board) => {
        if (err) return next(err);
        io.emit('UPDATE_ITEM', board);
    });
  });
  /*
  * Remove an existing board and transmit changes
  * to all users in realtime.
  */
  io.on('REMOVE_ITEM', (data) => {
    // TODO: This should not immediatly remove doc but instead move it to trash.
    Board.remove({_id: data.data._id }, (err) => {
      if (err) return next(err);
      io.emit('REMOVE_ITEM', { _id: data.data._id });
    });
  });
};





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
