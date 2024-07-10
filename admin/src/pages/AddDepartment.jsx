import React, { useState } from "react";
import axios from "axios";
import { API } from "../utility";

const AddDepartment = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
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
      const res = await axios.post(`${API}/college/add/department`, form); // Adjust API endpoint accordingly
      console.log(res.data);
      setForm({
        name: "",
        description: "",
      });
    } catch (error) {
      console.error("Error adding department: ", error);
      alert("Error adding department. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">Add Department</h2>
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
            Description:
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            required
          ></textarea>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
          >
            Add Department
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDepartment;
