import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { API } from "../../utility";
import DataTable, { createTheme } from "react-data-table-component";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const columns = [
  {
    name: "Name",
    selector: (row) =>
      `${row.applicant?.first_name} ${row.applicant?.middle_name}`,
    sortable: true,
  },
  {
    name: "Email",
    selector: (row) => row.student.email,
    sortable: true,
  },
  {
    name: "Status",
    selector: (row) => row.student.status,
    sortable: true,
  },
];

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

const ArchivedStudents = () => {
  const theme = useSelector((state) => state.theme.theme);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API}/college/archive`);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw new Error("Failed to fetch data");
    }
  };

  const { data, isLoading, isSuccess, isError } = useQuery({
    queryKey: ["archived"],
    queryFn: fetchData,
  });
  console.log(data)

  // Check if data is an array before filtering
  const filteredData = Array.isArray(data)
    ? data.filter(
        (item) =>
          item.applicant?.first_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          item.applicant?.middle_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          item.student?.email
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          item.student?.status?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleClickRow = (row) => {
    console.log(row._id);
    navigate(`/archived/detail/${row._id}`);
  };

  return (
    <div className="mt-20">
      <div>
        <input
          type="text"
          placeholder="Filter..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-2 p-2 border bg-gray-50 text-gray-950 border-gray-300 rounded dark:border-gray-700 dark:bg-gray-800 dark:text-white w-full"
        />
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          theme={theme === "dark" ? "dark" : "solarized"}
          onRowClicked={handleClickRow}
          customStyles={{
            rows: {
              style: {
                cursor: "pointer",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default ArchivedStudents;
