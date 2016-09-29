var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Story = mongoose.model('Story'),
  Board = mongoose.model('Board'),
  Item = mongoose.model('Item');

module.exports = function(app, io) {
  /*
  * Create a new board for story and when created transmit
  * new board to all users in realtime.
  *
  * @InParams: {_story, _owner, title, text}
  * @OutParams: {_board, _owner, title, text}
  */
  io.on('CREATE_BOARD', (data) => {
    // Set variable to value of _story and remove from data object
    let _story = data._story;
    delete data['_story'];
    // Create history for item
    data['history'] = [{
      _id: new mongoose.Types.ObjectId(),
      _user: data._owner,
      action: 'CREATE_BOARD'
    }];
    Board.create(data, (err, board) => {
      if (err) return next(err);
      Story.findByIdAndUpdate(_story,
        {$push: {items: board._id}},
        (err, story) => {
          if (err) return next(err);
          io.emit('CREATE_BOARD', {
            _board: board._id,
            _owner: board._owner,
            title: board.title,
            text: board.text
          });
      });
    });
  });
  /*
  * Update an existing boards information and then transmit
  * changes to all users in realtime.
  *
  * @InParams: {_board, title, text}
  * @OutParams: {_board, title, text, history}
  */
  io.on('UPDATE_BOARD', (data) => {
    Board.findByIdAndUpdate(
      data._board,
      {$set: {title: data.title,
              text: data.text}},
      {$push: {history: {
        _id: new mongoose.Types.ObjectId(),
        _user: data._user,
        action: 'UPDATE_BOARD'
      }}},
      {safe: true, upsert: true},
      (err, board) => {
        if (err) return next(err);
        io.emit('UPDATE_BOARD', {
          _board: data,
          title: board.title,
          text: board.text,
          history: board.history
        });
    });
  });
  /*
  * Remove an existing board and transmit changes
  * to all users in realtime.
  *
  * @InParams: {_board}
  * @OutParams: {_board}
  */
  io.on('REMOVE_BOARD', (data) => {
    Board.remove({_id: data._board }, (err) => {
      if (err) return next(err);
      io.emit('REMOVE_BOARD', {
        _board: data._board
      });
    });
  });
};
