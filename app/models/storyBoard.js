// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var StoryBoardSchema = new Schema({
  title: String,
  description: String,
  boards: [],
  history: []
});

StoryBoardSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('StoryBoard', StoryBoardSchema);
