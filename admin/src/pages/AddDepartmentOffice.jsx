import React, { useState } from "react";
import axios from "axios";
import { API } from "../utility";
import { useMutation } from "@tanstack/react-query";
import Loading from "../components/Loading";
import toast from "react-hot-toast";

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

  const addOfficer = async () => {
    try {
      const res = await axios.post(
        `${API}/college/add/department_officer`,
        form
      );
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.error("Error adding department office: ", error);
      alert("Error adding department office. Please try again.");
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: addOfficer,
    onSuccess: (data) => {
      console.log(data);
      setForm({
        name: "",
        email: "",
        password: "",
        phone_no: "",
        department: "",
      });
      toast.success("New Department Officer Added");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    mutate();
  };

  return (
    <div className="max-w-xl mx-auto font-bb my-8 p-6 bg-white dark:bg-gray-900 shadow-lg dark:shadow-2xl rounded-md">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Add Department Office
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-white">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border bg-slate-50 dark:bg-gray-800 border-gray-300 rounded-lg focus:outline-none"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-white">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border bg-slate-50 dark:bg-gray-800 border-gray-300 rounded-lg focus:outline-none"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-white">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border bg-slate-50 dark:bg-gray-800 border-gray-300 rounded-lg focus:outline-none"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-white">
            Phone Number
          </label>
          <input
            type="text"
            name="phone_no"
            value={form.phone_no}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border bg-slate-50 dark:bg-gray-800 border-gray-300 rounded-lg focus:outline-none"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-white">
            Department
          </label>
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border bg-slate-50 dark:bg-gray-800 border-gray-300 rounded-lg focus:outline-none"
            required
          >
            <option value="">Select Department</option>
            <option value="Computer Science">Biotechnology</option>
            <option value="Information Technology">Food Science</option>
            <option value="Cyber Security">Applied Nutrition</option>
            <option value="Software Engineering">Industrial Chemistry</option>
            <option value="Software Engineering">Geology</option>
            <option value="Software Engineering">
              Maths/Physics/Statistics
            </option>
          </select>
        </div>

        <div className="mt-6">
          <button
            disabled={isPending}
            type="submit"
            className="w-contain flex gap-3 items-center text-white focus:outline-none py-2 px-4 border bg-indigo-500 transition duration-75 rounded-lg"
          >
            <p>Add Department Office</p>
            {isPending && <Loading />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDepartmentOffice;
