var x = 10;
var y = 20;

module.exports = exports = {
  cellColor: Array.apply(null, Array(x * y)).map(function () {
  	return 0;
  }),
  cellsFilled: Array.apply(null, Array(x * y)).map(function () {
  	return false;
  }),
  newBlock: [-7, -6, -5, -4],
  newBlockColor: 1,
  nextBlock: [-7, -6, -5, -4],
  nextBlockColor: 1,
  holdBlock: [],
  holdBlockColor: 0,
  holding: false,
  newBlockPosition: 1,
  counter: 0,
  score: 0,
  combo: 0,
  x: x,
  y: y
};
