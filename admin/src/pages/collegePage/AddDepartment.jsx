import React, { useState } from "react";
import axios from "axios";
import { API } from "../../utility";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AiOutlinePlus,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineClose,
} from "react-icons/ai";
import Loading from "../../components/Loading";
import toast from "react-hot-toast";
import DataTable, { createTheme } from "react-data-table-component";
import { useSelector } from "react-redux";
import './st.css'

const fetchDepartments = async () => {
  const response = await axios.get(`${API}/college/departmet`);
  return response.data;
};

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

const AddDepartment = () => {
    const theme = useSelector((state) => state.theme.theme);

  const [form, setForm] = useState({ name: "", description: "" });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [news, setNews] = useState(false);
  const queryClient = useQueryClient();

  const { data: departments = [], isLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
  });

  const { isPending: isAdding, mutate: addDepartment } = useMutation({
    mutationFn: async (formData) => {
      await axios.post(`${API}/college/add/department`, formData);
    },
    onSuccess: () => {
      setNews(false);
      toast.success("Department added successfully");
      queryClient.invalidateQueries(["departments"]);
      setForm({ name: "", description: "" });
    },
  });

  const { isPending: isUpdating, mutate: updateDepartment } = useMutation({
    mutationFn: async ({ id, formData }) => {
      await axios.put(`${API}/college/departmet/update/${id}`, formData);
    },
    onSuccess: () => {
      toast.success("Department updated successfully");
      queryClient.invalidateQueries(["departments"]);
      setEditMode(false);
      setForm({ name: "", description: "" });
    },
  });

  const { isPending: isDeleting, mutate: deleteDepartment } = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${API}/college/departmet/delete/${id}`);
    },
    onSuccess: () => {
      toast.success("Department deleted successfully");
      queryClient.invalidateQueries(["departments"]);
      setShowDeleteConfirm(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      updateDepartment({ id: editId, formData: form });
    } else {
      addDepartment(form);
    }
  };

  const handleEdit = (department) => {
    setForm({ name: department.name, description: department.description });
    setEditId(department._id);
    setEditMode(true);
  };

  const handleDelete = (id) => {
    setDepartmentToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    deleteDepartment(departmentToDelete);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDepartmentToDelete(null);
  };

  const handleClearAll = () => {
    setForm({ name: "", description: "" });
    setEditMode(false);
  };

  if (isLoading)
    return (
      <div className="w-full justify-center flex">
        {" "}
        <Loading />
      </div>
    );

  const columns = [
    {
      name: "Name",
      selector: (row) => row?.name,
      sortable: true,
    },
    {
      name: "Description",
      cell: (row) => (
        <div className="tooltip">
          {/* Truncated description */}
          <span className="truncate">
            {row.description.length > 30
              ? `${row.description.slice(0, 30)}...`
              : row.description}
          </span>
          {/* Full description tooltip */}
          <span className="tooltiptext">{row.description}</span>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Created",
      selector: (row) => row?.createdAt,
      sortable: true,
      cell: (row) => (
        <p className="text-sm">
          {new Date(row?.createdAt).toLocaleDateString()}
        </p>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-4">
          <button
            onClick={() => handleEdit(row)}
            className="text-blue-500 hover:text-blue-700 bg-inherit dark:text-blue-400 dark:hover:text-blue-300"
          >
            <AiOutlineEdit />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="text-red-500 hover:text-red-700 bg-inherit dark:text-red-400 dark:hover:text-red-300"
          >
            <AiOutlineDelete />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Departments
        </h2>
        <button
          onClick={() => setNews(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          <AiOutlinePlus /> Add Department
        </button>
      </div>

      <DataTable
        columns={columns}
        data={departments}
        pagination
        highlightOnHover
        theme={theme === "dark" ? "dark" : "solarized"}
      />

      {/* Add/Update Department Popup */}
      {editMode && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button onClick={handleClearAll} className="absolute top-2 right-2">
              <AiOutlineClose className="text-2xl text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 transition-colors" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              {editMode ? "Update Department" : "Add Department"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-600 dark:text-gray-300 mb-2"
                >
                  Department Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border bg-gray-50 text-gray-950 border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-200"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-gray-600 dark:text-gray-300 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows="4"
                  className="w-full px-3 py-2 border bg-gray-50 text-gray-950 border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-200"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded dark:bg-blue-600 dark:hover:bg-blue-700"
                  disabled={isAdding || isUpdating}
                >
                  {editMode ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded dark:bg-gray-600 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                {(isAdding || isUpdating) && <Loading />}
              </div>
            </form>
          </div>
        </div>
      )}

      {news && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setNews(false)}
              className="absolute top-2 right-2"
            >
              <AiOutlineClose className="text-2xl text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 transition-colors" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              {editMode ? "Update Department" : "Add Department"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-600 dark:text-gray-300 mb-2"
                >
                  Department Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 text-gray-950 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-200"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-gray-600 dark:text-gray-300 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows="4"
                  className="w-full px-3 py-2 bg-gray-50 text-gray-950 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-200"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded dark:bg-blue-600 dark:hover:bg-blue-700"
                  disabled={isAdding || isUpdating}
                >
                  {editMode ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => setNews(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded dark:bg-gray-600 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                {(isAdding || isUpdating) && <Loading />}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button onClick={cancelDelete} className="absolute top-2 right-2">
              <AiOutlineClose className="text-2xl text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 transition-colors" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Confirm Deletion
            </h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Are you sure you want to delete this department?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded dark:bg-red-600 dark:hover:bg-red-700"
                disabled={isDeleting}
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded dark:bg-gray-600 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              {isDeleting && <Loading />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddDepartment;
