import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API, FILEAPI } from "../../utility";
import { useDispatch, useSelector } from "react-redux";
import { updateState } from "../../api/features/applicationList";
import { AiOutlineClose } from "react-icons/ai";
import { useForm } from "react-hook-form";

const ApplicationListDetail = ({ d, sIs }) => {
  const auth = useSelector((state) => state.auth.user);
  const [form, setForm] = useState({
    attached_file: null,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleStatusChange = async (status) => {
    try {
      const formData = new FormData();
      formData.append("department_status", status);
      formData.append("department_minute", form.attached_file);

      const res = await axios.put(
        `${API}/department/application/list/detail/status/${d?._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const dis = {
        id: d._id,
        status,
        role: auth.role_based,
      };
      dispatch(updateState(dis));
      sIs(false);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleFileChange = (e) => {
    setForm({
      ...form,
      attached_file: e.target.files[0],
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-800";
      case "rejected":
        return "text-red-800";
      case "pending":
        return "text-yellow-800";
      default:
        return "";
    }
  };

  const viewFile = (file) => {
    window.open(
      `${FILEAPI}/files/${file}`,
      "_blank",
      "noreferrer"
    );
  };

  if (!d) return <div className="text-center text-white">Loading...</div>;

  return (
    <div className="fixed inset-0 bg-slate-600 bg-opacity-75 z-50 dark:bg-slate-900 dark:bg-opacity-75 flex justify-center items-center p-6">
      <div className="container mx-auto bg-white dark:bg-gray-800 shadow-lg z-50 rounded-lg">
        <button onClick={() => sIs(false)} className="">
          <AiOutlineClose className="absolute top-5 right-5 p-1 font-extrabold bg-white text-slate-800 text-2xl rounded-full hover:bg-slate-400 transition-all duration-100" />
        </button>
        <h1 className="text-2xl font-bold mb-6 sticky top-0 z-50 w-full text-gray-600 dark:text-gray-300 h-[40px] bg-white dark:bg-gray-800 p-4">
          Application Details
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 p-6 max-h-[60vh] overflow-y-auto">
          <div>
            <p className="text-gray-600 dark:text-gray-100">Title</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {d?.title}
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-100">First Name</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {d.first_name}
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-100">Middle Name</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {d.middle_name}
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-100">Last Name</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {d.last_name}
            </p>
          </div>

          <div>
            <p className="text-gray-600 dark:text-gray-100">Gender</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {d.gender}
            </p>
          </div>

          <div>
            <p className="text-gray-600 dark:text-gray-100">Email</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {d.email}
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-100">Phone Number</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {d.phone_no}
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-100">Department</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {d.department}
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-300">Attached File</p>
            <button
              className=" dark:bg-gray-800 "
              onClick={() => viewFile(d.attached_file)}
            >
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                View File
              </p>
            </button>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-100">
              Department Status
            </p>
            <p className={`text-sm ${getStatusColor(d.department_status)}`}>
              {d.department_status}
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-100">Applied At</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {new Date(d.createdAt).toLocaleString()}
            </p>
          </div>
          {d.department_status === "pending" && (
            <div>
              <p className="text-gray-600 dark:text-gray-100">
                Minute before Approve/Reject
              </p>
              <input
                type="file"
                accept=".pdf"
                name="attached_file"
                onChange={handleFileChange}
                className="mt-2 border w-[300px] text-gray-600 dark:text-gray-300 max-h-[200px] p-2"
              />
            </div>
          )}
        </div>
        {form.attached_file && (
          <div className="flex justify-between p-4">
            {(d.department_status === "rejected" ||
              d.department_status === "pending") && (
              <button
                onClick={() => handleStatusChange("approved")}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Approve
              </button>
            )}
            {(d.department_status === "approved" ||
              d.department_status === "pending") && (
              <button
                onClick={() => handleStatusChange("rejected")}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Reject
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationListDetail;
