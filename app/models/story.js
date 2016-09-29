// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var StorySchema = new Schema({
  _owner: String,
  title: String,
  text: String,
  users: [{
    _user: String,
    permission: String
  }],
  history: [{
    _id: String,
    _user: String,
    action: String,
    text: String,
    timestamp: { type: Date, default: Date.now }
  }]
});

StorySchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Story', StorySchema);
