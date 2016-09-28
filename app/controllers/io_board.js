var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Board = mongoose.model('Board');//,
  //socketio;

/*
  {
    _story: 'Some id'
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
  */
  io.on('CREATE_BOARD', (data) => {
    Board.create(data.data, (err, board) => {
      if (err) return next(err);
      io.emit('CREATE_BOARD', board);
    });
  });
  /*
  * Update an existing boards information and then transmit
  * changes to all users in realtime.
  */
  io.on('UPDATE_BOARD', (data) => {
    Board.findByIdAndUpdate(
      data.data._id,
      {$set: {'title': data.data.title}},
      {$set: {'description': data.data.description}},
      {$push: {'history': data.comment}},
      {safe: true, upsert: true, new : true},
      (err, board) => {
        if (err) return next(err);
        io.emit('UPDATE_BOARD', board);
    });
  });
  /*
  * Remove an existing board and transmit changes
  * to all users in realtime.
  */
  io.on('REMOVE_BOARD', (data) => {
    // TODO: This should not immediatly remove doc but instead move it to trash.
    Board.remove({_id: data.data._id }, (err) => {
      if (err) return next(err);
      io.emit('REMOVE_BOARD', { _id: data.data._id });
    });
  });
};
