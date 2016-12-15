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

    if (this.props.color === 0) {
      return (
        <span onClick={this.onCellClick} className="cell-component cell black"></span>
      )
    } else if (this.props.color === 1) {
      return (
        <span onClick={this.onCellClick} className="cell-component cell red"></span>
      )
    } else if (this.props.color === 2) {
      return (
        <span onClick={this.onCellClick} className="cell-component cell green"></span>
      )
    }
  }
});

module.exports = Cell;
