import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../utility";
import { FaInfoCircle } from "react-icons/fa";
import ApplicationDetail from "../../components/DepartmentComponent/ApplicationListdetail";
import { useDispatch, useSelector } from "react-redux";
import { addApplication } from "../../api/features/applicationList";

const ApplicationListPage = () => {
  const dispatch = useDispatch();
  const apps = useSelector((state) => state.application.applications);
  const auth = useSelector((state) => state.auth.user)
  const [applications, setApplications] = useState([]);
  const [applicationDetail, setApplicationDetail] = useState();
  const [isopen, setIsOpen] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response
        if (auth) {
          response = await axios.get(
            `${API}/department/application/list`,
            { headers: {
              role: auth.role
            } },
            {
              withCredentials: true,
            }
          );
        }
        dispatch(addApplication(response.data));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setApplications(apps);
  }, [apps]);

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
      const res = await axios.get(
        `${API}/department/application/list/detail/${id}`,
        {
          headers: {
            role: auth.role,
          },
        },
        {
          withCredentials: true,
        }
      );
        console.log(res.data);
      setApplicationDetail(res.data);
      setIsOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const viewFile = (file) => {
    window.open(`http://localhost:8000/files/${file}`, '_blank', 'noreferrer');
  }

  return (
    <div className="container mx-auto mt-10">
      {isopen && <ApplicationDetail d={applicationDetail} sIs={setIsOpen} />}
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-start bg-gray-100">Name</th>
            <th className="py-2 px-4 border-b  text-start bg-gray-100">
              Department
            </th>
            <th className="py-2 px-4 border-b  text-start bg-gray-100">
              Phone Number
            </th>
            <th className="py-2 px-4 border-b  text-start bg-gray-100">
              Department Status
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
                  {application.phone_no}
              </td>
              <td
                className={`py-2 px-4 border-b ${getStatusColor(
                  application.department_status
                )}`}
              >
                {application.department_status}
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

export default ApplicationListPage;
