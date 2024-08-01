import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API, FILEAPI } from "../../utility";
import { useDispatch, useSelector } from "react-redux";
import { updateState } from "../../api/features/applicationList";
import Loading from "../Loading";
import { AiOutlineClose } from "react-icons/ai";
import toast from "react-hot-toast";
import { FaArrowRightLong } from "react-icons/fa6";

const StudentDetail = ({ d, sIs }) => {
  const auth = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [status, setStatus] = useState("");
  const [file, setFile] = useState(null);
  const [showFileInput, setShowFileInput] = useState(false);
  const [viewHistory, setViewHistory] = useState(false);

  const [form, setForm] = useState({
    attached_file: null,
    from_date: new Date(d.duration.from).toISOString().split("T")[0],
    to_date: new Date(d.duration.to).toISOString().split("T")[0],
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStatusChange = async (status) => {
    try {
      const formData = new FormData();
      formData.append("college_status", status);
      formData.append("college_minute", form.attached_file);

      const res = await axios.put(
        `${API}/college/application/status/${d._id}`,
        formData
      );

      const dis = {
        id: d._id,
        status,
        role_based: auth.role_based,
      };
      dispatch(updateState(dis));
      sIs(false);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleFileChange = (e) => {
    setForm({
      ...form,
      attached_file: e.target.files[0],
    });
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("from_date", form.from_date);
      formData.append("to_date", form.to_date);
      if (form.attached_file) {
        formData.append("attached_file", form.attached_file);
      }
      formData.append("id", d.duration._id);

      await axios.put(`${API}/college/student/renewal`, formData);
      toast.success("Application updated successfully");
      sIs(false);
    } catch (error) {
      setError("Error updating application");
      console.error("Error updating application:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleUpdateStatus = async (id) => {
    try {
      await axios.put(`${API}/college/student/checkin/status`, { id });
      toast.success("CheckIn Seen");
      sIs(false);
    } catch (error) {
      console.error("Error updating application:", error);
    }
  };

  if (!d)
    return (
      <div className="text-center text-white">
        <Loading />
      </div>
    );

  const handleStatussChange = (e) => {
    const selectedStatus = e.target.value;
    setStatus(selectedStatus);
    setShowFileInput(selectedStatus !== "");
  };

  const handleFilesChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleStudentStatus = async () => {
    if (!status) {
      return toast.error("Please select a status.");
    }
    console.log(d?._id);

    const formData = new FormData();
    formData.append("id", d?._id);
    formData.append("status", status);
    if (file) {
      formData.append("file", file);
    }

    try {
      await axios.put(
        `${API}/college/student/status`,
        { file },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            id: d?._id,
            status: status,
          },
        }
      );
      toast.success("Student status updated successfully");
      sIs(false);
    } catch (error) {
      console.error("Error updating student status:", error);
      toast.error("Failed to update student status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "learning":
        return "text-green-600";
      case "rejected":
        return "text-red-800";
      case "pending":
        return "text-yellow-800";
      default:
        return "";
    }
  };

  const changeViewHistory = () => {
    setViewHistory(!viewHistory);
  };

  const viewFile = (file) => {
    window.open(`${FILEAPI}/files/${file}`, "_blank", "noreferrer");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-600 bg-opacity-75 flex justify-center items-center p-6">
      <div className="mx-auto bg-white dark:bg-gray-800 max-h-[600px] overflow-y-auto shadow-lg rounded-lg relative">
        <h1 className="text-2xl font-bold mb-6 sticky top-0 z-40 w-full h-[50px] text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 p-4">
          <button onClick={() => sIs(false)} className="absolute top-5 right-5">
            <AiOutlineClose className="p-1 font-extrabold bg-white text-2xl rounded-full hover:bg-slate-400 transition-all duration-100" />
          </button>
          Application Details
        </h1>
        <div className="flex justify-between gap-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 p-6 max-h-[60vh] overflow-y-auto">
            {/* Existing Details */}
            <div>
              <p className="text-gray-600 dark:text-gray-100">First Name</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {d.application?.first_name}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-100">Last Name</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {d.application?.last_name}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-100">Email</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {d.email}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-100">Phone Number</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {d.application?.phone_no}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-100">Department</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {d.application?.department}
              </p>
            </div>

            <div>
              <p className="text-gray-600 dark:text-gray-100">CheckIn File</p>
              {d.checkin_files?.map((file) => (
                <div key={file} className="flex gap-4">
                  <button
                    onClick={() => viewFile(file.checkIn_file)}
                    className="text-md dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                  >
                    View File
                  </button>
                  {file.checkIn_status === "Not-Seen" ? (
                    <button
                      onClick={() => handleUpdateStatus(file._id)}
                      className="text-md dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                    >
                      {file.checkIn_status}
                    </button>
                  ) : (
                    <p className="text-md dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                      Verifyed
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div>
              <p className="text-gray-600 dark:text-gray-100">fINISHED File</p>
              <div className="flex gap-4">
                <button
                  onClick={() => viewFile(d.finished_file)}
                  className="text-md dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                >
                  View File
                </button>
              </div>
            </div>

            <div>
              <p className="text-gray-600 dark:text-gray-100">
                Learning Status
              </p>
              <p
                className={`text-sm text-gray-800  dark:text-gray-200 uppercase ${getStatusColor(
                  d.status
                )}`}
              >
                {d.status}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-100">Duration Time</p>
              <div className="flex items-center gap-2">
                <div>
                  <p className="text-sm text-gray-800 dark:text-white">
                    {new Date(d.duration.from).toLocaleDateString()}
                  </p>
                </div>
                <FaArrowRightLong className="text-gray-600 dark:text-gray-100" />
                <div>
                  <p className="text-sm text-gray-800 dark:text-white">
                    {new Date(d.duration.to).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {d.duration?.previousDurations.length < 2 && (
                <button
                  onClick={() => setIsUpdating(true)}
                  className="bg-blue-500 hover:bg-blue-700 block text-white font-bold py-1 px-4 text-sm mt-2 rounded"
                >
                  Renew
                </button>
              )}
            </div>

            {d.status !== 'learning' && (
              <div className="flex gap-2 p-4">
                <div className="relative">
                  <label
                    htmlFor="status"
                    className="block text-gray-600 dark:text-gray-300 mb-2"
                  >
                    Student Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={status}
                    onChange={handleStatussChange}
                    className="w-full p-2 border bg-gray-50 text-gray-950 rounded-md dark:bg-gray-700 dark:text-gray-200"
                  >
                    <option value="">Select Status</option>
                    <option value="Finished Reinstated">
                      Finished Reinstated
                    </option>
                    <option value="Finished Dismissed">
                      Finished Dismissed
                    </option>
                  </select>

                  {showFileInput && (
                    <div className="mt-4">
                      <label
                        htmlFor="file"
                        className="block text-gray-600 dark:text-gray-300 mb-2"
                      >
                        Attach File
                      </label>
                      <input
                        type="file"
                        id="file"
                        accept=".pdf"
                        name="file"
                        onChange={handleFilesChange}
                        className="w-full p-2 bg-gray-50 text-gray-950 border rounded-md dark:bg-gray-700 dark:text-gray-200"
                      />
                    </div>
                  )}

                  {(status || file) && (
                    <button
                      onClick={handleStudentStatus}
                      className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Submit Status
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="p-4">
            {d.duration?.previousDurations.length !== 0 && (
              <button
                onClick={changeViewHistory}
                className=" text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 shadow-xl"
              >
                {viewHistory ? "Close Renewal History" : "View Renewal History"}
              </button>
            )}
            {d.duration?.previousDurations && viewHistory && (
              <div className="flex flex-col gap-2 border border-gray-600 w-fit p-2 mt-4">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        From
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        To
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {d.duration.previousDurations?.map((history, index) => (
                      <tr key={history._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                          {new Date(history.from).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {new Date(history.to).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            className="text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                            onClick={() =>
                              viewFile(d.duration.update_file[index])
                            }
                          >
                            View File
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Update Popup */}
        {isUpdating && (
          <div className="fixed inset-0 z-60 flex justify-center z-40 items-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative">
              <button
                onClick={() => setIsUpdating(false)}
                className="absolute top-2 right-2"
              >
                <AiOutlineClose className="text-2xl text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 transition-colors" />
              </button>
              <h2 className="text-xl font-bold mb-4">Update Application</h2>
              <div className="mb-4">
                <label
                  htmlFor="from_date"
                  className="block text-gray-600 dark:text-gray-300 mb-2"
                >
                  From Date
                </label>
                <input
                  type="date"
                  id="from_date"
                  name="from_date"
                  value={form.from_date}
                  onChange={(e) =>
                    setForm({ ...form, from_date: e.target.value })
                  }
                  className="w-full p-2 bg-gray-50 text-gray-950 border rounded-md dark:bg-gray-700 dark:text-gray-200"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="to_date"
                  className="block text-gray-600 dark:text-gray-300 mb-2"
                >
                  To Date
                </label>
                <input
                  type="date"
                  id="to_date"
                  name="to_date"
                  value={form.to_date}
                  onChange={(e) =>
                    setForm({ ...form, to_date: e.target.value })
                  }
                  className="w-full p-2 border bg-gray-50 text-gray-950 rounded-md dark:bg-gray-700 dark:text-gray-200"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="attached_file"
                  className="block text-gray-600 dark:text-gray-300 mb-2"
                >
                  File Upload
                </label>
                <input
                  type="file"
                  id="attached_file"
                  accept=".pdf"
                  name="attached_file"
                  onChange={handleFileChange}
                  className="w-full p-2 border bg-gray-50 text-gray-950 rounded-md dark:bg-gray-700 dark:text-gray-200"
                />
              </div>
              {isLoading ? (
                <Loading />
              ) : (
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleUpdate}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Submit
                  </button>
                  {error && <p className="text-red-500">{error}</p>}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDetail;
