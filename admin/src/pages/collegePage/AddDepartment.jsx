import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../utility";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete, AiOutlineClose } from "react-icons/ai";
import Loading from "../../components/Loading";
import toast from "react-hot-toast";

const fetchDepartments = async () => {
  const response = await axios.get(`${API}/college/departmet`);
  return response.data;
};

const AddDepartment = () => {
  const [form, setForm] = useState({ name: "", description: "" });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [news, SetNews] = useState(false);
  const queryClient = useQueryClient();

  const { data: departments = [], isLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments
});

  const { isPending: isAdding, mutate: addDepartment } = useMutation({
    mutationFn: async (formData) => {
      await axios.post(`${API}/college/add/department`, formData);
    },
    onSuccess: () => {
      SetNews(false);
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
  }

  if (isLoading) return <Loading />;

return (
  <div className="p-6 bg-white dark:bg-gray-900">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        Departments
      </h2>
      <button
        onClick={() => SetNews(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md dark:bg-blue-600 dark:hover:bg-blue-700"
      >
        <AiOutlinePlus /> Add Department
      </button>
    </div>

    <table className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-md">
      <thead className="bg-gray-200 dark:bg-gray-700">
        <tr>
          <th className="py-2 px-4 border-b text-gray-800 dark:text-gray-200">
            Name
          </th>
          <th className="py-2 px-4 border-b text-gray-800 dark:text-gray-200">
            Description
          </th>
          <th className="py-2 px-4 border-b text-gray-800 dark:text-gray-200">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {departments.map((department) => (
          <tr key={department._id} className="text-gray-800 dark:text-gray-200">
            <td className="py-2 px-4 border-b">{department.name}</td>
            <td className="py-2 px-4 border-b">{department.description}</td>
            <td className="py-2 px-4 border-b flex gap-2">
              <button
                onClick={() => handleEdit(department)}
                className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <AiOutlineEdit />
              </button>
              <button
                onClick={() => handleDelete(department._id)}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <AiOutlineDelete />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

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
            onClick={() => SetNews(false)}
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
                onClick={() => SetNews(false)}
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

export default AddDepartment;
