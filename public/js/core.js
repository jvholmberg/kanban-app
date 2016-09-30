'use strict';

var core = {
  addEventListener: (el, ev, cb) => {
    if(document.body.attachEvent) {
      el.attachEvent(ev, cb);
    } else {
      el.addEventListener(ev, cb);
    }
  },
  removeEventListener: (el, ev, fn) => {
    if(document.body.attachEvent) {
      el.detachEvent('on' + ev, fn);
    } else {
      el.removeEventListener('click', fn);
    }
  },
  emptyElement: (el) => {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  },
  prependTextAsHtml: (el, txt) => {
    el.insertAdjacentHTML('afterbegin', txt );
  },
  appendTextAsHtml: (el, txt) => {
    el.insertAdjacentHTML('beforeend', txt );
  },
  xhr: (url) => {
    let core = {
      ajax: (method, url, args, headers) => {
        // Set default headers if none are provided
        headers = (typeof headers === 'object') ? headers
          : {
            'Content-Type': 'application/json; charset=utf-8'
          };

        return new Promise((resolve, reject) => {
          let xhr = new XMLHttpRequest();
          xhr.open(method, url);
          xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
              let responseObj = JSON.parse(xhr.response);
              resolve(responseObj);
            } else {
              reject({
                status: this.status,
                statusText: xhr.statusText
              });
            }
          };
          xhr.onerror = function() {
            reject({
              status: this.status,
              statusText: xhr.statusText
            });
          };
          if (headers) {
            Object.keys(headers).forEach((key) => {
              xhr.setRequestHeader(key, headers[key]);
            });
          }
          // We'll need to stringify if we've been given an object
          // If we have a string, this is skipped.
          if (args && typeof args === 'object') {
            args = Object.keys(args).map((key) => {
              return encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
            }).join('&');
          }
          xhr.send(args);
        });
      }
    };

    return {
      get: (args, headers) => {
        return core.ajax('GET', url, args, headers);
      },
      post: (args, headers) => {
        return core.ajax('POST', url, args, headers);
      },
      put: (args, headers) => {
        return core.ajax('PUT', url, args, headers);
      },
      delete: (args, headers) => {
        return core.ajax('DELETE', url, args, headers);
      }
    };
  },
  alertService: (msg) => {
    console.log(msg);
  }
};
