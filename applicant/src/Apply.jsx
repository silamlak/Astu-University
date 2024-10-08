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
  FaMapMarkerAlt,
  FaUniversity,
  FaListAlt,
  FaGraduationCap,
} from "react-icons/fa";
import { MdOutlineTitle } from "react-icons/md";
import Form from "./assets/image/form.svg";
import Curve from "./assets/image/curve.png";
import Loading from "./component/Loading";
import { useEffect } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [lists, setLists] = useState()
  const [form, setForm] = useState({
    title: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    gender: '',
    email: "",
    department: "",
    phone_no: "",
    application_type: "",
    level_of_application: "",
    university_name: "",
    university_location: "",
    attached_file: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      const response = await axios.get(
        `https://aastu-edu.onrender.com/api/college/departmet`
      );
      setLists(response.data);
    };
    fetchDepartments()
  })

  const validate = () => {
    const errors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@aastu\.edu\.et$/;

    if (!form.title.trim()) {
      errors.title = "Title is required";
    }
    if (!form.first_name.trim()) {
      errors.first_name = "First Name is required";
    }
    if (!form.middle_name.trim()) {
      errors.middle_name = "Middle Name is required";
    }
    if (!form.last_name.trim()) {
      errors.last_name = "Last Name is required";
    }
    if (!form.gender) {
      errors.gender = "Gender is required";
    }
    if (!form.email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      errors.email = "Email must be in the format 'example@aastu.edu.et'";
    }
    if (!form.department) {
      errors.department = "Department is required";
    }
    if (!form.phone_no.trim()) {
      errors.phone_no = "Phone Number is required";
    }
    if (!form.application_type) {
      errors.application_type = "Application Type is required";
    }
    if (!form.level_of_application) {
      errors.level_of_application = "Level of Application is required";
    }
    if (!form.university_name.trim()) {
      errors.university_name = "University Name is required";
    }
    if (!form.university_location.trim()) {
      errors.university_location = "University Location is required";
    }
    if (!form.attached_file) {
      errors.attached_file = "File attachment is required";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

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
    if (!validate()) return;

    setIsLoading(true);

    try {
      const formData = new FormData();
      for (const key in form) {
        formData.append(key, form[key]);
      }

      const response = await axios.post(
        "https://aastu-edu.onrender.com/api/applicant/apply",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setForm({
        title: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        gender: "",
        email: "",
        department: "",
        phone_no: "",
        application_type: "",
        level_of_application: "",
        university_name: "",
        university_location: "",
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
    <div className="p-8 py-10 bg-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-row-reverse justify-center items-center gap-20 max-xl:gap-14 max-lg:gap-4">
          {/* <img
            src={Form}
            className="w-[400px] h-[400px] max-md:hidden"
            alt="Form"
          /> */}
          <form
            onSubmit={handleSubmit}
            className="p-6 shadow-md bg-white rounded-xl"
          >
            <div className="relative">
              <h2 className="relative text-2xl dark:text-slate-950 text-center font-bold mb-12">
                Application Form
              </h2>
              <img
                src={Curve}
                className="absolute left-1/2 transform -translate-x-1/2 -bottom-2 h-4"
                alt="Curve"
              />
            </div>

            <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-md:grid-cols-1">
              <div className="mb-4 relative">
                <label className="block text-gray-700">Title</label>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <span className="absolute pl-3 text-gray-400">
                      <MdOutlineTitle />
                    </span>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="Engineer"
                      className="w-full pl-10 p-2 border dark:text-slate-950 border-gray-300 rounded-lg focus:outline-none bg-gray-50 mt-1"
                    />
                  </div>
                  {errors.title && (
                    <p className="text-red-500 text-sm">{errors.title}</p>
                  )}
                </div>
              </div>

              <div className="mb-4 relative">
                <label className="block text-gray-700">First Name</label>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <span className="absolute pl-3 text-gray-400">
                      <FaUser />
                    </span>
                    <input
                      type="text"
                      name="first_name"
                      value={form.first_name}
                      onChange={handleChange}
                      className="w-full pl-10 p-2 border dark:text-slate-950 border-gray-300 rounded-lg focus:outline-none bg-gray-50 mt-1"
                    />
                  </div>
                  {errors.first_name && (
                    <p className="text-red-500 text-sm">{errors.first_name}</p>
                  )}
                </div>
              </div>

              <div className="mb-4 relative">
                <label className="block text-gray-700">Middle Name</label>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <span className="absolute pl-3 text-gray-400">
                      <FaUser />
                    </span>
                    <input
                      type="text"
                      name="middle_name"
                      value={form.middle_name}
                      onChange={handleChange}
                      className="w-full pl-10 p-2 border dark:text-slate-950 border-gray-300 rounded-lg focus:outline-none bg-gray-50 mt-1"
                    />
                  </div>
                  {errors.middle_name && (
                    <p className="text-red-500 text-sm">{errors.middle_name}</p>
                  )}
                </div>
              </div>

              <div className="mb-4 relative">
                <label className="block text-gray-700">Last Name</label>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <span className="absolute pl-3 text-gray-400">
                      <FaUser />
                    </span>
                    <input
                      type="text"
                      name="last_name"
                      value={form.last_name}
                      onChange={handleChange}
                      className="w-full pl-10 p-2 border dark:text-slate-950 border-gray-300 rounded-lg focus:outline-none bg-gray-50 mt-1"
                    />
                  </div>
                  {errors.last_name && (
                    <p className="text-red-500 text-sm">{errors.last_name}</p>
                  )}
                </div>
              </div>

              <div className="mb-4 relative">
                <label className="block text-gray-700">Gender</label>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <span className="absolute pl-3 text-gray-400">
                      <FaUser />
                    </span>
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className="w-full pl-10 dark:text-slate-950 p-2 border border-gray-300 rounded-lg focus:outline-none bg-gray-50 mt-1"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  {errors.gender && (
                    <p className="text-red-500 text-sm">{errors.gender}</p>
                  )}
                </div>
              </div>

              <div className="mb-4 relative">
                <label className="block text-gray-700">Email</label>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <span className="absolute pl-3 text-gray-400">
                      <FaEnvelope />
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full pl-10 p-2 border dark:text-slate-950 border-gray-300 rounded-lg focus:outline-none bg-gray-50 mt-1"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="mb-4 relative">
                <label className="block text-gray-700">
                  Department/Division
                </label>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <span className="absolute pl-3 text-gray-400">
                      <FaBook />
                    </span>
                    <select
                      name="department"
                      value={form.department}
                      onChange={handleChange}
                      className="w-full pl-10 p-2 dark:text-slate-950 border border-gray-300 rounded-lg focus:outline-none bg-gray-50 mt-1"
                    >
                      <option value="">Select Department</option>
                      {lists?.map((dept) => (
                        <option key={dept.name} value={dept.name}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.department && (
                    <p className="text-red-500 text-sm">{errors.department}</p>
                  )}
                </div>
              </div>

              <div className="mb-4 relative">
                <label className="block text-gray-700">Application Type</label>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <span className="absolute pl-3 text-gray-400">
                      <FaListAlt />
                    </span>
                    <select
                      name="application_type"
                      value={form.application_type}
                      onChange={handleChange}
                      className="w-full pl-10 dark:text-slate-950 p-2 border border-gray-300 rounded-lg focus:outline-none bg-gray-50 mt-1"
                    >
                      <option value="">Select Type</option>
                      <option value="Local">Local</option>
                      <option value="International">International</option>
                    </select>
                  </div>
                  {errors.application_type && (
                    <p className="text-red-500 text-sm">
                      {errors.application_type}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4 relative">
                <label className="block text-gray-700">
                  Level of Application
                </label>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <span className="absolute pl-3 text-gray-400">
                      <FaGraduationCap />
                    </span>
                    <select
                      name="level_of_application"
                      value={form.level_of_application}
                      onChange={handleChange}
                      className="w-full pl-10 dark:text-slate-950 p-2 border border-gray-300 rounded-lg focus:outline-none bg-gray-50 mt-1"
                    >
                      <option value="">Select Level</option>
                      <option value="phD">phD</option>
                      <option value="MSc">MSc</option>
                      <option value="BSc">BSc</option>
                    </select>
                  </div>
                  {errors.level_of_application && (
                    <p className="text-red-500 text-sm">
                      {errors.level_of_application}
                    </p>
                  )}
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
                    className="w-full pl-10 dark:text-slate-950 p-2 border border-gray-300 rounded-lg focus:outline-none bg-gray-50 mt-1"
                  />
                </div>
                {errors.phone_no && (
                  <p className="text-red-500 text-sm">{errors.phone_no}</p>
                )}
              </div>

              <div className="mb-4 relative">
                <label className="block text-gray-700">University Name</label>
                <div className="flex items-center">
                  <span className="absolute pl-3 text-gray-400">
                    <FaUniversity />
                  </span>
                  <input
                    type="text"
                    name="university_name"
                    value={form.university_name}
                    onChange={handleChange}
                    className="w-full dark:text-slate-950 pl-10 p-2 border border-gray-300 rounded-lg focus:outline-none bg-gray-50 mt-1"
                  />
                </div>
                {errors.university_name && (
                  <p className="text-red-500 text-sm">
                    {errors.university_name}
                  </p>
                )}
              </div>

              <div className="mb-4 relative">
                <label className="block text-gray-700">
                  University Location
                </label>
                <div className="flex items-center">
                  <span className="absolute pl-3 text-gray-400">
                    <FaMapMarkerAlt />
                  </span>
                  <input
                    type="text"
                    name="university_location"
                    value={form.university_location}
                    onChange={handleChange}
                    className="w-full dark:text-slate-950 pl-10 p-2 border border-gray-300 rounded-lg focus:outline-none bg-gray-50 mt-1"
                  />
                </div>
                {errors.university_location && (
                  <p className="text-red-500 text-sm">
                    {errors.university_location}
                  </p>
                )}
              </div>

              <div className="mb-4 relative">
                <label className="block text-gray-700">Attach File</label>
                <div className="flex  items-center">
                  <span className="absolute pl-3 text-gray-400">
                    <FaPaperclip />
                  </span>
                  <input
                    type="file"
                    accept=".pdf"
                    name="attached_file"
                    onChange={handleFileChange}
                    className="w-full dark:text-slate-950 pl-10 p-2 border border-gray-300 rounded-lg focus:outline-none bg-gray-50 mt-1"
                  />
                </div>
                {errors.attached_file && (
                  <p className="text-red-500 text-sm">{errors.attached_file}</p>
                )}
                <p className="text-gray-600 text-sm mt-2">
                  <strong>Disclaimer:</strong> The attachment file should
                  contain:
                  <ul className="list-disc list-inside">
                    <li>Application letter (scanned)</li>
                    <li>Acceptance letter if it is international</li>
                    <li>
                      Education credentials (Education papers, Copy of Degree
                      Transcript)
                    </li>
                  </ul>
                </p>
              </div>
              <button
                disabled={isLoading}
                type="submit"
                className="group mt-8 ml-10 w-fit h-fit flex items-center justify-center gap-4 bg-blue-700 hover:bg-blue-700 hover:font-bb transition-all duration-150 text-white border border-blue-700 py-2 px-4 rounded-lg text-right"
              >
                <p className="tracking-wider">Submit</p>
                {isLoading ? (
                  <Loading color="ffffff" />
                ) : (
                  <FaArrowRight className="text-sm" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
