import React, { Component } from 'react';
import { ConfigContext } from '../../context.js';
import Snake from '../snake';
import Square from '../square';
import Points from '../points';
import './index.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      boardDimensions: null,
      foodPosition: null,
      amountOfPoints: 0,
    };

    this.sideOfSquare = props.sideOfSquare;
    this.randomFoodPosition = this.randomFoodPosition.bind(this);
    this.windowResizeListener = this.windowResizeListener.bind(this);
    this.getRandomPosition = this.getRandomPosition.bind(this);
    this.setPoints = this.setPoints.bind(this);
    this.gameOver = this.gameOver.bind(this);
  }

  componentDidMount() {
    this.setBoardDimensions();
    this.randomFoodPosition();

    window.addEventListener(
      'resize',
      this.windowResizeListener
    );
  }

  componentWillUnmount() {
    window.removeEventListener(
      'resize',
      this.windowResizeListener
    );
  }

  windowResizeListener() {
    this.setBoardDimensions();
    const { boardDimensions, foodPosition } = this.state;
    const maxTop = boardDimensions.height - this.sideOfSquare;
    const maxLeft = boardDimensions.width - this.sideOfSquare;
    const newFoodPosition = Object.assign({}, foodPosition);

    // If necessary, change the position of the food
    if (foodPosition.top > maxTop) {
      newFoodPosition.top = maxTop;
    }

    if (foodPosition.left > maxLeft) {
      newFoodPosition.left = maxLeft;
    }

    if (newFoodPosition.top !== foodPosition.top ||
        newFoodPosition.left !== foodPosition.left
    ) {
      this.setState({
        foodPosition: newFoodPosition,
      });
    }
  }

  setBoardDimensions() {
    const { boardDimensions } = this.state;
    const { innerWidth, innerHeight } = window;
    const boardWidth = Math.floor(innerWidth / this.sideOfSquare) * this.sideOfSquare;
    const boardHeight = Math.floor(innerHeight / this.sideOfSquare) * this.sideOfSquare;

    if (!boardDimensions ||
        boardWidth !== boardDimensions.width ||
        boardHeight !== boardDimensions.height
    ) {
      this.setState({
        boardDimensions: {
          width: boardWidth,
          height: boardHeight,
        },
      });
    }
  }

  getRandomPosition() {
    const { innerWidth, innerHeight } = window;
    const maxTop = Math.floor(innerHeight / this.sideOfSquare) - this.sideOfSquare;
    const maxLeft = Math.floor(innerWidth / this.sideOfSquare) - this.sideOfSquare;

    return {
      // Random a number in the range of from 0 to { maxTop * this.sideOfSquare }
      top: Math.floor(Math.random() * (maxTop + 1)) * this.sideOfSquare,
      // Random a number in the range of from 0 to { maxLeft * this.sideOfSquare }
      left: Math.floor(Math.random() * (maxLeft + 1)) * this.sideOfSquare,
    };
  }

  randomFoodPosition() {
    const { foodPosition } = this.state;
    const { top, left } = this.getRandomPosition();

    if (!foodPosition ||
        top !== foodPosition.top ||
        left !== foodPosition.left
    ) {
      this.setState({
        foodPosition: {
          top: top,
          left: left,
        },
      });
    }
  }

  setPoints(points) {
    const { amountOfPoints } = this.state;

    if (points !== amountOfPoints) {
      this.setState({
        amountOfPoints: points,
      });
    }
  }

  gameOver() {
    const { amountOfPoints } = this.state;
    let notice = `Game Over!\nYou scored ${ amountOfPoints } `;

    if (1 === amountOfPoints) {
      notice += 'point.';
    } else {
      notice += 'points.';
    }

    notice += '\nDo you want to start again?';

    if (window.confirm(notice)) {
      window.location.reload();
    }
  }

  render() {
    const { boardDimensions } = this.state;

    if (boardDimensions) {
      return (
        <div
          className="board"
          style={ boardDimensions }
        >
          <Snake
            getRandomPosition={ this.getRandomPosition }
            boardDimensions={ this.state.boardDimensions }
            foodPosition={ this.state.foodPosition }
            randomFoodPosition={ this.randomFoodPosition }
            setPoints={ this.setPoints }
            gameOver={ this.gameOver }
          />
          <Square
            className="square--food"
            position={ this.state.foodPosition }
          />
          <Points points={ this.state.amountOfPoints } />
        </div>
      );
    } else {
      return '';
    }
  }
}

export default props => (
  <ConfigContext.Consumer>
    { config =>
      <App
        { ...props }
        sideOfSquare={ config.sideOfSquare }
      />
    }
  </ConfigContext.Consumer>
);
