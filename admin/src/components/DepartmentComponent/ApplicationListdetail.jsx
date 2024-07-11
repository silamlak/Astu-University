import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API } from "../../utility";
import { useDispatch, useSelector } from "react-redux";
import { updateState } from "../../api/features/applicationList";

const ApplicationListdetail = ({d, sIs}) => {
  const auth = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleStatusChange = async (status) => {
    try {
      const res = await axios.put(
        `${API}/department/application/list/detail/status/${d?._id}`,
        {
          ...d,
          department_status: status,
        }
      );
      const dis = {
        id: d._id,
        status,
        role: auth.role_based
      };
      dispatch(updateState(dis));
      sIs(false);
      // Redirect to the list or another appropriate page
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

    const viewFile = (file) => {
      window.open(
        `http://localhost:8000/files/${file}`,
        "_blank",
        "noreferrer"
      );
    };

  if (!d) return <div className="text-center text-white">Loading...</div>;

  return (
    <div className="fixed inset-0 bg-slate-600 bg-opacity-75 flex justify-center items-center p-6">
      <div className="container mx-auto bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-6 sticky top-0 z-50 w-full h-[40px] bg-white p-4">
          Application Details
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 p-6 max-h-[80vh] overflow-y-auto">
          <div>
            <p className="text-gray-600">First Name</p>
            <p className="text-lg">{d.first_name}</p>
          </div>
          <div>
            <p className="text-gray-600">Last Name</p>
            <p className="text-lg">{d.last_name}</p>
          </div>
          <div>
            <p className="text-gray-600">Email</p>
            <p className="text-lg">{d.email}</p>
          </div>
          <div>
            <p className="text-gray-600">Phone Number</p>
            <p className="text-lg">{d.phone_no}</p>
          </div>
          <div>
            <p className="text-gray-600">Department</p>
            <p className="text-lg">{d.department}</p>
          </div>
          <div>
            <p className="text-gray-600">Attached File</p>
            <button onClick={() => viewFile(d.attached_file)}>
              <p className="text-lg">View File</p>
            </button>
          </div>
          <div>
            <p className="text-gray-600">Department Status</p>
            <p className={`text-lg ${getStatusColor(d.department_status)}`}>
              {d.department_status}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Applyed At</p>
            <p className="text-lg">{new Date(d.createdAt).toLocaleString()}</p>
          </div>
          {/* <div>
            <p className="text-gray-600">Updated At</p>
            <p className="text-lg">{new Date(d.updatedAt).toLocaleString()}</p>
          </div> */}
        </div>
        <div className="flex justify-between p-4">
          <button
            onClick={() => handleStatusChange("approved")}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Approve
          </button>
          <button
            onClick={() => handleStatusChange("rejected")}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationListdetail;
