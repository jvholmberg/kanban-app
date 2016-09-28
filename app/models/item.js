// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ItemSchema = new Schema({
  _story: String,
  _owner: String
  users: [{
    _user: String,
    permission: String,
    history: [{

    }]
  }],
  items: [{
    _id : String,
    _board: String,
    title: String,
    description: String,
    comments: [],
    history: []
  }]
});

ItemSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Item', ItemSchema);
