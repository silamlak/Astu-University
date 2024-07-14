import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaPaperclip,
  FaBook,
  FaArrowRight,
  FaPaperPlane,
} from "react-icons/fa";
import Form from "./assets/image/form.svg";
import Curve from "./assets/image/curve.png";
import Loading from "./component/Loading";

const Dashboard = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    department: "",
    phone_no: "",
    attached_file: "",
  });
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
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
      setIsLoading(false);
       navigate("/confirmation", { state: response.data });
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 my-20 ">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-row-reverse  justify-center items-center gap-20 max-xl:gap-14 max-lg:gap-4">
          <img src={Form} className="w-[400px] h-[400px] max-md:hidden" />
          <form onSubmit={handleSubmit} className="p-6 shadow-md rounded-xl">
            <div className="relative">
              <h2 className="relative text-2xl text-center font-bold mb-12">
                Application Form
              </h2>
              <img
                src={Curve}
                className="absolute left-1/2 transform -translate-x-1/2 -bottom-2 h-4"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
              <div className="mb-4 relative">
                <label className="block text-gray-700">First Name</label>
                <div className="flex items-center">
                  <span className="absolute pl-3 text-gray-400">
                    <FaUser />
                  </span>
                  <input
                    type="text"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:outline-none bg-gray-50 mt-1"
                    required
                  />
                </div>
              </div>
              <div className="mb-4 relative">
                <label className="block text-gray-700">Last Name</label>
                <div className="flex items-center">
                  <span className="absolute pl-3 text-gray-400">
                    <FaUser />
                  </span>
                  <input
                    type="text"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:outline-none bg-gray-50 mt-1"
                    required
                  />
                </div>
              </div>
              <div className="mb-4 relative">
                <label className="block text-gray-700">Email</label>
                <div className="flex items-center">
                  <span className="absolute pl-3 text-gray-400">
                    <FaEnvelope />
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:outline-none bg-gray-50 mt-1"
                    required
                  />
                </div>
              </div>
              <div className="mb-4 relative">
                <label className="block text-gray-700">Department</label>
                <div className="flex items-center">
                  <span className="absolute pl-3 text-gray-400">
                    <FaBook />
                  </span>
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:outline-none bg-gray-50 mt-1"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">
                      Information Technology
                    </option>
                    <option value="Cyber Security">Cyber Security</option>
                    <option value="Software Engineering">
                      Software Engineering
                    </option>
                  </select>
                </div>
              </div>
              <div className="mb-4 relative">
                <label className="block text-gray-700">Phone Number</label>
                <div className="flex items-center">
                  <span className="absolute pl-3 text-gray-400">
                    <FaPhone />
                  </span>
                  <input
                    type="text"
                    name="phone_no"
                    value={form.phone_no}
                    onChange={handleChange}
                    className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:outline-none bg-gray-50 mt-1"
                    required
                  />
                </div>
              </div>
              <div className="mb-4 relative">
                <label className="block text-gray-700">Attach File</label>
                <div className="flex items-center">
                  <span className="absolute pl-3 text-gray-400">
                    <FaPaperclip />
                  </span>
                  <input
                    type="file"
                    name="attached_file"
                    onChange={handleFileChange}
                    className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:outline-none bg-gray-50 mt-1"
                    required
                  />
                </div>
              </div>
            </div>
            <button
              disabled={isLoading}
              type="submit"
              className="group flex items-center justify-center gap-4 bg-blue-700 hover:bg-blue-700 hover:font-bb transition-all duration-150 text-white border border-blue-700 py-2 px-4 rounded-lg text-center"
            >
              <p className="tracking-wider">Submit</p>
              {isLoading ? (
                <Loading color="ffffff" />
              ) : (
                <FaArrowRight className="text-sm" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
