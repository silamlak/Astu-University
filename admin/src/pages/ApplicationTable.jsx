import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../utility";
import { FaInfoCircle } from "react-icons/fa";
import ApplicationDetail from "../components/ApplicationDetail";

const ApplicationTable = () => {
  const [applications, setApplications] = useState([]);
  const [applicationDetail, setApplicationDetail] = useState();
  const [isopen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}/college/application`);
        setApplications(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "";
    }
  };

  const applicationDetailView = async (id) => {
    try {
      const res = await axios.get(`${API}/college/application/${id}`);
    //   console.log(res.data);
      setApplicationDetail(res.data)
      setIsOpen(true)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto mt-10">
        {isopen && <ApplicationDetail d={applicationDetail}/>}
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-start bg-gray-100">Name</th>
            <th className="py-2 px-4 border-b  text-start bg-gray-100">
              Department
            </th>
            <th className="py-2 px-4 border-b  text-start bg-gray-100">
              Attached File
            </th>
            <th className="py-2 px-4 border-b  text-start bg-gray-100">
              College Status
            </th>
            <th className="py-2 px-4 border-b  text-start bg-gray-100">
              Details
            </th>
          </tr>
        </thead>
        <tbody>
          {applications?.map((application, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">
                {application.first_name} {application.last_name}
              </td>
              <td className="py-2 px-4 border-b">{application.department}</td>
              <td className="py-2 px-4 border-b">
                {application.attached_file}
              </td>
              <td
                className={`py-2 px-4 border-b ${getStatusColor(
                  application.college_status
                )}`}
              >
                {application.college_status}
              </td>
              <td className="py-2 px-4 border-b text-center">
                <FaInfoCircle
                  className="text-blue-500 cursor-pointer"
                  onClick={() => applicationDetailView(application._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationTable;
