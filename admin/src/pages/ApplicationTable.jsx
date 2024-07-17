import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../utility";
import { FaInfoCircle } from "react-icons/fa";
import ApplicationDetail from "../components/college/ApplicationDetail";
import { useDispatch, useSelector } from "react-redux";
import { addApplication } from "../api/features/applicationList";
import { useQuery } from "@tanstack/react-query";
import Loading from "../components/Loading";

const ApplicationTable = () => {
  const dispatch = useDispatch();
  const apps = useSelector((state) => state.application.applications);
  const [applications, setApplications] = useState([]);
  const [applicationDetail, setApplicationDetail] = useState();
  const [isopen, setIsOpen] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API}/college/application`);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw new Error("Failed to fetch data");
    }
  };

  const { data, isLoading, isSuccess, isError } = useQuery({
    queryKey: ["applications"],
    queryFn: fetchData,
  });

  useEffect(() => {
    if (isSuccess) {
      setApplications(data);
      dispatch(addApplication(data));
    }
  }, [isSuccess, data, dispatch]);

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
      setApplicationDetail(res.data);
      setIsOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading)
    return (
      <div className="w-full flex justify-center">
        <Loading />
      </div>
    );
  if (isError)
    return (
      <div className="w-full text-red-400 flex justify-center">
        Error Occurred
      </div>
    );

  return (
    <div className="container mx-auto mt-6 px-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
      {isopen && <ApplicationDetail d={applicationDetail} sIs={setIsOpen} />}
      <table className="min-w-full bg-white dark:bg-gray-600 rounded-lg">
        <thead className="">
          <tr>
            <th className="py-2 px-3 bg-gray-200 dark:bg-gray-800 text-left text-gray-700 dark:text-white font-semibold uppercase">
              Name
            </th>
            <th className="py-2 px-3 bg-gray-200 dark:bg-gray-800 text-left text-gray-700 dark:text-white font-semibold uppercase">
              Department
            </th>
            <th className="py-2 px-3 bg-gray-200 dark:bg-gray-800 text-left text-gray-700 dark:text-white font-semibold uppercase">
              Status
            </th>
            <th className="py-2 px-3 bg-gray-200 dark:bg-gray-800 text-center text-gray-700 dark:text-white font-semibold uppercase">
              Details
            </th>
          </tr>
        </thead>
        <tbody>
          {apps?.map((application, index) => (
            <tr
              key={index}
              className="hover:bg-gray-100 dark:hover:bg-gray-500 even:bg-[#f8f8f8] dark:even:bg-gray-700 border-b dark:border-gray-600 transition-colors duration-200"
            >
              <td className="py-2 px-3 text-gray-800 dark:text-white">
                {application.first_name} {application.last_name}
              </td>
              <td className="py-2 px-3 text-gray-800 dark:text-white">
                {application.department}
              </td>
              <td>
                <p
                  className={`py-1 px-3 w-fit rounded-2xl text-[12px] font-semibold border-b ${getStatusColor(
                    application.college_status
                  )}`}
                >
                  {application.college_status}
                </p>
              </td>
              <td className="py-2 px-3 flex justify-center items-center">
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
