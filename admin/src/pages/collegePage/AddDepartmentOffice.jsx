import React, { useState, useEffect } from "react";
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

const fetchDepartments = async () => {
  const response = await axios.get(`${API}/college/departmet`);
  return response.data;
};

const fetchDepartmentOfficers = async () => {
  const response = await axios.get(`${API}/college/departmet/officer`);
  return response.data;
};

const AddDepartmentOffice = () => {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone_no: "",
    department: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [officerToDelete, setOfficerToDelete] = useState(null);
  const [news, setNews] = useState(false);
  const queryClient = useQueryClient();

  const { data: departments = [], isLoading: isDepartmentsLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments
});
  const { data: officers = [], isLoading: isOfficersLoading } = useQuery({
   queryKey: ["departmentOfficers"],
   queryFn:  fetchDepartmentOfficers
});

  const { isPending: isAdding, mutate: addOfficer } = useMutation({
    mutationFn: async (formData) => {
      await axios.post(`${API}/college/add/college_officer`, formData);
    },
    onSuccess: () => {
      toast.success("Department Officer added successfully");
      queryClient.invalidateQueries(["departmentOfficers"]);
      setForm({
        name: "",
        email: "",
        password: "",
        phone_no: "",
        department: "",
      });
      setEditMode(false);
    },
  });

  const { isPending: isUpdating, mutate: updateOfficer } = useMutation({
    mutationFn: async ({ id, formData }) => {
      await axios.put(
        `${API}/college/departmet/officer/update/${id}`,
        formData
      );
    },
    onSuccess: () => {
      toast.success("Department Officer updated successfully");
      queryClient.invalidateQueries(["departmentOfficers"]);
      setEditMode(false);
      setForm({
        name: "",
        email: "",
        password: "",
        phone_no: "",
        department: "",
      });
    },
  });

  const { isPending: isDeleting, mutate: deleteOfficer } = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${API}/college/departmet/officer/delete/${id}`);
    },
    onSuccess: () => {
      toast.success("Department Officer deleted successfully");
      queryClient.invalidateQueries(["departmentOfficers"]);
      setShowDeleteConfirm(false);
    },
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      updateOfficer({ id: editId, formData: form });
    } else {
      addOfficer(form);
    }
  };

  const handleEdit = (officer) => {
    setForm({
      name: officer.name,
      email: officer.email,
      password: "",
      phone_no: officer.phone_no,
      department: officer.department,
    });
    setEditId(officer._id);
    setEditMode(true);
  };

  const handleDelete = (id) => {
    setOfficerToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    deleteOfficer(officerToDelete);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setOfficerToDelete(null);
  };

    const handleClearAll = () => {
      setForm({ name: "", description: "" });
      setEditMode(false);
    };

  if (isDepartmentsLoading || isOfficersLoading) return <div className="w-full flex justify-center"><Loading /></div>;

return (
  <div className="p-6 dark:bg-gray-900">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        Department Officers
      </h2>
      <button
        onClick={() => setNews(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
      >
        <AiOutlinePlus /> Add Department Officer
      </button>
    </div>

    <table className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-md">
      <thead className="bg-gray-200 dark:bg-gray-700">
        <tr>
          <th className="py-2 px-4 border-b text-start dark:border-gray-600 text-gray-800 dark:text-gray-100">
            Name
          </th>
          <th className="py-2 px-4 border-b text-start dark:border-gray-600 text-gray-800 dark:text-gray-100">
            Email
          </th>
          <th className="py-2 px-4 border-b text-start dark:border-gray-600 text-gray-800 dark:text-gray-100">
            Phone Number
          </th>
          <th className="py-2 px-4 border-b text-start dark:border-gray-600 text-gray-800 dark:text-gray-100">
            Department
          </th>
          <th className="py-2 px-4 border-b text-start dark:border-gray-600 text-gray-800 dark:text-gray-100">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {officers.map((officer) => (
          <tr className="border-b" key={officer._id}>
            <td className="py-2 px-4 dark:border-gray-600 text-gray-800 dark:text-gray-100">
              {officer.name}
            </td>
            <td className="py-2 px-4 dark:border-gray-600 text-gray-800 dark:text-gray-100">
              {officer.email}
            </td>
            <td className="py-2 px-4 dark:border-gray-600 text-gray-800 dark:text-gray-100">
              {officer.phone_no}
            </td>
            <td className="py-2 px-4 dark:border-gray-600 text-gray-800 dark:text-gray-100">
              {officer.department}
            </td>
            <td className="py-2 px-4 dark:border-gray-600  text-gray-800 dark:text-gray-100">
              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(officer)}
                  className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <AiOutlineEdit />
                </button>
                <button
                  onClick={() => handleDelete(officer._id)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <AiOutlineDelete />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Add/Update Department Officer Popup */}
    {editMode && (
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative">
          <button onClick={handleClearAll} className="absolute top-2 right-2">
            <AiOutlineClose className="text-2xl text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 transition-colors" />
          </button>
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            {editMode ? "Update Department Officer" : "Add Department Officer"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-600 dark:text-gray-300 mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-3 bg-gray-50 text-gray-950 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-600 dark:text-gray-300 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-50 text-gray-950 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </div>
            {!editMode && (
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-gray-600 dark:text-gray-300 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border bg-gray-50 text-gray-950 border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-gray-200"
                  required
                />
              </div>
            )}
            <div className="mb-4">
              <label
                htmlFor="phone_no"
                className="block text-gray-600 dark:text-gray-300 mb-2"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="phone_no"
                name="phone_no"
                value={form.phone_no}
                onChange={handleChange}
                className="w-full px-3 py-2 border bg-gray-50 text-gray-950 border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="department"
                className="block text-gray-600 dark:text-gray-300 mb-2"
              >
                Department
              </label>
              <select
                id="department"
                name="department"
                value={form.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border bg-gray-50 text-gray-950 border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-gray-200"
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                disabled={isAdding || isUpdating}
              >
                {editMode ? "Update" : "Add"}
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
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
            {editMode ? "Update Department Officer" : "Add Department Officer"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-600 dark:text-gray-300 mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-50 text-gray-950 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-600 dark:text-gray-300 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-50 text-gray-950 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </div>
            {!editMode && (
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-gray-600 dark:text-gray-300 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-50 text-gray-950 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-gray-200"
                  required
                />
              </div>
            )}
            <div className="mb-4">
              <label
                htmlFor="phone_no"
                className="block text-gray-600 dark:text-gray-300 mb-2"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="phone_no"
                name="phone_no"
                value={form.phone_no}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-50 text-gray-950 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="department"
                className="block text-gray-600 dark:text-gray-300 mb-2"
              >
                Department
              </label>
              <select
                id="department"
                name="department"
                value={form.department}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-50 text-gray-950 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-gray-200"
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                disabled={isAdding || isUpdating}
              >
                {editMode ? "Update" : "Add"}
              </button>
              <button
                type="button"
                onClick={() => setNews(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {showDeleteConfirm && (
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative">
          <button onClick={cancelDelete} className="absolute top-2 right-2">
            <AiOutlineClose className="text-2xl text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 transition-colors" />
          </button>
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Confirm Deletion
          </h2>
          <p className="mb-4 text-gray-800 dark:text-gray-200">
            Are you sure you want to delete this department?
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded dark:bg-red-600 dark:hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? <Loading /> : "Delete"}
            </button>
            <button
              onClick={cancelDelete}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded dark:bg-gray-600 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);

};

export default AddDepartmentOffice;
