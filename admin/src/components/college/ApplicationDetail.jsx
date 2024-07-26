import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API, FILEAPI } from "../../utility";
import { useDispatch, useSelector } from "react-redux";
import { updateState } from "../../api/features/applicationList";
import Loading from "../Loading";
import { AiOutlineClose } from "react-icons/ai";

const ApplicationDetail = ({ d, sIs }) => {
  const auth = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    attached_file: null,
  });

  const handleStatusChange = async (status) => {
    try {
      const formData = new FormData();
      formData.append("college_status", status);
      formData.append("college_minute", form.attached_file);
      const res = await axios.put(
        `${API}/college/application/status/${d._id}`,
        formData
      );
      const dis = {
        id: d._id,
        status,
        role_based: auth.role_based,
      };
      dispatch(updateState(dis));
      sIs(false);
      // if (status === "approved") return navigate(`/create-user-aastu/${d._id}`);
      // // Redirect to the list or another appropriate page
    } catch (error) {
      console.error("Error updating status:", error);
    }
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

  
  const handleFileChange = (e) => {
    setForm({
      ...form,
      attached_file: e.target.files[0],
    });
  };

  const viewFile = (file) => {
    window.open(
      `${FILEAPI}/files/${file}`,
      "_blank",
      "noreferrer"
    );
  };

  if (!d)
    return (
      <div className="text-center text-white">
        <Loading />
      </div>
    );

  return (
    <div className="fixed inset-0 z-50 bg-slate-600 bg-opacity-75 flex justify-center items-center p-6">
      <div className="container mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <button onClick={() => sIs(false)} className="">
          <AiOutlineClose className="absolute top-5 right-5 p-1 font-extrabold bg-white text-2xl rounded-full hover:bg-slate-400 transition-all duration-100" />
        </button>
        <h1 className="text-2xl font-bold mb-6 sticky top-0 z-50 w-full h-[40px] bg-white dark:bg-gray-800 p-4">
          Application Details
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 p-6 max-h-[60vh] overflow-y-auto">
          <div>
            <p className="text-gray-600 dark:text-gray-300">First Name</p>
            <p className="text-lg dark:text-white">{d.first_name}</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-300">Last Name</p>
            <p className="text-lg dark:text-white">{d.last_name}</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-300">Email</p>
            <p className="text-lg dark:text-white">{d.email}</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-300">Phone Number</p>
            <p className="text-lg dark:text-white">{d.phone_no}</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-300">Department</p>
            <p className="text-lg dark:text-white">{d.department}</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-300">Attached File</p>
            <button
              onClick={() => viewFile(d.attached_file)}
              className="text-lg dark:text-white"
            >
              {d.attached_file}
            </button>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-300">
              Department Status
            </p>
            <p className={`text-lg ${getStatusColor(d.department_status)}`}>
              {d.department_status}
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-300">
              Department Minute/File
            </p>
            <button
              onClick={() => viewFile(d.department_minute)}
              className="text-lg dark:text-white"
            >
              {d.department_minute}
            </button>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-300">College Status</p>
            <p className={`text-lg ${getStatusColor(d.college_status)}`}>
              {d.college_status}
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-300">College Status</p>
            <p className="text-lg">{d?.college_minute}</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-300">Applied At</p>
            <p className="text-lg dark:text-white">
              {new Date(d.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-300">
              Minute before Approve/Reject
            </p>
            <input
              type="file"
              name="attached_file"
              onChange={handleFileChange}
              className="mt-2 border w-[300px] max-h-[200px] p-2"
            />
          </div>
        </div>
        {form.attached_file && (
          <div className="flex justify-between p-4">
            {(d.college_status === "rejected" ||
              d.college_status === "pending") && (
              <button
                onClick={() => handleStatusChange("approved")}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Approve
              </button>
            )}
            {(d.college_status === "approved" ||
              d.college_status === "pending") && (
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

export default ApplicationDetail;
