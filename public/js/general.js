'use strict';

(() => {

  let socketio = io();

  let wrapper = document.getElementById('wrapper');

  story(socketio, null).init('57f56f15322464451f8dfd2d');
  // board(socketio, wrapper).init();
  // item(socketio, wrapper).init();

  socketio.on('ERROR', core.alertService);


})();
