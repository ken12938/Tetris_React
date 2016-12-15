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

  case 'ROTATE':
    _.assign(state.cells, rotate(state));
    return state;

  case 'CELL_CLICKED':
    var cells = state.cellsFilled.slice(0);
    cells[action.index] = !cells[action.index];
    return _.assign({}, state, {cells: cells});
  }
  return state;
};

function rotate(state) {
  if (state.newBlockColor === 1) {
    if (state.newBlockPosition === 1) {
      for (var i = 0; i < state.newBlock.length; i++) {
        if (state.newBlock[i] >= 0) {
          state.cellColor[state.newBlock[i]] = 0;
        }
      }

      state.newBlock = iBlockToVertical(state, state.newBlock);
      state.newBlockPosition = 2;

      for (var i = 0; i < state.newBlock.length; i++) {
        state.cellColor[state.newBlock[i]] = state.newBlockColor;
      }
    } else {
      for (var i = 0; i < state.newBlock.length; i++) {
        if (state.newBlock[i] >= 0) {
          state.cellColor[state.newBlock[i]] = 0;
        }
      }

      state.newBlock = iBlockToHorizontal(state, state.newBlock);
      state.newBlockPosition = 1;

      for (var i = 0; i < state.newBlock.length; i++) {
        state.cellColor[state.newBlock[i]] = state.newBlockColor;
      }
    }
  }
}

function iBlockToVertical(state, arr) {
  var searching = true;
  var heightIncrease = 0;

  while (searching) {
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
      newArr.push(arr[1] - 10 + i*10 - heightIncrease*10);
    }

    if (newArr[0] < 0) {
      return arr;
    }

    var clear = true;
    for (var i = 0; i < newArr.length; i++) {
      if (newArr[i] >= 200) {
        clear = false;
      } else if (state.cellsFilled[newArr[i]]) {
        clear = false;
      }
    }

    if (!clear) {
      heightIncrease++;
    } else {
      return newArr;
    }

  }
}

function iBlockToHorizontal(state, arr) {
  var searching = true;
  var heightIncrease = 0;

  while (searching) {
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
      newArr.push(arr[1] - 1 + i - heightIncrease*10);
    }

    if (newArr[0] < 0) {
      return arr;
    }

    if (newArr[0] % 10 === 9) {
      var xOffset = 10 - newArr[0] % 10;

      for (var i = 0; i < newArr.length; i++) {
        newArr[i] = newArr[i] + xOffset;
      }
    } else if (newArr[0] % 10 >= 7) {
      var xOffset = newArr[0] % 10 - 6;

      for (var i = 0; i < newArr.length; i++) {
        newArr[i] = newArr[i] - xOffset;
      }
    }

    var clear = true;
    for (var i = 0; i < newArr.length; i++) {
      if (newArr[i] >= 200) {
        clear = false;
      } else if (state.cellsFilled[newArr[i]]) {
        clear = false;
      }
    }

    if (!clear) {
      heightIncrease++;
    } else {
      return newArr;
    }
  }
}

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
        state.cellColor[currCell - 1] = state.newBlockColor;
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
        state.cellColor[currCell + 1] = state.newBlockColor;
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
    }
  }
  
  return clearLines(state);
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
        if (state.newBlock[i] >= 0) {
          state.cellColor[state.newBlock[i]] = 0;
        }
        state.newBlock[i] = state.newBlock[i] + 10;
      }

      for (var i = 0; i < state.newBlock.length; i++) {
        state.cellColor[state.newBlock[i]] = state.newBlockColor;
      }
    } else {
      for (var i = 0; i < state.newBlock.length; i++) {
        var currCell = state.newBlock[i];
        state.cellColor[currCell] = state.newBlockColor;
        state.cellsFilled[currCell] = true;
        if (currCell < 10) {
          timer.stop();
          _.assign(state, new Stop);
        }
      }

      return clearLines(state);
    }

  }

  return state;
}

function clearLines(state) {
  var linesCleared = 0;
  var currentLine = 19;

  while (currentLine + linesCleared >= 0 && linesCleared < 4) {
    var lineFilled = true;
    for (var i = 0; i < 10; i++) {
      if (!state.cellsFilled[10*(currentLine + linesCleared) + i]) {
        lineFilled = false;
        i = 10;
      }
    }

    if (lineFilled) {
      for (var i = 10*(currentLine + linesCleared) + 9; i >= linesCleared*10; i--) {
        state.cellsFilled[i] = state.cellsFilled[i - 10];
        state.cellColor[i] = state.cellColor[i - 10];
      }

      for (var i = 0; i < 10; i++) {
        state.cellsFilled[10*linesCleared + i] = false;
        state.cellColor[10*linesCleared + i] = 0;
      }

      linesCleared++;
    }
    currentLine--;
  }

  var num = Math.random();
  if (num > 0.5) {
    state.newBlock = [-7, -6, -5, -4];
    state.newBlockPosition = 1;
    state.newBlockColor = 1;
  } else {
    state.newBlock = [-16, -15, -6, -5];
    state.newBlockPosition = 1;
    state.newBlockColor = 2;
  }

  return state;
}

module.exports = exports = {
  mainReducer: mainReducer,
  updateCells: updateCells
};
