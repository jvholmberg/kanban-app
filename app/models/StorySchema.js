// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var StorySchema = new Schema({
  _owner: Schema.Types.ObjectId,
  title: String,
  text: String,
  participants: [{
    _user: Schema.Types.ObjectId,
    permission: String
  }],
  boards: [Schema.Types.ObjectId],
  history: [{
    _id: Schema.Types.ObjectId,
    _user: Schema.Types.ObjectId,
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
