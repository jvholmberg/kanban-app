'use strict';

function board(socketio, wrapper, data) {

  let self = {
    init: () => {
      self.bindReceivers();
      self.bindEvents();
    },
    emitCreateBoard: () => {
      console.log('CREATE_BOARD');
      socketio.emit('CREATE_BOARD', {
        _story: '57eea6a54c34702776e5a638',
        _owner: '_owner',
        title: 'title',
        text: 'text'
      });
    },
    emitUpdateBoard: () => {
      socketio.emit('UPDATE_BOARD', {
        _board: '_board',
        title: 'title',
        text: 'text'
      });
    },
    emitRemoveBoard: () => {
      socketio.emit('REMOVE_BOARD', {
        _board: '_board',
      });
    },

    createBoard: (data) => {
      let html =
      '<div id="'+data._board+'" class="board">'+
        '<div class="boardHeader">'+
          '<h6>'+data.title+'</h6>'+
          '<p>'+data.text+'</p>'+
          '<span class="createItem">New item</span>'+
        '</div>'+
        '<div class="boardItems">'+

        '</div>'+
      '</div>';
      core.appendTextAsHtml(wrapper, html);

      // let el = document.getElementsByClassName('#'+data._board+'.createItem');
      // core.addEventListener(el, 'click', )
    },
    updateBoard: (data) => {
      console.log(data);
    },
    removeBoard: (data) => {
      console.log(data);
    },

    bindEvents: () => {
      let createBoardBtn = document.getElementsByClassName('createBoard')[0],
          createItemBtns = document.getElementsByClassName('createItem'),
          workPlaceBoards = document.getElementsByClassName('board_workplace');

      // Replace event-handlers tself.o prevent memoryleak
      core.removeEventListener(createBoardBtn, 'click', self.emitCreateBoard);
      core.addEventListener(createBoardBtn, 'click', self.emitCreateBoard);
      // Array.from(createItemBtns).forEach((el) => {
      //   self.removeEventListener(el, 'click', self.createItem);
      //   self.addEventListener(el, 'click', self.createItem);
      // });
      //
      // // Make items draggable
      // Sortable.create(contentWrapper, {
      //   animation: 150,
      //   draggable: '.board_body',
      //   handle: '.board_header'
      // });
      // Array.from(workPlaceBoards).forEach(function(el) {
      //   Sortable.create(el, {
      //     group: 'foobar',
    	// 		animation: 150,
      //     onAdd: updateItemPosition
      //   });
      // });
    },
    bindReceivers: () => {
      socketio.on('CREATE_BOARD', self.createBoard);
      socketio.on('UPDATE_BOARD', self.updateBoard);
      socketio.on('REMOVE_BOARD', self.removeBoard);
    }
  };

  return {
    init: self.init,
    create: self.emitCreateBoard,
    update: self.emitUpdateBoard,
    remove: self.emitRemoveBoard
  };
}
