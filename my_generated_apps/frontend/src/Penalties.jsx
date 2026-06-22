import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Penalties() {
  const [penalties, setPenalties] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/penalties')
      .then(response => {
        setPenalties(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h1>Penalties</h1>
      <ul>
        {penalties.map(penalty => (
          <li key={penalty.id}>{penalty.penalty_amount}</li>
        ))}
      </ul>
    </div>
  );
}

export default Penalties;