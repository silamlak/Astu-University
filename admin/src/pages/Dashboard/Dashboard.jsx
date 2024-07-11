import React from 'react'
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <p>Welcome to the admin dashboard.</p>
      <Link to='/d/application/list'>go</Link>
    </div>
  );
}

export default Dashboard
