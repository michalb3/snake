import React from 'react';
import { ConfigContext } from '../../context.js';
import './index.css';

function Square(props) {
  const { sideOfSquare } = props;
  const { top, left } = props.position;
  const className = 'square';
  const classList = className.split();
  props.className && classList.push(props.className);

  return (
    <div
      className={ classList.join(' ') }
      style={ {
        top: top,
        left: left,
        width: sideOfSquare,
        height: sideOfSquare,
      } }
    />
  );
}

export default props => (
  <ConfigContext.Consumer>
    { config =>
      <Square
        { ...props }
        sideOfSquare={ config.sideOfSquare }
      />
    }
  </ConfigContext.Consumer>
);
