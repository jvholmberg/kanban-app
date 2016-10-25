
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  _user: Schema.Types.ObjectId,
  participates: [Schema.Types.ObjectId],
  username: String,
  password: String
});

UserSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('User', UserSchema);
