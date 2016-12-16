

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
    } else if (e.keyCode == 38) {
      this.props.store.dispatch(actions.rotate());
    }
  },

	render: function () {
		var cells = [];

		for (var i = 0; i < 200; i++) {
			cells.push(<Cell key={i} index={i} color={this.state.cellColor[i]} store={this.props.store}></Cell>);
		}

    var nextBlock;

    switch(this.state.nextBlockColor) {
      case 1:
        nextBlock = 'I block';
        break;

      case 2:
        nextBlock = 'O block';
        break;

      case 3:
        nextBlock = 'T block';
        break;

      case 4:
        nextBlock = 'J block';
        break;

      case 5:
        nextBlock = 'L block';
        break;

      case 6:
        nextBlock = 'Z block';
        break;

      case 7:
        nextBlock = 'S block';
        break;
    }

    console.log(this.state.nextBlockColor);

		return(
		  <div className="game-board">
        <div align="center">
          <button className="scoreBlock">Score: {this.state.score}</button>
          <button className="scoreBlock">Combo: {this.state.combo}</button>
          <button className="scoreBlock">Next: {nextBlock}</button>
        </div>
        <div className="board-component">
          {cells}
        </div>
        <div className="start" align="center">
          <button onClick={this.run}>Start Game</button>
          <button onKeyDown={this.keyboardEvent}>Controls</button>
          <button onClick={this.stop}>Stop Game</button>
        </div>
		  </div>
		);
	}
})

module.exports = Game;