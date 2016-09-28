// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var StorySchema = new Schema({
  _owner: String,
  users: [{
    _user: String,
    permission: String
  }],
  history: [{

  }]
});

StorySchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Story', StorySchema);
