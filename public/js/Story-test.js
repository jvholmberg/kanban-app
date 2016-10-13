'use strict';

function Story(socketio, root) {

  let myStory = {
    props: {
      // id: null,
      // owner; null,
      // title: null,
      // text: null,
      // boards: null,
      // items: null
    },

    init: (id) => {
      if (typeof id === 'string') {
        core.xhr('/api/LoadStory/' + id)
          .get(null, null)
          .then(myStory.successHandler)
          .catch(myStory.errorHandler);
        socketio.on('CREATE_STORY', myStory.create);
        socketio.on('UPDATE_STORY', myStory.update);
        socketio.on('REMOVE_STORY', myStory.remove);
      }
    },
    render: () => {
      core.appendTextAsHtml(root,
        '<div id="'+myStory.props.id+'" class="storyRoot"></div>'
      );
    },

    successHandler: (data) => {
      myStory.props = data;
      myStory.render();
    },
    errorHandler: (err) => {
      console.log(err);
    },

    create: (e) => {
      myStory.emit('CREATE_STORY', {
        _story: myStory.props.id,
        _owner: myStory.props.owner,
        title: myStory.props.title,
        text: myStory.props.text
      });
    },
    update: (e) => {
      myStory.emit('UPDATE_STORY', {
        _story: myStory.props.id,
        _owner: myStory.props.owner,
        title: myStory.props.title,
        text: myStory.props.text
      });
    },
    remove: (e) => {
      myStory.emit('REMOVE_STORY', {
        _story: myStory.props.id,
      });
    },
    emit: (channel, data) => {
      socketio.emit(channel, data);
    }
  }

  return {
    init: myStory.init,
    props: myStory.props
  };
}
