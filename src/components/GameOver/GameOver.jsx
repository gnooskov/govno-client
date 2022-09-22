import React from 'react';
import { Link } from 'react-router-dom';

export const GameOver = ({ loserName }) => {
  return (  
    <div>
      <h1>Говно затопило {loserName}</h1>
      <Link to='/'>
        <button>К списку игр</button>
      </Link>
    </div>
  )
}
