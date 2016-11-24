// CIS 197 - React HW

var React = require('react');
var ReactDOM = require('react-dom');
var createStore = require('redux').createStore;
var reducers = require('./reducers').mainReducer;
var GameOfLife = require('./components/GameOfLife.jsx');
var initialState = require('./initialState.js');
var actions = require('./actions/index.js');
var timer = require('./timer.js');

var store = createStore(reducers, initialState);
timer.setStore(store);

var gameOfLife = <GameOfLife store={store}/>;

document.addEventListener('DOMContentLoaded', function () {
  ReactDOM.render(
    gameOfLife,
    document.getElementById('container')
  );
});
