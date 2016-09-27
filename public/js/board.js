'use strict';

(() => {

  let socket = io();
  let contentWrapper = document.getElementsByClassName('content_wrapper')[0];

  // This is default board that gets created
  const defaultBoard = {
    title: 'New Board',
    description: 'This is a descriptive text'
  };
  const defaultItem = {
    boardId: null,
    title: 'New Item',
    description: 'Description of item'
  };

  function errorHandler(err) {
    console.log(err);
  }
  function init() {
    // Fetch all boards from api and group them
    xhr('/api/board')
      .get(null, DEFAULT_HEADERS)
      .then((data) => {
        bindEvents();
      }).catch(errorHandler);
  }
  function bindEvents() {

    let addBoardBtn = document.getElementsByClassName('add_new_board')[0];
    let addItemBtns = document.getElementsByClassName('add_new_board_item');
    let workPlaceBoards = document.getElementsByClassName('board_workplace')

    // Remove existing event-handlers to prevent memory leak and readd them
    removeEvListener(addBoardBtn, 'click', addNewBoard);
    addEvListener(addBoardBtn, 'click', addNewBoard);
    Array.from(addItemBtns).forEach(function(el) {
      removeEvListener(el, 'click', addItemToBoard);
      addEvListener(el, 'click', addItemToBoard);
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
  function renderItem(item) {
    let boardElement = document.getElementById(item.boardId);
    let itemElement = document.getElementById(item._id);
    if(itemElement !== null) {
      itemElement.firstChild.innerHtml = item.title;
      itemElement.lastChild.innerHtml = item.description;
    } else {
      itemElement = '<span id="'+item._id+'" class="board_workplace_item"><h6>'+item.title+'</h6><p>'+item.description+'</p></span>';
      appendTextAsHtml(boardElement, itemElement);
    }
  }
  function renderBoard(board) {
    let boardElement = document.getElementById(board._id);
    if(boardElement !== null) {
      // TODO: Add support for updating existing board
    } else {
      boardElement = '<div id="'+board._id+'" class="board_body"><div class="board_header"><h3 class="board_title">'+board.title+'</h3><p class="board_description">'+board.description+'</p><span class="add_new_board_item">Add item</span></div><div class="board_workplace"></div></div>';
      appendTextAsHtml(contentWrapper, boardElement);
    }
  }
  function addItemToBoard() {
    let boardId = this.parentNode.parentNode.id;
    xhr('/api/item')
      .post(JSON.stringify({
        boardId: boardId,
        title: defaultItem.title,
        description: defaultItem.description
      }), DEFAULT_HEADERS).then((data) => {
        alertService('Item added');
      }).catch(errorHandler);
  }
  function addNewBoard() {
    xhr('/api/board')
      .post(JSON.stringify(defaultBoard), DEFAULT_HEADERS)
      .then((data) => {
        alertService('Board added');
      }).catch(errorHandler);
  }
  function updateItemPosition(e) {
    console.log(e.from.parentNode.id);
    console.log(e.to.parentNode.id);
    // xhr('/api/item')
    //   .put(JSON.stringify(defaultBoard), DEFAULT_HEADERS)
    //   .then((data) => {
    //     alertService('Board added');
    //   }).catch(errorHandler);
  }

  // Socket.io Events
  socket.on('BOARD_ADDED', function(board){
    renderBoard(board);
    bindEvents();
  });
  socket.on('BOARD_ITEM_ADDED', function(item){
    renderItem(item);
    bindEvents();
  });

  init();
})();
