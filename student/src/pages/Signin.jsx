import React, { useState } from "react";
import Logo from "../assets/algo.png";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { login } from "../api/features/authSlice";
import { API_STUDENT } from "../Services/utility";
import Loading from "../components/Loading";
import Switcher from "../components/Switcher";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

const Signin = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
const navigate = useNavigate()
  const dispatch = useDispatch();

  const loginFun = async (form) => {
    try {
      const res = await axios.post(`${API_STUDENT}/student/signin`, form);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const changeState = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => loginFun(form),
    onSuccess: (data) => {
      dispatch(login(data));
      setForm({
        email: "",
        password: "",
      })
      navigate("/", {replace: true})
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate();
  }

  return (
    <div>
      <section className="bg-gray-50 dark:bg-gray-900 flex w-full justify-center min-h-screen items-center">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            <img className="w-16 h-16 mr-2" src={Logo} alt="logo" />
            AASTU
          </div>
          <div className="hidden">
            <Switcher />
          </div>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl w-[500px] max-md:max-w-[300px] font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={handleSubmit}
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={form.email}
                    onChange={changeState}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@aastu.edu.et"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    onChange={changeState}
                    value={form.password}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center bg-blue-700 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  <p>Sign in</p>
                  {isPending && <Loading />}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Signin;
