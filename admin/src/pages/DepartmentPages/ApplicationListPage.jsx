import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../utility";
import { FaInfoCircle } from "react-icons/fa";
import ApplicationDetail from "../../components/DepartmentComponent/ApplicationListdetail";
import { useDispatch, useSelector } from "react-redux";
import { addApplication } from "../../api/features/applicationList";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading";

const ApplicationListPage = () => {
  const dispatch = useDispatch();
  const apps = useSelector((state) => state.application.applications);
  const auth = useSelector((state) => state.auth.user)
  const [applications, setApplications] = useState([]);
  const [applicationDetail, setApplicationDetail] = useState();
  const [isopen, setIsOpen] = useState(false);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       let response
  //       if (auth) {
  //         response = await axios.get(
  //           `${API}/department/application/list`,
  //           { headers: {
  //             role: auth.role
  //           } },
  //           {
  //             withCredentials: true,
  //           }
  //         );
  //       }
  //       dispatch(addApplication(response.data));
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

      const fetchData = async () => {
        try {
          let response;
          if (auth) {
            response = await axios.get(
              `${API}/department/application/list`,
              {
                headers: {
                  role: auth.role,
                },
              },
              {
                withCredentials: true,
              }
            );
          }
          return response.data
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

    const { data, isLoading, isSuccess } = useQuery({
      queryKey: ["applications"],
      queryFn: fetchData,
    });

  useEffect(() => {
    setApplications(data);
    dispatch(addApplication(data));
  }, [isSuccess,data]);

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

   if (isLoading)
     return (
       <div className="w-full flex justify-center">
         <Loading />
       </div>
     );

  return (
    <div className="container mx-auto mt-6">
      {isopen && <ApplicationDetail d={applicationDetail} sIs={setIsOpen} />}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-3 bg-gray-200 text-left text-gray-700 font-semibold uppercase">
              Name
            </th>
            <th className="py-2 px-3 bg-gray-200 text-left text-gray-700 font-semibold uppercase">
              Department
            </th>
            <th className="py-2 px-3 bg-gray-200 text-left text-gray-700 font-semibold uppercase">
              Phone Number
            </th>
            <th className="py-2 px-3 bg-gray-200 text-left text-gray-700 font-semibold uppercase">
              Department Status
            </th>
            <th className="py-2 px-3 bg-gray-200 text-left text-gray-700 font-semibold uppercase">
              Details
            </th>
          </tr>
        </thead>
        <tbody>
          {applications?.map((application, index) => (
            <tr
              key={index}
              className="hover:bg-gray-100 even:bg-[#f8f8f8] border-b transition-colors duration-200"
            >
              <td className="py-2 px-3 text-gray-800">
                {application.first_name} {application.last_name}
              </td>
              <td className="py-2 px-3 text-gray-800">
                {application.department}
              </td>
              <td className="py-2 px-3 text-gray-800">
                {application.phone_no}
              </td>
              <td>
                <p
                  className={`text-center py-1 px-3 w-fit rounded-2xl text-[12px] font-semibold border-b ${getStatusColor(
                    application.department_status
                  )}`}
                >
                  {application.department_status}
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

export default ApplicationListPage;
