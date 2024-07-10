import React, { useState } from "react";
import axios from "axios";
import { API } from "../utility";

const AddDepartmentOffice = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone_no: "",
    department: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/college/add/department_officer`, form); // Adjust API endpoint accordingly
      console.log(res.data)
      setForm({
        name: "",
        email: "",
        password: "",
        phone_no: "",
        department: "",
      });
    } catch (error) {
      console.error("Error adding department office: ", error);
      alert("Error adding department office. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">Add Department Office</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Name:
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Email:
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Password:
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Phone Number:
          </label>
          <input
            type="text"
            name="phone_no"
            value={form.phone_no}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Department:
          </label>
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            required
          >
            <option value="">Select Department</option>
            <option value="Department A">Department A</option>
            <option value="Department B">Department B</option>
            {/* Add more options as needed */}
          </select>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
          >
            Add Department Office
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDepartmentOffice;
