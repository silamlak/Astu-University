import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaEnvelope, FaLock } from "react-icons/fa";
import Loading from "../../components/Loading";
import { API } from "../../utility";

const CreateStudent = () => {
  const auth = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    applyied_id: "",
    from: "",
    to: "",
    file: null,
  });

  // Fetch usernames
  const fetchUsernames = async () => {
    try {
      const response = await axios.get(`${API}/college/list/student`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to fetch usernames");
    }
  };

  const { data: usernames, isLoading: isUsernamesLoading } = useQuery({
    queryKey: ["userlist"],
    queryFn: fetchUsernames,
  });

  const setChanges = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm({
        ...form,
        [name]: files[0],
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const loginFunc = async (form) => {
    try {
      // Create a FormData object to handle file uploads
      const formData = new FormData();
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("applyied_id", form.applyied_id);
      formData.append("from", form.from);
      formData.append("to", form.to);
      if (form.file) {
        formData.append("file", form.file);
      }

      const response = await axios.post(
        `${API}/college/add/student`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to create student");
    }
  };

  const { isLoading, mutate, isError, error } = useMutation({
    mutationFn: loginFunc,
    onSuccess: (data) => {
      toast.success(data.message);
      navigate("/students", { replace: true });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Email validation regex for example@aastu.edu.et pattern
    const emailPattern = /^[a-zA-Z0-9._%+-]+@aastu\.edu\.et$/;

    if (!emailPattern.test(form.email)) {
      toast.error("Email must be in the format example@aastu.edu.et");
      return;
    }

    mutate(form);
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="font-bb min-h-screen flex gap-12 items-center justify-center p-4 bg-white dark:bg-gray-900 transition-colors">
      <div className="p-8 rounded-md w-full shadow-md max-w-md bg-white dark:bg-gray-800 transition-colors">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white transition-colors">
          Create Account For a Student
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="username"
              className="block text-gray-700 dark:text-gray-300 transition-colors"
            >
              Username
            </label>
            <div className="flex items-center dark:bg-gray-700 border rounded-lg dark:border-gray-700 transition-colors">
              {isUsernamesLoading ? (
                <Loading />
              ) : (
                <select
                  name="applyied_id"
                  id="username"
                  value={form.applyied_id}
                  onChange={setChanges}
                  className="w-full rounded-lg bg-gray-50 text-gray-950 px-1 dark:bg-gray-700 dark:text-gray-200 py-2 border-none outline-none transition-colors"
                  required
                >
                  <option value="" disabled>
                    Select Username
                  </option>
                  {usernames.map((username) => (
                    <option key={username._id} value={username._id}>
                      {username.first_name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-gray-700 dark:text-gray-300 transition-colors"
            >
              Email
            </label>
            <div className="flex items-center dark:bg-gray-700 border rounded-lg dark:border-gray-700 transition-colors">
              <FaEnvelope className="mx-2 text-gray-400 dark:text-gray-500 transition-colors" />
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Create email"
                value={form.email}
                onChange={setChanges}
                className="w-full rounded-lg bg-gray-50 text-gray-950 px-1 dark:bg-gray-700 dark:text-gray-200 py-2 border-none outline-none transition-colors"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 dark:text-gray-300 transition-colors"
            >
              Password
            </label>
            <div className="flex items-center dark:bg-gray-700 border rounded-lg dark:border-gray-700 transition-colors">
              <FaLock className="mx-2 text-gray-400 dark:text-gray-500 transition-colors" />
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Create password"
                value={form.password}
                onChange={setChanges}
                className="w-full rounded-lg bg-gray-50 text-gray-950 px-1 dark:bg-gray-700 dark:text-gray-200 py-2 border-none outline-none transition-colors"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="from"
              className="block text-gray-700 dark:text-gray-300 transition-colors"
            >
              From
            </label>
            <div className="flex items-center dark:bg-gray-700 border rounded-lg dark:border-gray-700 transition-colors">
              <input
                type="date"
                name="from"
                id="from"
                value={form.from}
                onChange={setChanges}
                min={today} // Ensure date cannot be before today
                className="w-full rounded-lg px-1 bg-gray-50 text-gray-950 dark:bg-gray-700 dark:text-gray-200 py-2 border-none outline-none transition-colors"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="to"
              className="block text-gray-700 dark:text-gray-300 transition-colors"
            >
              To
            </label>
            <div className="flex items-center dark:bg-gray-700 border rounded-lg dark:border-gray-700 transition-colors">
              <input
                type="date"
                name="to"
                id="to"
                value={form.to}
                onChange={setChanges}
                min={today} // Ensure date cannot be before today
                className="w-full rounded-lg px-1 bg-gray-50 text-gray-950 dark:bg-gray-700 dark:text-gray-200 py-2 border-none outline-none transition-colors"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="file"
              className="block text-gray-700 dark:text-gray-300 transition-colors"
            >
              Agreement File
            </label>
            <div className="flex items-center dark:bg-gray-700 border rounded-lg dark:border-gray-700 transition-colors">
              <input
                type="file"
                name="file"
                accept=".pdf"
                id="file"
                onChange={setChanges}
                className="w-full rounded-lg px-1 bg-gray-50 text-gray-950 dark:bg-gray-700 dark:text-gray-200 py-2 border-none outline-none transition-colors"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-fit flex items-center gap-3 px-3 bg-blue-500 dark:bg-blue-600 text-white py-2 transition duration-75 rounded-lg focus:outline-none hover:bg-blue-600 dark:hover:bg-blue-700"
          >
            <p>Submit</p>
            {isLoading && <Loading />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateStudent;
