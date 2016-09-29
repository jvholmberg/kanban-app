var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Item = mongoose.model('Item');

module.exports = function(app, io) {
  /*
  * Create a new Comment for item and emit
  * new comment to all users in realtime.
  *
  * @InParams: {_item, _user, text}
  * @OutParams: {_board, _item, _user, text}
  */
  io.on('CREATE_COMMENT', (data) => {
    // Create _id for comment
    data['_id'] = new mongoose.Types.ObjectId();
    // Set variable to value of _item and remove from data object
    let _item = data._item;
    delete data['_item'];
    // Create history
    let history = {
      _id: new mongoose.Types.ObjectId(),
      _user: data._user,
      action: 'CREATE_COMMENT',
    };
    // Find item and append comment to it
    Item.findByIdAndUpdate(
      _item,
      {$push: {'history': history}},
      {$push: {'comments': data}},
      {safe: true, upsert: true, new: true},
      (err, item) => {
        if (err) return next(err);
        // Tell client which item comment corresponds to
        comment['$item'] = _item;
        io.emit('CREATE_COMMENT', comment);
    });
  });
  /*
  * Remove an existing comment and emit changes
  * to all users in realtime.
  *
  * @InParams: {_item, _user, _comment}
  * @OutParams: {_board, _item, _comment}
  */
  io.on('REMOVE_COMMENT', (data) => {
    // Create history
    let history = {
      _id: new mongoose.Types.ObjectId(),
      _user: data._user,
      action: 'REMOVE_COMMENT',
    };
    Item.findByIdAndUpdate(
      data._item,
      {$push: {'history': history}},
      {$pull: {'comments': {_id: data._comment}}},
      {safe: true, upsert: true},
      (err) => {
        if (err) return next(err);
        io.emit('REMOVE_COMMENT', data);
    });
  });
};
