var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

module.exports = function(app, io) {

  /*
  * Get users by ids
  *
  * @InParams: {_users}
  * @OutParams: [{_user, username}, ...]
  */
  io.on('GET_USERS', (data) => {
    User.find({ _id: { $in: data._users }}, (err, users) => {
      if (err) return console.log(err);

      // Make sure password is not emitted back to user
      users.forEach((user) => {
        delete user['password'];
      });
      io.emit('CREATE_STORY', users);
    });
  });

  /*
  * Update a single user
  *
  * @InParams: {_user, username, newPassword, oldPassword}
  * @OutParams: {_user, username, password}
  */
  io.on('UPDATE_USER', (data) => {
    User.findById(data._user, (err, user) => {
      if (err) return console.log(err);
      if (data.oldPassword !== user.password) return console.log('Wrong password');

      // Update fields for user
      if (data.newPassword !== data.oldPassword) user.password = data.newPassword;

      // Save changes
      user.save();
      io.emit('UPDATE_USER', user);
    });

    User.find({ _id: { $in: data._users }}, (err, users) => {
      if (err) return console.log(err);

      // Make sure password is not emitted back to user
      users.forEach((user) => {
        delete user['password'];
      });
      io.emit('CREATE_STORY', users);
    });
  });

  app.use('/api', router);
};
