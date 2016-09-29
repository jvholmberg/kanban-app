'use strict';

(() => {

  let socketio = io();
  let contentWrapper = document.getElementsByClassName('content_wrapper')[0];

  // function renderItem(item) {
  //   let boardElement = document.getElementById(item.boardId);
  //   let itemElement = document.getElementById(item._id);
  //   if(itemElement !== null) {
  //     itemElement.firstChild.innerHtml = item.title;
  //     itemElement.lastChild.innerHtml = item.description;
  //   } else {
  //     itemElement = '<span id="'+item._id+'" class="board_workplace_item"><h6>'+item.title+'</h6><p>'+item.description+'</p></span>';
  //     appendTextAsHtml(boardElement, itemElement);
  //   }
  // }
  // function renderBoard(board) {
  //   let boardElement = document.getElementById(board._id);
  //   if(boardElement !== null) {
  //     // TODO: Add support for updating existing board
  //   } else {
  //     boardElement = '<div id="'+board._id+'" class="board_body"><div class="board_header"><h3 class="board_title">'+board.title+'</h3><p class="board_description">'+board.description+'</p><span class="add_new_board_item">Add item</span></div><div class="board_workplace"></div></div>';
  //     appendTextAsHtml(contentWrapper, boardElement);
  //   }
  // }
  // function addItemToBoard() {
  //   let boardId = this.parentNode.parentNode.id;
  //   xhr('/api/item')
  //     .post(JSON.stringify({
  //       boardId: boardId,
  //       title: defaultItem.title,
  //       description: defaultItem.description
  //     }), DEFAULT_HEADERS).then((data) => {
  //       alertService('Item added');
  //     }).catch(errorHandler);
  // }
  //
  // function updateItemPosition(e) {
  //   console.log(e.from.parentNode.id);
  //   console.log(e.to.parentNode.id);
  //   // xhr('/api/item')
  //   //   .put(JSON.stringify(defaultBoard), DEFAULT_HEADERS)
  //   //   .then((data) => {
  //   //     alertService('Board added');
  //   //   }).catch(errorHandler);
  // }





  function createBoard() {
    console.log('createBoard');
    socketio.emit('CREATE_BOARD', {
      _story: 'Story',
      _owner: 'Owner',
      title: 'title',
      text: 'text'
    });
  }
  function updateBoard() {
    socketio.emit('UPDATE_BOARD', {
      _board: 'Story',
      title: 'title',
      text: 'text'
    });
  }
  function removeBoard() {
    socketio.emit('REMOVE_BOARD', {
      _board: 'Story',
    });
  }
  function bindEvents() {
    let createBoardBtn = document.getElementsByClassName('createBoard')[0],
        createItemBtns = document.getElementsByClassName('createItem'),
        workPlaceBoards = document.getElementsByClassName('board_workplace');

    // Replace event-handlers to prevent memoryleak
    core.removeEventListener(createBoardBtn, 'click', createBoard);
    core.addEventListener(createBoardBtn, 'click', createBoard);
    Array.from(createItemBtns).forEach((el) => {
      core.removeEventListener(el, 'click', createItem);
      core.addEventListener(el, 'click', createItem);
    });

    // Make items draggable
    Sortable.create(contentWrapper, {
      animation: 150,
      draggable: '.board_body',
      handle: '.board_header'
    });
    Array.from(workPlaceBoards).forEach(function(el) {
      Sortable.create(el, {
        group: 'foobar',
  			animation: 150,
        onAdd: updateItemPosition
      });
    });
  }
  function bindReceivers() {
    socketio.on('CREATE_BOARD', (data) => {

    });
    socketio.on('UPDATE_BOARD', (data) => {

    });
    socketio.on('REMOVE_BOARD', (data) => {

    });
  }
  function errorHandler(msg) {
    console.log(msg);
  }
  bindReceivers();
  bindEvents();

})();
