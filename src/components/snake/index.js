import React, { Component } from 'react';
import { ConfigContext } from '../../context.js';
import Square from '../square';

class Snake extends Component {
  constructor(props) {
    super(props);

    this.state = {
      snake: null,
    };

    this.sideOfSquare = props.sideOfSquare;
    this.snakeInitLength = props.snakeInitLength;
    this.keyCodes = [this.randomKeyCode()];
    this.moveSnake = this.moveSnake.bind(this);
  }

  componentDidMount() {
    this.setSnake();

    window.addEventListener(
      'keydown',
      (event) => this.keyDownListener(event)
    );

    window.addEventListener(
      'touchstart',
      (event) => this.touchStartListener(event)
    );

    this.interval = setInterval(this.moveSnake, 90);
  }

  componentWillUnmount() {
    window.removeEventListener(
      'keydown',
      (event) => this.keyDownListener(event)
    );

    window.removeEventListener(
      'touchstart',
      (event) => this.touchStartListener(event)
    );

    clearInterval(this.interval);
  }

  keyDownListener(event) {
    const { keyCode } = event;

    if (37 <= keyCode &&
        40 >= keyCode
    ) {
      if (2 !== Math.abs(this.keyCodes[0] - keyCode) && // Direct reversing is not allowed
          keyCode !== this.keyCodes[0] && // The next move must be different than the current one
          3 > this.keyCodes.length // The "keyCodes" queue can contain max three next moves
      ) {
        this.keyCodes.push(keyCode);
      }
    }
  }

  touchStartListener(event) {
    const snake = this.state.snake;
    const head = snake[snake.length - 1];
    const keyCode = this.keyCodes[0];
    const { clientX, clientY } = event.touches[0];

    if (37 === keyCode ||
        39 === keyCode
    ) {
      if (clientY <= head.top) {
        this.keyCodes.push(38);
      } else {
        this.keyCodes.push(40);
      }
    }

    else if (38 === keyCode ||
             40 === keyCode
    ) {
      if (clientX <= head.left) {
        this.keyCodes.push(37);
      } else {
        this.keyCodes.push(39);
      }
    }
  }

  randomKeyCode() {
    const minKeyCode = 37;
    const maxKeyCode = 40;

    // Return a random key code in the range of from { minKeyCode } to { maxKeyCode }
    return Math.floor(Math.random() * (maxKeyCode - minKeyCode + 1)) + minKeyCode;
  }

  getKeyCode() {
    if (1 === this.keyCodes.length) {
      return this.keyCodes[0];
    } else if (1 < this.keyCodes.length) {
      return this.keyCodes.shift();
    }

    return;
  }

  getSnake() {
    const { snake } = this.state;

    return snake.map(square => {
      return <Square
        key={ square.id }
        className="square--snake"
        position={ {
          top: square.top,
          left: square.left,
        } }
      />;
    });
  }

  setSnake() {
    const snake = Array(this.snakeInitLength).fill(null);
    const { top, left } = this.props.getRandomPosition();

    snake.forEach((item, index) => {
      snake[index] = {
        id: index,
        top: top,
        left: left,
      };
    });

    this.setState({
      snake: snake,
    });
  }

  moveSquare(square, keyCode) {
    switch(keyCode) {
      case 37:
        square.left -= this.sideOfSquare;
      break;
      case 38:
        square.top -= this.sideOfSquare;
      break;
      case 39:
        square.left += this.sideOfSquare;
      break;
      case 40:
        square.top += this.sideOfSquare;
      break;
      default:
      break;
    }
  }

  moveSnake() {
    const keyCode = this.getKeyCode();
    const { boardDimensions, foodPosition } = this.props;
    let snake = this.state.snake.slice();
    let head = snake[snake.length - 1];
    let tail = snake[0];

    // Move each the snake's square in the place of the next one
    snake.forEach((value, index) => {
      if (value.id !== head.id) {
        value.top = snake[index + 1].top;
        value.left = snake[index + 1].left;
      }
    });

    // Move the snake's head
    this.moveSquare(head, keyCode);

    // If necessary, correct the snake's head position
    if (0 > head.top) {
      head.top = boardDimensions.height - this.sideOfSquare;
    } else if (head.top > boardDimensions.height - this.sideOfSquare) {
      head.top = 0;
    }

    if (0 > head.left) {
      head.left = boardDimensions.width - this.sideOfSquare;
    } else if (head.left > boardDimensions.width - this.sideOfSquare) {
      head.left = 0;
    }

    // Check if a user scored a point
    if (head.top === foodPosition.top &&
        head.left === foodPosition.left
    ) {
      tail = {
        id: head.id + 1,
        top: tail.top,
        left: tail.left,
      };

      // Add the new tail to the snake's array
      snake.unshift(tail);

      // Random a new food position
      this.props.randomFoodPosition();

      // Pass the points to the parent component
      this.props.setPoints(snake.length - this.snakeInitLength);
    }

    // Update the snake's state
    this.setState({
      snake: snake,
    });

    // Check if the game is over
    snake.forEach(value => {
      if (value.id !== head.id &&
          head.top === value.top &&
          head.left === value.left
      ) {
        clearInterval(this.interval);
        this.props.gameOver();
      }
    });
  }

  render() {
    if (this.state.snake) {
      return (
        <div className="snake">
          { this.getSnake() }
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
      <Snake
        { ...props }
        sideOfSquare={ config.sideOfSquare }
        snakeInitLength={ config.snakeInitLength }
      />
    }
  </ConfigContext.Consumer>
);
