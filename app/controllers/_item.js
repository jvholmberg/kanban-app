var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Board = mongoose.model('Board'),
  Item = mongoose.model('Item');

module.exports = function(app, io) {
  /*
  * Create a new item for story and emit
  * new item to all users in realtime.
  *
  * @InParams: {_story, _owner, title, text}
  * @OutParams: {_board, _item, title, text, history}
  */
  io.on('CREATE_ITEM', (data) => {
    // Create history for item
    let history = {
      _id: new mongoose.Types.ObjectId(),
      _user: data._user,
      action: 'CREATE_ITEM'
    };
    data['history'] = [history];
    Item.create(data, (err, item) => {
      if (err) return next(err);
      io.emit('CREATE_ITEM', item);
    });
  });
  /*
  * Update an existing boards information and then transmit
  * changes to all users in realtime.
  *
  * @InParams: {_item, title, text}
  * @OutParams: {_item, title, text, history}
  */
  io.on('UPDATE_ITEM', (data) => {
    // Create history for item
    let history = {
      _id: new mongoose.Types.ObjectId(),
      _user: data._user,
      action: 'UPDATE_ITEM'
    };
    Item.findByIdAndUpdate(
      data._item,
      {$set:{ title: data.title,
              text: data.text},
      {$push: {history: history}},
      {safe: true, upsert: true},
      (err, item) => {
        if (err) return next(err);
        io.emit('UPDATE_ITEM', item);
      });
    );
  });
  /*
  * Remove an existing board and transmit changes
  * to all users in realtime.
  *
  * @InParams: {_item}
  * @OutParams: {_item}
  */
  io.on('REMOVE_ITEM', (data) => {
    // TODO: This should not immediatly remove doc but instead move it to trash.
    Item.remove({_id: data._item }, (err) => {
      if (err) return next(err);
      Board.findOne({'items': {'items.$._id': data._item}},
        (board) => {
          if (err) return next(err);
          io.emit('REMOVE_ITEM', {
            _board: board._id,
            _item: data._item
          });
        });
    });
  });
};
