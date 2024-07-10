import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../api/features/auth";
import { jwtDecode } from "jwt-decode";

const Signin = () => {
  const auth = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "",
  });
  console.log(auth);
  const setChanges = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/college/sign_in",
        form
      );
      const accessToken = jwtDecode(response.data.accessToken);
      const decodedToken = {
        ...accessToken.user,
        role_based: form.role,
      };
      dispatch(login(decodedToken));
      setForm({
          email: "",
          password: "",
          role: "",
        });
       navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter email"
              value={form.email}
              onChange={setChanges}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter password"
              value={form.password}
              onChange={setChanges}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block text-gray-700">
              Role
            </label>
            <select
              name="role"
              id="role"
              value={form.role}
              onChange={setChanges}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="" disabled>
                select role
              </option>
              <option value="College">College</option>
              <option value="Department">Department</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded focus:outline-none hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signin;
