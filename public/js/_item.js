'use strict';

function item(socketio, wrapper) {

  let self = {
    init: () => {
      self.bindReceivers();
      self.bindEvents();
    },
    emitCreateItem: (e) => {



      socketio.emit('CREATE_ITEM', {
        _story: '57eea6a54c34702776e5a638',
        _board: e.target.parentElement.parentElement.id,
        _owner: '_owner',
        title: 'Some item',
        text: 'This is some random text'
      });
    },
    emitUpdateItem: () => {
      socketio.emit('UPDATE_ITEM', {
        _item: '_item',
        title: 'title',
        text: 'text'
      });
    },
    emitRemoveItem: () => {
      socketio.emit('REMOVE_ITEM', {
        _item: '_item',
      });
    },

    createItem: (data) => {
      console.log(data);
      let html =
        '<span id="'+data._item+'" class="item">'+
          '<span class="draggable">Drag me</span>'+
          '<h6>'+data.title+'</h6>'+
          '<p>'+data.text+'</p>'+
        '</span>';
      core.appendTextAsHtml(wrapper, html);
    },
    updateItem: (data) => {
      console.log(data);
    },
    removeItem: (data) => {
      console.log(data);
    },

    bindEvents: () => {
      let createItemBtns = document.getElementsByClassName('createItem');

      // Replace event-handlers to prevent memoryleak
      Array.from(createItemBtns).forEach((el) => {
        core.removeEventListener(el, 'click', self.emitCreateItem);
        core.addEventListener(el, 'click', self.emitCreateItem);
      });
      //
      // // Make items draggable
      // Sortable.create(contentWrapper, {
      //   animation: 150,
      //   draggable: '.board_body',
      //   handle: '.board_header'
      // });
      // Array.from(workPlaceItems).forEach(function(el) {
      //   Sortable.create(el, {
      //     group: 'foobar',
    	// 		animation: 150,
      //     onAdd: updateItemPosition
      //   });
      // });
    },
    bindReceivers: () => {
      socketio.on('CREATE_ITEM', self.createItem);
      socketio.on('UPDATE_ITEM', self.updateItem);
      socketio.on('REMOVE_ITEM', self.removeItem);
    }
  };

  return {
    init: self.init,
    create: self.emitCreateItem,
    update: self.emitUpdateItem,
    remove: self.emitRemoveItem
  };
}
