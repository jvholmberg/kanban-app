'use strict';

(() => {

  let socketio = io();


  story(socketio).init();
  board(socketio).init();

  socketio.on('ERROR', core.alertService);


})();
