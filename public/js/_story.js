'use strict';

function story(socketio, root) {

  let self = {
    init: (id) => {

      core.xhr('/api/story/' + id).get(null, null)
        .then(self.loadStory)
        .catch((err) => {
          console.log(err);
        });



      self.bindReceivers();
      self.bindEvents();
    },
    loadStory: (data) => {

    },

    emitCreateStory: () => {
      console.log('emitCreateStory');
      socketio.emit('CREATE_STORY', {
        _story: '_story',
        _owner: '_owner',
        title: 'title',
        text: 'text'
      });
    },
    emitUpdateStory: () => {
      console.log('emitUpdateStory');
      socketio.emit('UPDATE_STORY', {
        _story: '_story',
        _owner: '_owner',
        title: 'title',
        text: 'text'
      });
    },
    emitRemoveStory: () => {
      console.log('emitRemoveStory');
      socketio.emit('REMOVE_STORY', {
        _story: '_story',
      });
    },

    createStory: (data) => {
      console.log(data);
    },
    updateStory: (data) => {
      console.log(data);
    },
    removeStory: (data) => {
      console.log(data);
    },

    bindEvents: () => {
      let createStoryBtn = document.getElementsByClassName('createStory')[0];

      // Replace event-handlers to prevent memoryleak
      core.removeEventListener(createStoryBtn, 'click', self.emitCreateStory);
      core.addEventListener(createStoryBtn, 'click', self.emitCreateStory);
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
      // Array.from(workPlaceStorys).forEach(function(el) {
      //   Sortable.create(el, {
      //     group: 'foobar',
    	// 		animation: 150,
      //     onAdd: updateItemPosition
      //   });
      // });
    },
    bindReceivers: () => {
      socketio.on('CREATE_STORY', self.createStory);
      socketio.on('UPDATE_STORY', self.updateStory);
      socketio.on('REMOVE_STORY', self.removeStory);
    }
  };

  return {
    init: self.init,
    create: self.emitCreateStory,
    update: self.emitUpdateStory,
    remove: self.emitRemoveStory
  };
}
