import React from 'react'
import { useSelector } from 'react-redux';

const Dashboard = () => {
    const user = useSelector((state) => state.auth.user)
    console.log(user)
  return (
    <div className="text-center text-3xl font-serif mt-20 text-slate-700 dark:text-slate-100">
      Welcome to the Student Portal Page!
    </div>
  );
}

export default Dashboard
