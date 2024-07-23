import React, { useState } from "react";
import axios from "axios";
import { API } from "../../utility";
import { FaInfoCircle } from "react-icons/fa";
import ApplicationDetail from "../../components/college/ApplicationDetail";
import { useDispatch, useSelector } from "react-redux";
import { addApplication } from "../../api/features/applicationList";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading";
import DataTable from "react-data-table-component";

const ApplicationTable = () => {
  const dispatch = useDispatch();
  const apps = useSelector((state) => state.application.applications);
  const [applicationDetail, setApplicationDetail] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API}/college/application`);
            dispatch(addApplication(response.data));

      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw new Error("Failed to fetch data");
    }
  };

  const { isLoading, isSuccess, isError } = useQuery({
    queryKey: ["applications"],
    queryFn: fetchData,
  });

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

  const columns = [
    {
      name: "Name",
      selector: (row) => `${row.first_name} ${row.last_name}`,
      sortable: true,
      cell: (row) => (
        <div className="text-gray-800 dark:text-white">
          {row.first_name} {row.last_name}
        </div>
      ),
    },
    {
      name: "Department",
      selector: (row) => row.department,
      sortable: true,
      cell: (row) => (
        <div className="text-gray-800 dark:text-white">{row.department}</div>
      ),
    },
    {
      name: "Status",
      selector: (row) => row.college_status,
      sortable: true,
      cell: (row) => (
        <p
          className={`py-1 px-3 uppercase w-fit rounded-2xl text-[12px] font-semibold border-b ${getStatusColor(
            row.college_status
          )}`}
        >
          {row.college_status}
        </p>
      ),
    },
    {
      name: "Details",
      cell: (row) => (
        <FaInfoCircle
          className="text-blue-500 cursor-pointer"
          onClick={() => applicationDetailView(row._id)}
        />
      ),
      button: true,
      sortable: false,
    },
  ];

  const filteredData = apps?.filter((application) => {
    const lowercasedFilterText = filterText.toLowerCase();
    return (
      application.first_name.toLowerCase().includes(lowercasedFilterText) ||
      application.last_name.toLowerCase().includes(lowercasedFilterText) ||
      application.department.toLowerCase().includes(lowercasedFilterText) ||
      application.college_status.toLowerCase().includes(lowercasedFilterText)
    );
  });

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
      {isOpen && <ApplicationDetail d={applicationDetail} sIs={setIsOpen} />}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by name, department, or status..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="p-2 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-800 dark:text-white w-full"
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        responsive
        striped
        noDataComponent="No data available"
      />
    </div>
  );
};

export default ApplicationTable;
