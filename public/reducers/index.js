// CIS 197 - React HW

var _ = require('lodash');
var timer = require('../timer.js');
var initialState = require('../initialState.js');

// Every time an action is dispatched, this function is called.
// Using the current state and the action just performed (along with
// any payload data associated with it), this function computes the
// next state.
// HOWEVER, note that you CANNOT mutate the state variable directly.
// Instead, you want return a new, updated copy of the state in the
// reducer each time it is called (an easy way to do this is to use
// lodash's _.assign function).
//
// TODO: Implement the following cases:
//       'STOP' - stop the animation by setting isRunning to false
//       'STEP' - use the updateCells function below to update the cells array
//       'CLEAR' - set the grid to an empty grid and stop the animation
//       'RANDOM_SEED' - set the cells array to a randomly-generated grid
//       'IMPORT_SEED' - update the cells array to the action's seed payload
//                       and stop the animation if necessary.

function Run () {
  this.isRunning = true;
}

function Stop () {
  this.isRunning = false;
}

var mainReducer = function (state, action) {

  console.log(state);
  console.log(action);
  console.log(action.type);

  switch (action.type) {
  case 'RUN':
    timer.run();
    _.assign(state, new Run);
    return state;

  case 'STOP':
    timer.stop();
    _.assign(state, new Stop);
    return state;

  case 'STEP':
    _.assign(state.cells, updateCells(state));
    return state;

  case 'RANDOM_SEED':
    _.assign(state.cells, randomSeed(state));
    timer.stop();
    _.assign(state, new Stop);
    return state;

  case 'IMPORT_SEED':
    _.assign(state.cells, action.seed);
    return state;

  case 'EXPORT':
    var data = encodeURIComponent(state.cells);
    return document.location = '/export?data=[' + data + ']';

  case 'CELL_CLICKED':
    var cells = state.cells.slice(0);
    cells[action.index] = !cells[action.index];
    return _.assign({}, state, {cells: cells});
  }
  return state;
};

function randomSeed(state) {
  // TODO: Return a (NEW) randomly generated array of true/false values
  // the same length as state.cells

  var cell = [];

  for (var i=0; i < state.cells.length; i++) {
    var rand = Math.random();
    if (rand > 0.5) {
      cell.push(false);
    } else {
      cell.push(true);
    }
  }

  return cell;
}

// This is the main algorithm behind the Game of Life simulation.
// Every time it is called, it computes based on the current state's
// cells the NEXT state's cells and return a copy of the new cells array.
//
// The algorthim determines cell state based on the states of neighbouring
// cells for each iteration according to these rules:
//
// 1 - Any live cell with fewer than two live neighbours dies,as if caused by
//     under-population.
// 2 - Any live cell with two or three live neighbours lives on to the next
//     generation.
// 3 - Any live cell with more than three live neighbours dies, as if by
//     overcrowding.
// 4 - Any dead cell with exactly three live neighbours becomes a live cell,
//     as if by reproduction.
//
function updateCells(state) {
  var newCells = new Array(state.cells.length);
  state.cells.forEach(function (_, i) {
    var cell = state.cells[i];
    var live_neighbors = 0;
    var x = i % state.x;
    var y = Math.floor(i / state.x);
    var l = x !== 0 && i - 1;
    var r = x !== state.x - 1 && i + 1;
    var t = y !== 0 && i - state.x;
    var b = y !== state.y - 1 && i + state.x;

    var tl, tr, bl, br;
    l && t && (tl = l - state.x);
    l && b && (bl = l + state.x);
    r && t && (tr = r - state.x);
    r && b && (br = r + state.x);

    [l, r, t, b, tl, bl, tr, br].forEach(function (n) {
      state.cells[n] && live_neighbors++;
    });

    newCells[i] = (cell && (live_neighbors === 2 || live_neighbors === 3)) ||
           (live_neighbors === 3);
  });
  return newCells;
}

module.exports = exports = {
  mainReducer: mainReducer,
  updateCells: updateCells,
  randomSeed: randomSeed
};
