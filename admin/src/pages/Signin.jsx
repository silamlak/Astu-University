import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../api/features/auth";
import { jwtDecode } from "jwt-decode";
import { useMutation } from "@tanstack/react-query";
import { FaEnvelope, FaLock } from "react-icons/fa";
import Login from "../assets/images/login.svg";
import Logo from "../assets/images/algo.png";
import Loading from "../components/Loading";

const Signin = () => {
  const auth = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  console.log(auth);
  const setChanges = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const loginFunc = async (form) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/college/sign_in",
        form
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { isPending, mutate, isError, error } = useMutation({
    mutationFn: loginFunc,
    onSuccess: (data) => {
      const accessToken = jwtDecode(data.accessToken);
      let decodedToken;

      if (accessToken.user.role) {
        decodedToken = {
          ...accessToken.user,
          role_based: "Department",
        };
      } else {
        decodedToken = {
          ...accessToken.user,
          role_based: "College",
        };
      }

      dispatch(login(decodedToken));
      localStorage.setItem("token", data.accessToken);
      setForm({
        email: "",
        password: "",
      });
      navigate("/", { replace: true });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    mutate(form);
  };

  return (
    <div className="font-bb min-h-screen flex gap-12 items-center justify-center p-4">
      {/* <img
        src={Login}
        className="w-[450px] h-[450px] max-lg:w-[380px] max-lg:h-[400px] max-md:hidden"
      /> */}
      <div className="p-8 rounded shadow-sm w-full border max-w-md">
        <div className="w-full flex justify-center my-6">
          <img src={Logo} className="w-28 h-20" />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Account Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <div className="flex items-center border rounded-lg">
              <FaEnvelope className="mx-2 text-gray-400" />
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter email"
                value={form.email}
                onChange={setChanges}
                className="w-full rounded-lg px-1 bg-slate-50 py-2 border-none outline-none"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <div className="flex items-center border rounded-lg">
              <FaLock className="mx-2 text-gray-400" />
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter password"
                value={form.password}
                onChange={setChanges}
                className="w-full rounded-lg px-1 bg-slate-50 py-2 border-none outline-none"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-fit flex items-center gap-3 px-3 bg-blue-500 text-white py-2 transition duration-75 rounded-lg focus:outline-none hover:bg-blue-600"
          >
            <p>Submit</p>
            {isPending && <Loading />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signin;
