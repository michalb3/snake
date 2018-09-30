import React from 'react';
import './index.css';

function Points(props) {
  return (
    <p className="points">Points:
      <span className="points__quantity">
        { props.points }
      </span>
    </p>
  );
}

export default Points;
