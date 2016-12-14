var _ = require('lodash');
var timer = require('../timer.js');
var initialState = require('../initialState.js');

function Run () {
  this.isRunning = true;
}

function Stop () {
  this.isRunning = false;
}

function contains (arr, obj) {
  var i = arr.length;
  while (i--) {
    if (arr[i] === obj) {
      return true;
    }
  }
  return false;
}

var mainReducer = function (state, action) {

  switch (action.type) {
  case 'RUN':
    console.log('Running');
    timer.run();
    _.assign(state, new Run);
    return state;

  case 'STOP':
    console.log('Stopped');
    timer.stop();
    _.assign(state, new Stop);
    return state;

  case 'STEP':
    _.assign(state.cells, updateCells(state));
    return state;

  case 'LEFT':
    _.assign(state.cells, inputLeft(state));
    return state;

  case 'RIGHT':
    _.assign(state.cells, inputRight(state));
    return state;

  case 'DOWN':
    _.assign(state.cells, inputDown(state));
    return state;

  case 'HARDDROP':
    _.assign(state.cells, hardDrop(state));
    return state;

  case 'CELL_CLICKED':
    var cells = state.cellsFilled.slice(0);
    cells[action.index] = !cells[action.index];
    return _.assign({}, state, {cells: cells});
  }
  return state;
};

function inputLeft(state) {

  var clear = true;
  for (var i = 0; i < state.newBlock.length; i++) {
    if (state.newBlock[i] % 10 === 0) {
      clear = false;
    } else if (state.cellsFilled[state.newBlock[i] - 1]) {
      clear = false;
    }
  }

  if (clear) {
    for (var i = 0; i < state.newBlock.length; i++) {
      var currCell = state.newBlock[i];
      state.newBlock[i] = currCell - 1;
      if (currCell >= 0) {
        state.cellColor[currCell - 1] = 1;
      }
    }

    for (var i = 0; i < state.newBlock.length; i++) {
      var currCell = state.newBlock[i];
      if (currCell >= 0 && !contains(state.newBlock, currCell + 1)) {
        state.cellColor[currCell + 1] = 0;
      }
    }
  }

  return state;
}

function inputRight(state) {

  var clear = true;
  for (var i = 0; i < state.newBlock.length; i++) {
    if (state.newBlock[i] % 10 === 9) {
      clear = false;
    } else if (state.cellsFilled[state.newBlock[i] + 1]) {
      clear = false;
    }
  }

  if (clear) {
    for (var i = 0; i < state.newBlock.length; i++) {
      var currCell = state.newBlock[i];
      state.newBlock[i] = currCell + 1;
      if (currCell >= 0) {
        state.cellColor[currCell + 1] = 1;
      }
    }

    for (var i = 0; i < state.newBlock.length; i++) {
      var currCell = state.newBlock[i];
      if (currCell >= 0 && !contains(state.newBlock, currCell - 1)) {
        state.cellColor[currCell - 1] = 0;
      }
    }
  }

  return state;
}

function inputDown(state) {
  state.counter = state.counter + 15;

  return updateCells(state);
}

function hardDrop(state) {

  var clear = true;
  var heightDiff = 0;

  while (clear) {

    for (var i = 0; i < state.newBlock.length; i++) {
      state.newBlock[i] = state.newBlock[i] + 10;
    }

    for (var i = 0; i < state.newBlock.length; i++) {
      console.log(state.newBlock[i] + 10);
      if (state.newBlock[i] + 10 >= 200) {
        clear = false;
      } else if (state.cellsFilled[state.newBlock[i] + 10]) {
        clear = false;
      }
    }

    heightDiff = heightDiff + 1;
  }

  for (var i = 0; i < state.newBlock.length; i++) {
    if (state.newBlock[i] - 10*heightDiff >= 0) {
      state.cellColor[state.newBlock[i] - 10*heightDiff] = 0;
    }
  }
      
  for (var i = 0; i < state.newBlock.length; i++) {
    var currCell = state.newBlock[i];
    state.cellColor[currCell] = state.newBlockColor;
    state.cellsFilled[currCell] = true;
    if (currCell < 10) {
      timer.stop();
      _.assign(state, new Stop);
    } else {
      state.newBlock[i] = -7 + i;
    }
  }

  return state;
}

function updateCells(state) {

  state.counter = state.counter + 1;

  if (state.counter >= 30) {
    
    state.counter = 0; 

    var clear = true;
    for (var i = 0; i < state.newBlock.length; i++) {
      if (state.newBlock[i] + 10 >= 200) {
        clear = false;
      } else if (state.cellsFilled[state.newBlock[i] + 10]) {
        clear = false;
      }
    }

    if (clear) {
      for (var i = 0; i < state.newBlock.length; i++) {
        var currCell = state.newBlock[i];
        state.newBlock[i] = currCell + 10;
        state.cellColor[currCell + 10] = state.newBlockColor;
        if (currCell >= 0) {
          state.cellColor[currCell] = 0;
        }
      }
    } else {
      for (var i = 0; i < state.newBlock.length; i++) {
        var currCell = state.newBlock[i];
        state.cellColor[currCell] = state.newBlockColor;
        state.cellsFilled[currCell] = true;
        if (currCell < 10) {
          timer.stop();
          _.assign(state, new Stop);
        } else {
          state.newBlock[i] = -7 + i;
        }
      }
    }

  }

  return state;
}

module.exports = exports = {
  mainReducer: mainReducer,
  updateCells: updateCells
};
