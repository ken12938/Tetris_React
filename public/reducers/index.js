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

  case 'HOLD':
    _.assign(state.cells, hold(state));
    return state;

  case 'CELL_CLICKED':
    var cells = state.cellsFilled.slice(0);
    cells[action.index] = !cells[action.index];
    return _.assign({}, state, {cells: cells});
  }
  return state;
};

function hold(state) {
  if (!state.holding) {
    state.holding = true;

    for (var i = 0; i < state.newBlock.length; i++) {
      if (state.newBlock[i] >= 0 && state.newBlock[i] < 200) {
        state.cellColor[state.newBlock[i]] = 0;
      }
    }

    if (state.holdBlockColor === 0) {
      state.holdBlock = state.newBlock;
      state.holdBlockColor = state.newBlockColor;

      state.newBlockColor = state.nextBlockColor;
      state.newBlockPosition = 1;

      var num = Math.random();
      if (num < 0.1429) {
        state.nextBlock = [-7, -6, -5, -4];
        state.nextBlockColor = 1;
      } else if (num < 0.2857) {
        state.nextBlock = [-16, -15, -6, -5];
        state.nextBlockColor = 2;
      } else if (num < 0.4286) {
        state.nextBlock = [-15, -6, -5, -4];
        state.nextBlockColor = 3;
      } else if (num < 0.5714) {
        state.nextBlock = [-5, -4, -14, -24];
        state.nextBlockColor = 4;
      } else if (num < 0.7143) {
        state.nextBlock = [-25, -15, -5, -4];
        state.nextBlockColor = 5;
      } else if (num < 0.8571) {
        state.nextBlock = [-16, -15, -5, -4];
        state.nextBlockColor = 6;
      } else {
        state.nextBlock = [-6, -5, -15, -14];
        state.nextBlockColor = 7;
      }
    } else {
      var tempBlock = state.newBlock;
      var tempBlockColor = state.newBlockColor;

      state.newBlockColor = state.holdBlockColor;
      state.newBlockPosition = 1;

      state.holdBlock = tempBlock;
      state.holdBlockColor = tempBlockColor;
    }

    switch (state.newBlockColor) {
      case 1:
        state.newBlock = [-7, -6, -5, -4];
        break;

      case 2:
        state.newBlock = [-16, -15, -6, -5];
        break;

      case 3:
        state.newBlock = [-15, -6, -5, -4];
        break;

      case 4:
        state.newBlock = [-5, -4, -14, -24];
        break;

      case 5:
        state.newBlock = [-25, -15, -5, -4];
        break;

      case 6:
        state.newBlock = [-16, -15, -5, -4];
        break;

      case 7:
        state.newBlock = [-6, -5, -15, -14];
        break;
    }
  }
}

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
  } else if (state.newBlockColor === 3) {
    if (state.newBlockPosition === 1) {
      for (var i = 0; i < state.newBlock.length; i++) {
        if (state.newBlock[i] >= 0) {
          state.cellColor[state.newBlock[i]] = 0;
        }
      }

      state.newBlock = tBlockToRight(state, state.newBlock);
      state.newBlockPosition = 2;

      for (var i = 0; i < state.newBlock.length; i++) {
        state.cellColor[state.newBlock[i]] = state.newBlockColor;
      }
    } else if (state.newBlockPosition === 2) {
      for (var i = 0; i < state.newBlock.length; i++) {
        if (state.newBlock[i] >= 0) {
          state.cellColor[state.newBlock[i]] = 0;
        }
      }

      state.newBlock = tBlockToDown(state, state.newBlock);
      state.newBlockPosition = 3;

      for (var i = 0; i < state.newBlock.length; i++) {
        state.cellColor[state.newBlock[i]] = state.newBlockColor;
      }
    } else if (state.newBlockPosition === 3) {
      for (var i = 0; i < state.newBlock.length; i++) {
        if (state.newBlock[i] >= 0) {
          state.cellColor[state.newBlock[i]] = 0;
        }
      }

      state.newBlock = tBlockToLeft(state, state.newBlock);
      state.newBlockPosition = 4;

      for (var i = 0; i < state.newBlock.length; i++) {
        state.cellColor[state.newBlock[i]] = state.newBlockColor;
      }
    } else {
      for (var i = 0; i < state.newBlock.length; i++) {
        if (state.newBlock[i] >= 0) {
          state.cellColor[state.newBlock[i]] = 0;
        }
      }

      state.newBlock = tBlockToUp(state, state.newBlock);
      state.newBlockPosition = 1;

      for (var i = 0; i < state.newBlock.length; i++) {
        state.cellColor[state.newBlock[i]] = state.newBlockColor;
      }
    }
  } else if (state.newBlockColor === 4) {
    if (state.newBlockPosition === 1) {
      for (var i = 0; i < state.newBlock.length; i++) {
        if (state.newBlock[i] >= 0) {
          state.cellColor[state.newBlock[i]] = 0;
        }
      }

      state.newBlock = jBlockToRight(state, state.newBlock);
      state.newBlockPosition = 2;

      for (var i = 0; i < state.newBlock.length; i++) {
        state.cellColor[state.newBlock[i]] = state.newBlockColor;
      }
    } else if (state.newBlockPosition === 2) {
      for (var i = 0; i < state.newBlock.length; i++) {
        if (state.newBlock[i] >= 0) {
          state.cellColor[state.newBlock[i]] = 0;
        }
      }

      state.newBlock = jBlockToDown(state, state.newBlock);
      state.newBlockPosition = 3;

      for (var i = 0; i < state.newBlock.length; i++) {
        state.cellColor[state.newBlock[i]] = state.newBlockColor;
      }
    } else if (state.newBlockPosition === 3) {
      for (var i = 0; i < state.newBlock.length; i++) {
        if (state.newBlock[i] >= 0) {
          state.cellColor[state.newBlock[i]] = 0;
        }
      }

      state.newBlock = jBlockToLeft(state, state.newBlock);
      state.newBlockPosition = 4;

      for (var i = 0; i < state.newBlock.length; i++) {
        state.cellColor[state.newBlock[i]] = state.newBlockColor;
      }
    } else {
      for (var i = 0; i < state.newBlock.length; i++) {
        if (state.newBlock[i] >= 0) {
          state.cellColor[state.newBlock[i]] = 0;
        }
      }

      state.newBlock = jBlockToUp(state, state.newBlock);
      state.newBlockPosition = 1;

      for (var i = 0; i < state.newBlock.length; i++) {
        state.cellColor[state.newBlock[i]] = state.newBlockColor;
      }
    }
  } else if (state.newBlockColor === 5) {
    if (state.newBlockPosition === 1) {
      for (var i = 0; i < state.newBlock.length; i++) {
        if (state.newBlock[i] >= 0) {
          state.cellColor[state.newBlock[i]] = 0;
        }
      }

      state.newBlock = lBlockToRight(state, state.newBlock);
      state.newBlockPosition = 2;

      for (var i = 0; i < state.newBlock.length; i++) {
        state.cellColor[state.newBlock[i]] = state.newBlockColor;
      }
    } else if (state.newBlockPosition === 2) {
      for (var i = 0; i < state.newBlock.length; i++) {
        if (state.newBlock[i] >= 0) {
          state.cellColor[state.newBlock[i]] = 0;
        }
      }

      state.newBlock = lBlockToDown(state, state.newBlock);
      state.newBlockPosition = 3;

      for (var i = 0; i < state.newBlock.length; i++) {
        state.cellColor[state.newBlock[i]] = state.newBlockColor;
      }
    } else if (state.newBlockPosition === 3) {
      for (var i = 0; i < state.newBlock.length; i++) {
        if (state.newBlock[i] >= 0) {
          state.cellColor[state.newBlock[i]] = 0;
        }
      }

      state.newBlock = lBlockToLeft(state, state.newBlock);
      state.newBlockPosition = 4;

      for (var i = 0; i < state.newBlock.length; i++) {
        state.cellColor[state.newBlock[i]] = state.newBlockColor;
      }
    } else {
      for (var i = 0; i < state.newBlock.length; i++) {
        if (state.newBlock[i] >= 0) {
          state.cellColor[state.newBlock[i]] = 0;
        }
      }

      state.newBlock = lBlockToUp(state, state.newBlock);
      state.newBlockPosition = 1;

      for (var i = 0; i < state.newBlock.length; i++) {
        state.cellColor[state.newBlock[i]] = state.newBlockColor;
      }
    }
  } else if (state.newBlockColor === 6) {
    if (state.newBlockPosition === 1) {
      for (var i = 0; i < state.newBlock.length; i++) {
        if (state.newBlock[i] >= 0) {
          state.cellColor[state.newBlock[i]] = 0;
        }
      }

      state.newBlock = zBlockToVertical(state, state.newBlock);
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

      state.newBlock = zBlockToHorizontal(state, state.newBlock);
      state.newBlockPosition = 1;

      for (var i = 0; i < state.newBlock.length; i++) {
        state.cellColor[state.newBlock[i]] = state.newBlockColor;
      }
    }
  } else if (state.newBlockColor === 7) {
    if (state.newBlockPosition === 1) {
      for (var i = 0; i < state.newBlock.length; i++) {
        if (state.newBlock[i] >= 0) {
          state.cellColor[state.newBlock[i]] = 0;
        }
      }

      state.newBlock = sBlockToVertical(state, state.newBlock);
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

      state.newBlock = sBlockToHorizontal(state, state.newBlock);
      state.newBlockPosition = 1;

      for (var i = 0; i < state.newBlock.length; i++) {
        state.cellColor[state.newBlock[i]] = state.newBlockColor;
      }
    }
  }
}

function sBlockToVertical(state, arr) {
  var newArr = arr;
  newArr[0] = arr[0] + 1;
  newArr[1] = arr[1] - 10;
  newArr[2] = arr[2] - 1;
  newArr[3] = arr[3] - 12;

  var searching = true;

  while (searching) {
    if (newArr[0] < 0) {
      return arr;
    }

    var clear = true;
    for (var i = 0; i < newArr.length; i++) {
      if (state.cellsFilled[newArr[i]]) {
        clear = false;
      }
    }

    if (clear) {
      return newArr;
    } else {
      for (var i = 0; i < newArr.length; i++) {
        newArr[i] = newArr[i] - 10;
      }
    }
  }
}

function sBlockToHorizontal(state, arr) {
  var newArr = arr;
  newArr[0] = arr[0] - 1;
  newArr[1] = arr[1] + 10;
  newArr[2] = arr[2] + 1;
  newArr[3] = arr[3] + 12;

  if (newArr[3] % 10 === 0) {
    for (var i = 0; i < newArr.length; i++) {
      newArr[i] = newArr[i] - 1;
    }
  }

  var searching = true;

  while (searching) {
    if (newArr[0] < 0) {
      return arr;
    }

    var clear = true;
    for (var i = 0; i < newArr.length; i++) {
      if (state.cellsFilled[newArr[i]]) {
        clear = false;
      }
    }

    if (clear) {
      return newArr;
    } else {
      for (var i = 0; i < newArr.length; i++) {
        newArr[i] = newArr[i] - 10;
      }
    }
  }
}

function zBlockToVertical(state, arr) {
  var newArr = arr;
  newArr[0] = arr[0] - 9;
  newArr[2] = arr[2] - 11;
  newArr[3] = arr[3] - 2;

  var searching = true;

  while (searching) {
    if (newArr[0] < 0) {
      return arr;
    }

    var clear = true;
    for (var i = 0; i < newArr.length; i++) {
      if (state.cellsFilled[newArr[i]]) {
        clear = false;
      }
    }

    if (clear) {
      return newArr;
    } else {
      for (var i = 0; i < newArr.length; i++) {
        newArr[i] = newArr[i] - 10;
      }
    }
  }
}

function zBlockToHorizontal(state, arr) {
  var newArr = arr;
  newArr[0] = arr[0] + 9;
  newArr[2] = arr[2] + 11;
  newArr[3] = arr[3] + 2;

  if (newArr[3] % 10 === 0) {
    for (var i = 0; i < newArr.length; i++) {
      newArr[i] = newArr[i] - 1;
    }
  }

  var searching = true;

  while (searching) {
    if (newArr[0] < 0) {
      return arr;
    }

    var clear = true;
    for (var i = 0; i < newArr.length; i++) {
      if (state.cellsFilled[newArr[i]]) {
        clear = false;
      }
    }

    if (clear) {
      return newArr;
    } else {
      for (var i = 0; i < newArr.length; i++) {
        newArr[i] = newArr[i] - 10;
      }
    }
  }
}

function lBlockToRight(state, arr) {
  var newArr = arr;
  newArr[0] = arr[0] + 12;
  newArr[1] = arr[1] + 1;
  newArr[2] = arr[2] - 10;
  newArr[3] = arr[3] - 1;

  if (newArr[0] % 10 === 0) {
    for (var i = 0; i < newArr.length; i++) {
      newArr[i] = newArr[i] - 1;
    }
  }

  var searching = true;

  while (searching) {
    if (newArr[0] < 0) {
      return arr;
    }

    var clear = true;
    for (var i = 0; i < newArr.length; i++) {
      if (state.cellsFilled[newArr[i]]) {
        clear = false;
      }
    }

    if (clear) {
      return newArr;
    } else {
      for (var i = 0; i < newArr.length; i++) {
        newArr[i] = newArr[i] - 10;
      }
    }
  }
}

function lBlockToDown(state, arr) {
  var newArr = arr;
  newArr[0] = arr[0] + 19;
  newArr[1] = arr[1] + 10;
  newArr[2] = arr[2] + 1;
  newArr[3] = arr[3] - 10;

  var searching = true;

  while (searching) {
    if (newArr[0] < 0) {
      return arr;
    }

    var clear = true;
    for (var i = 0; i < newArr.length; i++) {
      if (state.cellsFilled[newArr[i]]) {
        clear = false;
      }
    }

    if (clear) {
      return newArr;
    } else {
      for (var i = 0; i < newArr.length; i++) {
        newArr[i] = newArr[i] - 10;
      }
    }
  }
}

function lBlockToLeft(state, arr) {
  var newArr = arr;
  newArr[0] = arr[0] - 12;
  newArr[1] = arr[1] - 1;
  newArr[2] = arr[2] + 10;
  newArr[3] = arr[3] + 1;

  if (newArr[0] % 10 === 9) {
    for (var i = 0; i < newArr.length; i++) {
      newArr[i] = newArr[i] + 1;
    }
  }

  var searching = true;

  while (searching) {
    if (newArr[0] < 0) {
      return arr;
    }

    var clear = true;
    for (var i = 0; i < newArr.length; i++) {
      if (state.cellsFilled[newArr[i]]) {
        clear = false;
      }
    }

    if (clear) {
      return newArr;
    } else {
      for (var i = 0; i < newArr.length; i++) {
        newArr[i] = newArr[i] - 10;
      }
    }
  }
}

function lBlockToUp(state, arr) {
  var newArr = arr;
  newArr[0] = arr[0] - 19;
  newArr[1] = arr[1] - 10;
  newArr[2] = arr[2] - 1;
  newArr[3] = arr[3] + 10;

  var searching = true;

  while (searching) {
    if (newArr[0] < 0) {
      return arr;
    }

    var clear = true;
    for (var i = 0; i < newArr.length; i++) {
      if (state.cellsFilled[newArr[i]]) {
        clear = false;
      }
    }

    if (clear) {
      return newArr;
    } else {
      for (var i = 0; i < newArr.length; i++) {
        newArr[i] = newArr[i] - 10;
      }
    }
  }
}

function jBlockToRight(state, arr) {
  var newArr = arr;
  newArr[0] = arr[0] - 10;
  newArr[1] = arr[1] - 1;
  newArr[2] = arr[2] + 10;
  newArr[3] = arr[3] + 21;

  if (newArr[3] % 10 === 0) {
    for (var i = 0; i < newArr.length; i++) {
      newArr[i] = newArr[i] - 1;
    }
  }

  var searching = true;

  while (searching) {
    if (newArr[0] < 0) {
      return arr;
    }

    var clear = true;
    for (var i = 0; i < newArr.length; i++) {
      if (state.cellsFilled[newArr[i]]) {
        clear = false;
      }
    }

    if (clear) {
      return newArr;
    } else {
      for (var i = 0; i < newArr.length; i++) {
        newArr[i] = newArr[i] - 10;
      }
    }
  }
}

function jBlockToDown(state, arr) {
  var newArr = arr;
  newArr[0] = arr[0] + 1;
  newArr[1] = arr[1] - 10;
  newArr[2] = arr[2] - 1;
  newArr[3] = arr[3] + 8;

  var searching = true;

  while (searching) {
    if (newArr[0] < 0) {
      return arr;
    }

    var clear = true;
    for (var i = 0; i < newArr.length; i++) {
      if (state.cellsFilled[newArr[i]]) {
        clear = false;
      }
    }

    if (clear) {
      return newArr;
    } else {
      for (var i = 0; i < newArr.length; i++) {
        newArr[i] = newArr[i] - 10;
      }
    }
  }
}

function jBlockToLeft(state, arr) {
  var newArr = arr;
  newArr[0] = arr[0] + 10;
  newArr[1] = arr[1] + 1;
  newArr[2] = arr[2] - 10;
  newArr[3] = arr[3] - 21;

  if (newArr[3] % 10 === 9) {
    for (var i = 0; i < newArr.length; i++) {
      newArr[i] = newArr[i] + 1;
    }
  }

  var searching = true;

  while (searching) {
    if (newArr[2] < 0) {
      return arr;
    }

    var clear = true;
    for (var i = 0; i < newArr.length; i++) {
      if (state.cellsFilled[newArr[i]]) {
        clear = false;
      }
    }

    if (clear) {
      return newArr;
    } else {
      for (var i = 0; i < newArr.length; i++) {
        newArr[i] = newArr[i] - 10;
      }
    }
  }
}

function jBlockToUp(state, arr) {
  var newArr = arr;
  newArr[0] = arr[0] - 1;
  newArr[1] = arr[1] + 10;
  newArr[2] = arr[2] + 1;
  newArr[3] = arr[3] - 8;
  console.log(arr + ", " + newArr);

  var searching = true;

  while (searching) {
    if (newArr[3] < 0) {
      return arr;
    }

    var clear = true;
    for (var i = 0; i < newArr.length; i++) {
      if (state.cellsFilled[newArr[i]]) {
        clear = false;
      }
    }

    if (clear) {
      return newArr;
    } else {
      for (var i = 0; i < newArr.length; i++) {
        newArr[i] = newArr[i] - 10;
      }
    }
  }
}

function tBlockToRight(state, arr) {
  var newArr = arr;
  newArr[1] = newArr[2] + 10;

  var searching = true;
  var heightIncrease = 0;

  while (searching) {
    if (newArr[0] < 0) {
      return arr;
    }

    if (newArr[1] >= 200) {
      for (var i = 0; i < newArr.length; i++) {
        newArr[i] = newArr[i] - 10;
      }
    } else if (state.cellsFilled[newArr[1]]) {
      for (var i = 0; i < newArr.length; i++) {
        newArr[i] = newArr[i] - 10;
      }
    } else {
      return arr;
    }
  }

  return newArr;
}

function tBlockToDown(state, arr) {
  var newArr = arr;
  newArr[0] = newArr[2] - 1;

  if (newArr[0] % 10 === 9) {
    for (var i = 0; i < newArr.length; i++) {
      newArr[i] = newArr[i] + 1;
    }

    var clear = true;
    for (var i = 0; i < newArr.length; i++) {
      if (newArr[i] >= 200) {
        clear = false;
      } else if (state.cellsFilled[newArr[i]]) {
        clear = false;
      }
    }

    if (clear) {
      return newArr;
    } else {
      return arr;
    }
  } else {
    return newArr;
  }
}

function tBlockToLeft(state, arr) {
  var newArr = arr;
  newArr[3] = newArr[2] - 10;

  if (newArr[3] < 0) {
    return arr;
  } else if (state.cellsFilled[newArr[3]]) {
    return arr;
  } else {
    return newArr;
  }
}

function tBlockToUp(state, arr) {
  var newArr = arr;
  newArr[3] = newArr[2] + 1;
  newArr[1] = newArr[2] - 1;
  newArr[0] = newArr[2] - 10;

  if (newArr[3] % 10 === 0) {
    for (var i = 0; i < newArr.length; i++) {
      newArr[i] = newArr[i] - 1;
    }

    var clear = true;
    for (var i = 0; i < newArr.length; i++) {
      if (newArr[i] >= 200) {
        clear = false;
      } else if (state.cellsFilled[newArr[i]]) {
        clear = false;
      }
    }

    if (clear) {
      return newArr;
    } else {
      return arr;
    }
  } else {
    return newArr;
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

  state.counter = state.counter + 1 + state.score/20;

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

  //updating score
  if (linesCleared === 1) {
    state.score = state.score + 2 + 2*state.combo;
    state.combo++;
  } else if (linesCleared === 2) {
    state.score = state.score + 5 + 2*state.combo;
    state.combo++;
  } else if (linesCleared === 3) {
    state.score = state.score + 10 + 2*state.combo;
    state.combo++;
  } else if (linesCleared === 4) {
    state.score = state.score + 20 + 2*state.combo;
    state.combo++;
  } else {
    state.combo = 0;
  }

  //making new block at the top
  state.newBlock = state.nextBlock;
  state.newBlockColor = state.nextBlockColor;
  state.newBlockPosition = 1;

  var num = Math.random();
  if (num < 0.1429) {
    state.nextBlock = [-7, -6, -5, -4];
    state.nextBlockColor = 1;
  } else if (num < 0.2857) {
    state.nextBlock = [-16, -15, -6, -5];
    state.nextBlockColor = 2;
  } else if (num < 0.4286) {
    state.nextBlock = [-15, -6, -5, -4];
    state.nextBlockColor = 3;
  } else if (num < 0.5714) {
    state.nextBlock = [-5, -4, -14, -24];
    state.nextBlockColor = 4;
  } else if (num < 0.7143) {
    state.nextBlock = [-25, -15, -5, -4];
    state.nextBlockColor = 5;
  } else if (num < 0.8571) {
    state.nextBlock = [-16, -15, -5, -4];
    state.nextBlockColor = 6;
  } else {
    state.nextBlock = [-6, -5, -15, -14];
    state.nextBlockColor = 7;
  }

  state.holding = false;

  return state;
}

module.exports = exports = {
  mainReducer: mainReducer,
  updateCells: updateCells
};
