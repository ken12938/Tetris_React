// CIS 197 - React HW

var x = 48;
var y = 36;

module.exports = exports = {
  cells: Array.apply(null, Array(x * y)).map(function () {
    return false;
  }),
  x: x,
  y: y
};
