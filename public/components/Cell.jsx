// CIS 197 - React HW

var React = require('react');
var PropTypes = React.PropTypes;
var actions = require('../actions/index.js');

var Cell = React.createClass({
  propTypes: {
    store: PropTypes.object.isRequired,
    alive: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired
  },

  getDefaultProps: function () {
    return {
      alive: false,
      key: 0,
      index: 0
    };
  },

  onCellClick: function () {
    // TODO: Write the code to dispatch the action corresponding to the
    //       clicking of a cell at a particular index.
  },

  render: function () {
    // TODO: complete the render function.
    //       A non-living cell has the HTML structure
    //       <span class="cell-component cell"></span>
    //       while a non-living cell has the HTML structure
    //       <span class="cell-component cell alive"></span>
    // HINT: don't forget to implement the click handler
    //       whose execution dispatches a CELL_CLICKED event.
  }
});

module.exports = Cell;
