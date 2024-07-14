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
    <div className="max-w-xl mx-auto my-8 p-6 bg-white border">
      <h2 className="text-xl font-semibold mb-4">Add Department</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Department:
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border bg-slate-50 border-gray-300 rounded-lg focus:outline-none"
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
            className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-md focus:outline-none"
            required
          ></textarea>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-contain text-slate-950 focus:outline-none   py-2 px-4 border border-indigo-500 rounded-lg"
          >
            Add Department
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDepartment;
