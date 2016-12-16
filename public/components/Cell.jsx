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

  render: function () {

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
    } else if (this.props.color === 3) {
      return (
        <span onClick={this.onCellClick} className="cell-component cell purple"></span>
      )
    } else if (this.props.color === 4) {
      return (
        <span onClick={this.onCellClick} className="cell-component cell yellow"></span>
      )
    } else if (this.props.color === 5) {
      return (
        <span onClick={this.onCellClick} className="cell-component cell pink"></span>
      )
    } else if (this.props.color === 6) {
      return (
        <span onClick={this.onCellClick} className="cell-component cell blue"></span>
      )
    } else if (this.props.color === 7) {
      return (
        <span onClick={this.onCellClick} className="cell-component cell orange"></span>
      )
    }
  }
});

module.exports = Cell;
