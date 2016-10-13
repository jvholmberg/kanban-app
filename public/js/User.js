'use strict';

function User() {

  var _user = {

    props: null,

    init: () => {
      core.xhr('/api/LoadUser/' + id)
        .get(null, null)
        .then(_user.successHandler)
        .catch(_user.errorHandler);
    },
    successHandler: (data) => {
      _user.props = {
        fullName: data.firstName + ' ' + data.lastName,
        stories: data.stories
      };
    },
    errorHandler: (err) => {
      console.log(err);
    },

  }
  return = {

  };
}
