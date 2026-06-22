import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [habits, setHabits] = useState([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitDescription, setNewHabitDescription] = useState('');

  useEffect(() => {
    axios.get('/habits').then(response => {
      setHabits(response.data);
    });
  }, []);

  const handleCreateHabit = () => {
    axios.post('/habits', {
      name: newHabitName,
      description: newHabitDescription
    }).then(response => {
      setHabits([...habits, response.data]);
      setNewHabitName('');
      setNewHabitDescription('');
    });
  };

  const handleCompleteHabit = (habitId) => {
    axios.patch(`/habits/${habitId}/complete`, {
      date: new Date().toISOString().split('T')[0]
    }).then(response => {
      setHabits(habits.map(habit => habit.id === habitId ? { ...habit, completed: true } : habit));
    });
  };

  return (
    <div className="container mx-auto p-4 pt-6 mt-10">
      <h1 className="text-3xl font-bold mb-4">Daily Habit Tracker</h1>
      <form onSubmit={(e) => { e.preventDefault(); handleCreateHabit(); }}>
        <input type="text" value={newHabitName} onChange={(e) => setNewHabitName(e.target.value)} placeholder="Habit name" className="w-full p-2 mb-2 border border-gray-400 rounded" />
        <input type="text" value={newHabitDescription} onChange={(e) => setNewHabitDescription(e.target.value)} placeholder="Habit description" className="w-full p-2 mb-4 border border-gray-400 rounded" />
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Create Habit</button>
      </form>
      <ul>
        {habits.map(habit => (
          <li key={habit.id} className="flex justify-between mb-4">
            <span>{habit.name} - {habit.description}</span>
            <button onClick={() => handleCompleteHabit(habit.id)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">{habit.completed ? 'Completed' : 'Complete'}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;