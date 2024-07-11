import React, { useState } from "react";
import axios from 'axios'
const Dashboard = () => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    department: "",
    phone_no: "",
    attached_file: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setForm((prevForm) => ({
      ...prevForm,
      attached_file: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/applicant/apply",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      // Clear the form after successful submission
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        department: "",
        phone_no: "",
        attached_file: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 mt-10 border">
      <h2 className="text-2xl font-bold mb-6">Application Form</h2>
      <form
        onSubmit={handleSubmit}
        className=" grid grid-cols-2 gap-4 max-md:grid-cols-1"
      >
        <div className="mb-4">
          <label className="block text-gray-700">First Name</label>
          <input
            type="text"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300  rounded-lg focus:outline-none bg-gray-50 mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none bg-gray-50 mt-1"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300  rounded-lg focus:outline-none bg-gray-50 mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Department</label>
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300  rounded-lg focus:outline-none bg-gray-50 mt-1"
            required
          >
            <option value="">Select Department</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">
              Information Technology
            </option>
            <option value="Cyber Security">Cyber Security</option>
            <option value="Software Engineering">Software Engineering</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Phone Number</label>
          <input
            type="text"
            name="phone_no"
            value={form.phone_no}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300  rounded-lg focus:outline-none bg-gray-50 mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Attach File</label>
          <input
            type="file"
            name="attached_file"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300  rounded-lg focus:outline-none bg-gray-50 mt-1"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-4 rounded-lg w-24 text-center"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Dashboard
