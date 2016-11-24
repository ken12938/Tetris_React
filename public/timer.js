// CIS 197 - React HW

var actions = require('./actions');
var interval = null;
var store = null;

module.exports = exports = {
  run: function () {
    if(!interval) {
      interval = setInterval(function () {
        store.dispatch(actions.step());
      }, 1);
    }
  },
  stop: function () {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  },
  setStore: function (s) {
    store = s;
  }
};
