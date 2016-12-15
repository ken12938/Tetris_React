exports.run = function () {
  return {
    type: 'RUN'
  };
};

exports.step = function () {
  return {
    type: 'STEP'
  };
};

exports.stop = function () {
  return {
    type: 'STOP'
  };
};

exports.left = function () {
  return {
    type: 'LEFT'
  };
};

exports.right = function () {
  return {
    type: 'RIGHT'
  };
};

exports.down = function () {
  return {
    type: 'DOWN'
  };
};

exports.hardDrop = function () {
  return {
    type: 'HARDDROP'
  };
};

exports.rotate = function () {
  return {
    type: 'ROTATE'
  };
};