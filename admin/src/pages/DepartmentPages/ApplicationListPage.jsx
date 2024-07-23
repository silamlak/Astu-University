import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../utility";
import { FaInfoCircle } from "react-icons/fa";
import ApplicationDetail from "../../components/DepartmentComponent/ApplicationListdetail";
import { useDispatch, useSelector } from "react-redux";
import { addApplication } from "../../api/features/applicationList";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading";
import DataTable from "react-data-table-component";

const ApplicationListPage = () => {
  const dispatch = useDispatch();
  const apps = useSelector((state) => state.application.applications);
  const auth = useSelector((state) => state.auth.user);
  const [applicationDetail, setApplicationDetail] = useState();
  const [isopen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [filteredApps, setFilteredApps] = useState(apps);

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
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const { data, isLoading, isSuccess, isError } = useQuery({
    queryKey: ["applications"],
    queryFn: fetchData,
  });

  useEffect(() => {
    if (isSuccess) {
      setFilteredApps(data);
      dispatch(addApplication(data));
    }
  }, [isSuccess, data, dispatch]);

  useEffect(() => {
    const filteredData = apps?.filter(
      (app) =>
        `${app.first_name} ${app.last_name}`
          .toLowerCase()
          .includes(filterText.toLowerCase()) ||
        app.department.toLowerCase().includes(filterText.toLowerCase()) ||
        app.phone_no.includes(filterText) ||
        app.department_status.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredApps(filteredData);
  }, [filterText, apps]);

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
      setApplicationDetail(res.data);
      setIsOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      name: "Name",
      selector: (row) => `${row.first_name} ${row.last_name}`,
      sortable: true,
      style: {
        header: {
          className: "text-2xl",
        },
      },
    },
    {
      name: "Department",
      selector: (row) => row.department,
      sortable: true,
    },
    {
      name: "Phone Number",
      selector: (row) => row.phone_no,
      sortable: true,
    },
    {
      name: "Department Status",
      selector: (row) => row.department_status,
      sortable: true,
      cell: (row) => (
        <p
          className={`text-center uppercase py-1 px-3 w-fit rounded-2xl text-[12px] font-semibold border-b ${getStatusColor(
            row.department_status
          )}`}
        >
          {row.department_status}
        </p>
      ),
    },
    {
      name: "Details",
      button: true,
      cell: (row) => (
        <FaInfoCircle
          className="text-blue-500 cursor-pointer"
          onClick={() => applicationDetailView(row._id)}
        />
      ),
    },
  ];

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
    <div className="container mx-auto mt-8 px-4 py-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        {isopen && <ApplicationDetail d={applicationDetail} sIs={setIsOpen} />}
      <div className="text-center text-2xl font-semibold">
        Application List
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by name, department, phone number, or status"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="w-[300px] p-2 border rounded-md focus:outline-blue-300"
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredApps}
        pagination
        highlightOnHover
        pointerOnHover
        striped
        responsive
      />
    </div>
  );
};

export default ApplicationListPage;
