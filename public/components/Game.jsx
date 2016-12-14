

var _ = require('lodash');
var React = require('react');
var PropTypes = React.PropTypes;
var Cell = require('./Cell.jsx');
var actions = require('../actions/index.js');
var initialState = require('../initialState.js');

var Game = React.createClass({
	propTypes: {
		store: React.PropTypes.object.isRequired
	},

  componentDidMount: function () {
    this.props.store.subscribe(function () {
      this.setState(this.props.store.getState());
    }.bind(this));
  },

  getInitialState: function () {
    return initialState;
  },

  run: function () {
    this.props.store.dispatch(actions.run());
  },

  stop: function () {
    this.props.store.dispatch(actions.stop());
  },

  keyboardEvent: function (e) {
    if (e.keyCode == 37) {
      this.props.store.dispatch(actions.left());
    } else if (e.keyCode == 39) {
      this.props.store.dispatch(actions.right());
    } else if (e.keyCode == 40) {
      this.props.store.dispatch(actions.down());
    } else if (e.keyCode == 32) {
      this.props.store.dispatch(actions.hardDrop());
    }
  },

	render: function () {
		var cells = [];

		for (var i = 0; i < 200; i++) {
			cells.push(<Cell key={i} index={i} color={this.state.cellColor[i]} store={this.props.store}></Cell>);
		}

		return(
		  <div className="game-board">
        <div className="board-component">
          {cells}
        </div>
        <div className="start">
          <button onClick={this.run}>Start Game</button>
          <button onKeyDown={this.keyboardEvent}>Controls</button>
          <button onClick={this.stop}>Stop Game</button>
        </div>
		  </div>
		);
	}
})

module.exports = Game;