'use strict';

(() => {

  let socketio = io();

  let wrapper = document.getElementById('wrapper');

  story(socketio, null).init('57eea6a54c34702776e5a638');
  board(socketio, wrapper).init();
  item(socketio, wrapper).init();

  socketio.on('ERROR', core.alertService);


})();
