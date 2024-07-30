import React, { useState } from "react";
import axios from "axios";
import { API } from "../../utility";
import { FaInfoCircle } from "react-icons/fa";
import ApplicationDetail from "../../components/college/ApplicationDetail";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading";
import DataTable, { createTheme } from "react-data-table-component";
import { addStudent } from "../../api/features/studentList";
import StudentDetail from "../../components/college/StudentDetail";

const StudentList = () => {
  const dispatch = useDispatch();
    const theme = useSelector((state) => state.theme.theme);
  const student = useSelector((state) => state.student.student);
  const [applicationDetail, setApplicationDetail] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  // console.log(student)

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API}/college/student`);
      dispatch(addStudent(response.data));
    //   console.log(response.data) 

      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw new Error("Failed to fetch data");
    }
  };

  const { isLoading, isSuccess, isError } = useQuery({
    queryKey: ["students"],
    queryFn: fetchData,
  });

    createTheme("dark", {
      text: {
        primary: "#e0e0e0",
        secondary: "#b0b0b0",
      },
      background: {
        default: "#111827",
      },
      context: {
        background: "#f9fafb",
        text: "#e0e0e0",
      },
      divider: {
        default: "#444444",
      },
      action: {
        button: "#ffffff",
        hover: "#030712",
        disabled: "#777777",
      },
    });

  const getStatusColor = (status) => {
    switch (status) {
      case "learning":
        return "bg-green-100 text-green-800";
      case "finished":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "";
    }
  };

  const applicationDetailView = async (id) => {
    try {
      const res = await axios.get(`${API}/college/student/${id}`);
      console.log(res.data)
      setApplicationDetail(res.data);
      setIsOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      name: "Name",
      selector: (row) =>
        `${row.applications.first_name} ${row.applications.last_name}`,
      sortable: true,
      cell: (row) => (
        <div className="text-gray-800 dark:text-white">
          {row.applications.first_name} {row.applications.last_name}
        </div>
      ),
    },
    {
      name: "Department",
      selector: (row) => row.applications.department,
      sortable: true,
      cell: (row) => (
        <div className="text-gray-800 dark:text-white">
          {row.applications.department}
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <p
          className={`py-1 px-3 uppercase w-fit rounded-2xl text-[12px] font-semibold border-b ${getStatusColor(
            row.status
          )}`}
        >
          {row.status}
        </p>
      ),
    },
    // {
    //   name: "Applied At",
    //   selector: (row) => new Date(row.createdAt).toLocaleString(),
    //   sortable: true,
    // },
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

  const filteredData = student?.filter((application) => {
    const lowercasedFilterText = filterText?.toLowerCase();
    return (
      application.applications?.first_name
        .toLowerCase()
        .includes(lowercasedFilterText) ||
      application.applications?.last_name
        .toLowerCase()
        .includes(lowercasedFilterText) ||
      application.applications?.department
        .toLowerCase()
        .includes(lowercasedFilterText) ||
      application.applications?.college_status
        .toLowerCase()
        .includes(lowercasedFilterText)
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
      {isOpen && <StudentDetail d={applicationDetail} sIs={setIsOpen} />}
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
        theme={theme === "dark" ? "dark" : "solarized"}
        noDataComponent="No data available"
      />
    </div>
  );
};

export default StudentList;

