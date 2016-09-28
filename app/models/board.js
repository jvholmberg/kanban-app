// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var BoardSchema = new Schema({
  title: String,
  description: String,
  items: [{
    _id : String,
    _board: String,
    title: String,
    description: String,
    comments: [],
    history: []
  }],
  history: []
});

BoardSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Board', BoardSchema);
