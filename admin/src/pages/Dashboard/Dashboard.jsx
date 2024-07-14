import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const auth = useSelector((state) => state.auth.user)
  console.log(auth)
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <p>Welcome to the {auth.role_based} dashboard.</p>
    </div>
  );
}

export default Dashboard
