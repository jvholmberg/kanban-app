var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Story = mongoose.model('Story');

module.exports = function(app, io) {
  /*
  * Create a new story
  *
  * @InParams: {_story, _owner, title, text}
  * @OutParams: {_story, _owner, title, text, history}
  */
  io.on('CREATE_STORY', (data) => {
    // Create history for story
    data['history'] = [{
      _id: new mongoose.Types.ObjectId(),
      _user: data._owner,
      action: 'CREATE_STORY'
    }];
    Story.create(data, (err, story) => {
      if (err) return next(err);
      io.emit('CREATE_STORY', {
        _story: story._id,
        _owner: story._owner,
        title: story.title,
        text: story.text,
        history: story.history
      });
    });
  });
  /*
  * Update an existing storys information and then transmit
  * changes to all users in realtime.
  *
  * @InParams: {_story, _owner, title, text}
  * @OutParams: {_story, title, text, history}
  */
  io.on('UPDATE_STORY', (data) => {
    Story.findByIdAndUpdate(
      data._story,
      {$set: {title: data.title,
              text: data.text}},
      {$push: {history: {
        _id: new mongoose.Types.ObjectId(),
        _user: data._user,
        action: 'UPDATE_STORY'
      }}},
      {safe: true, upsert: true},
      (err, story) => {
        if (err) return next(err);
        io.emit('UPDATE_STORY', {
          _story: data,
          title: story.title,
          text: story.text,
          history: story.history
        });
    });
  });
  /*
  * Remove an existing story and transmit changes
  * to all users in realtime.
  *
  * @InParams: {_story}
  * @OutParams: {_story}
  */
  io.on('REMOVE_STORY', (data) => {
    Story.remove({_id: data._story }, (err) => {
      if (err) return next(err);
      io.emit('REMOVE_STORY', { _story: data._story });
    });
  });
};
