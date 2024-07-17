import React, { useState } from "react";
import axios from "axios";
import { API } from "../utility";
import { useMutation } from "@tanstack/react-query";
import Loading from "../components/Loading";
import toast from "react-hot-toast";

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

  const addDepartment = async (formData) => {
    try {
      const response = await axios.post(
        `${API}/college/add/department`,
        formData
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error adding department: ", error);
      alert("Error adding department. Please try again.");
    }
  };

  const { isPending, mutate } = useMutation({
    mutationFn: addDepartment,
    onSuccess: (data) => {
      setForm({
        name: "",
        description: "",
      });
      toast.success("New Department Added");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    mutate(form);
  };

  return (
    <div className="">
      <div className="w-full flex justify-center my-6">
        <p className="font-semibold text-lg mb-4 p-2 w-fit rounded-lg border border-green-400 bg-green-100 text-green-700 text-center">
          <span className="text-xl font-serif">! </span>Hello, Welcome College
          Officer to add Departments. You must fill all fields.
        </p>
      </div>
      <div className="max-w-xl mx-auto my-8 p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-10">
          Add Department
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-white">
              Department
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Example.... Computer Science"
              className="mt-1 block w-full px-3 py-2 border bg-slate-50 dark:bg-gray-800 border-gray-300 rounded-lg focus:outline-none"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-white">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="mt-1 block w-full px-3 py-2 bg-slate-50 dark:bg-gray-800 border border-gray-300 rounded-md focus:outline-none"
              required
            ></textarea>
          </div>

          <div className="mt-6">
            <button
              disabled={isPending}
              type="submit"
              className="flex items-center gap-3 w-contain text-white text-lg focus:outline-none py-2 px-4 border bg-indigo-500  transition duration-75 rounded-lg"
            >
              <p>Add Department</p>
              {isPending && <Loading />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDepartment;
