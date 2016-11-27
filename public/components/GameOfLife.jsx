// CIS 197 - React HW

var _ = require('lodash');
var React = require('react');
var PropTypes = React.PropTypes;
var Cell = require('./Cell.jsx');
var actions = require('../actions/index.js');
var initialState = require('../initialState.js');

var GameOfLife = React.createClass({
  propTypes: {
    store: React.PropTypes.object.isRequired
  },
  
  // Here we subscribe to changes in the store data and update
  // the React component's state by using `store.getState()`.
  // Technically this is non-standard architecture, but we need to
  // organize things this way for the sake of the game's performance.
  // NOTE: further down in the render function, you will need to
  //       access this.state.cells and this.state.x and this.state.y.
  //       For these attributes, be sure to use this.state and not this.props.
  componentDidMount: function () {
    this.props.store.subscribe(function () {
      this.setState(this.props.store.getState());
    }.bind(this));
  },

  getInitialState: function () {
    return initialState;
  },

  onImportSeed: function (seedName) {
    this.props.store.dispatch(actions.importSeed(seedName));
  },

  run: function () {
    this.props.store.dispatch(actions.run());
  },

  step: function () {
    this.props.store.dispatch(actions.step());
  },

  stop: function () {
    this.props.store.dispatch(actions.stop());
  },

  clear: function () {
    this.props.store.dispatch(actions.clear());
  },

  export: function () {
    this.props.store.dispatch(actions.export());
  },

  randomSeed: function () {
    this.props.store.dispatch(actions.randomSeed());
  },

  glider: function () {
    this.onImportSeed('GLIDER');
  },

  gliderGun: function () {
    this.onImportSeed('GLIDER_GUN');
  },

  acorn: function () {
    this.onImportSeed('ACORN');
  },

  line: function () {
    this.onImportSeed('LINE');
  },

  // TODO: here you'll want to implement the functions that get called
  //       when various actions (such as button clicks) occur in thie view.
  //       These functions should, like onImportSeed above, dispatch the
  //       appropriate actions using the Redux store prop.

  // TODO: Generate the following HTML structure:
  // <div class="game-component">
  //   <div class="board-component" style="width=900px">
  //     <span class="cell-widget cell"></span>
  //     <span class="cell-widget cell"></span>
  //     <span class="cell-widget cell alive "></span>
  //      ...remaining cells
  //   </div>
  //   <div class="controls">
  //     <h4>Controls</h4>
  //     <button>run</button>
  //     <button>step</button>
  //     <button>stop</button>
  //     <button>clear</button>
  //     <button>export</button>
  //   </div>
  //   <div class="seeds">
  //     <button>glider</button>
  //     <button>glider gun</button>
  //     <button>acorn</button>
  //     <button>line</button>
  //     <button>random</button>
  //   </div>
  // </div>
  //
  // HINT: Use the `onClick` prop on your buttons to register click callbacks!
  // NOTE: Please make sure your button text matches the button text above,
  //       as this is necessary for the test suite.
  //       (e.g. your 'step' button should have button text 'step',
  //        and your 'glider gun' button should have button text 'glider gun')
  // HINT: Remember to pass the store as a prop of each <Cell> component
  // HINT: Remember that the application state's `x`, `y`, and `cells` values
  //       are located in this.state and not this.props.
  render: function () {

    var cells = [];

    for (var i = 0; i < this.state.cells.length; i++) {
      cells.push(<Cell key={i} alive={this.state.cells[i]} store={this.props.store}></Cell>);
    }

    return (
    <div className="game-component">
      <div className="board-component" style={{"width": "900px"}}>
        {cells}
      </div>
      <div className="controls">
        <h4>Controls</h4>
        <button onClick={this.run}>run</button>
        <button onClick={this.step}>step</button>
        <button onClick={this.stop}>stop</button>
        <button onClick={this.clear}>clear</button>
        <button onClick={this.export}>export</button>
      </div>
      <div className="seeds">
        <button onClick={this.glider}>glider</button>
        <button onClick={this.gliderGun}>glider gun</button>
        <button onClick={this.acorn}>acorn</button>
        <button onClick={this.line}>line</button>
        <button onClick={this.randomSeed}>random</button>
      </div>
    </div>
    );
  }
});

module.exports = GameOfLife;