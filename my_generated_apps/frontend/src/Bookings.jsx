import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Bookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/bookings')
      .then(response => {
        setBookings(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h1>Bookings</h1>
      <ul>
        {bookings.map(booking => (
          <li key={booking.id}>{booking.user_id} - {booking.book_id}</li>
        ))}
      </ul>
    </div>
  );
}

export default Bookings;