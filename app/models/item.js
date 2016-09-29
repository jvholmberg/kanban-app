// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ItemSchema = new Schema({
  _story: String,
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
  }],
  comments: [{
    _id : String,
    _user: String,
    text: String,
    timestamp: { type: Date, default: Date.now }
  }]
});

ItemSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Item', ItemSchema);
