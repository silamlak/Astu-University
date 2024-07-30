import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_STUDENT } from "../Services/utility";
import Loading from "../components/Loading";
import toast from "react-hot-toast";
import { IoCloseSharp } from "react-icons/io5";

const FileUpload = () => {
  const auth = useSelector((state) => state.auth.user);
  const [allowedDates, setAllowedDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [form, setForm] = useState({
    attached_file: null,
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const checkinPage = async (d) => {
    try {
      const res = await axios.post(`${API_STUDENT}/student/check-in/page`, {
        id: d,
      });
      console.log(res.data);

      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["checkinPage"],
    queryFn: () => checkinPage(auth._id),
  });

  useEffect(() => {
    if (data) {
      const dates = data.map((date) => new Date(date.time_to_checkIn));
      setAllowedDates(dates);

      const now = new Date();
      setCurrentMonth(
        now.toLocaleString("default", { month: "long", year: "numeric" })
      );
    }
  }, [data]);

  const checkinFun = async () => {
    try {
      const formData = new FormData();
      formData.append("uid", auth._id);
      formData.append("sid", selectedId);
      formData.append("checkin_file", form.attached_file);
      const payload = {
        id: auth._id,
        _id: selectedId,
        checkin_file: form.attached_file,
      };
      console.log(form.attached_file);
      const res = await axios.put(
        `${API_STUDENT}/student/check-in`,
        {
          id: auth._id,
          _id: selectedId,
          checkin_file: form.attached_file,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            id: auth._id,
            _id: selectedId,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error; // Ensure errors are caught by `mutate`
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: checkinFun,
    onSuccess: () => {
      setSelectedFile(null);
      setIsPopupOpen(false);
      toast.success("Check-in successful");
    },
  });

  const handleFileChange = (e) => {
    setForm({
      ...form,
      attached_file: e.target.files[0],
    });
  };

  const handleSubmit = () => {
    if (form.attached_file && selectedId) {
      const formData = new FormData();
      formData.append("uid", auth._id);
      formData.append("sid", selectedId);
      formData.append("checkin_file", form.attached_file);

      console.log(formData); // Make sure this is correctly logged

      mutate(); // Pass the formData instead of payload
    } else {
      console.log("No file selected or ID missing.");
    }
  };

  const isDateValid = (date) => {
    const formattedDate = new Date(date).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    return formattedDate === currentMonth;
  };

    const viewFile = (file) => {
      window.open(`http://localhost:8000/files/${file}`, "_blank", "noreferrer");
    };

return (
  <div className="file-upload-container bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
    {isLoading ? (
      <Loading />
    ) : (
      <div className="max-w-[1600px] px-4 mx-auto font-sans">
        <table className="min-w-full divide-y mt-16 max-sm:mt-8 divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className=" text-start px-6 py-3 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Date
              </th>
              <th className="text-start px-6 py-3 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Action
              </th>
              <th className=" text-start px-6 py-3 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {allowedDates?.map((date, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {!data[index].checkIn_file ? (
                    <span className="text-gray-900 dark:text-gray-100">
                      {date.toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  ) : (
                    <button
                      onClick={() => viewFile(data[index].checkIn_file)}
                      className="px-4 py-1 bg-slate-300 dark:bg-slate-600 text-small text-blue-500 dark:text-blue-400 hover:underline"
                    >
                      View File
                    </button>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {!data[index].checkIn_file ? (
                    <button
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedId(data[index]._id);
                        setIsPopupOpen(true);
                      }}
                      // disabled={!isDateValid(date) || isPending}
                      className={`px-4 py-2 text-sm rounded-xl ${
                        isPending ? "bg-gray-400" : "bg-blue-500"
                      } text-white dark:${
                        isPending ? "bg-gray-600" : "bg-blue-600"
                      }`}
                    >
                      Attach File
                    </button>
                  ) : (
                    <p className="text-green-500 dark:text-green-400">
                      File Uploaded
                    </p>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    // disabled={!isDateValid(date) || isPending}
                    className={`px-2 py-1 text-sm rounded-md ${
                      isPending ? "bg-gray-400" : "bg-yellow-300"
                    } text-white dark:${
                      isPending ? "bg-gray-600" : "bg-blue-600"
                    }`}
                  >
                    {data[index].checkIn_status}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isPopupOpen && (
          <div className="popup-overlay fixed inset-0 bg-gray-800 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-80 flex items-center justify-center">
            <div className="popup-content bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Upload File
                </h3>
                <button
                  className="dark:text-gray-200 bg-slate-200 text-slate-700 dark:bg-gray-800 "
                  onClick={() => setIsPopupOpen(false)}
                >
                  <IoCloseSharp />
                </button>
              </div>
              <input
                name="attached_file"
                type="file"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-900 dark:text-gray-100"
              />
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className={`mt-4 px-4 py-2 rounded-md ${
                  isPending ? "bg-gray-400" : "bg-blue-500"
                } text-white dark:${isPending ? "bg-gray-600" : "bg-blue-600"}`}
              >
                {isPending ? "Submitting..." : "Submit"}
              </button>
              {/* Uncomment if you want a cancel button */}
              {/* <button
                onClick={() => setIsPopupOpen(false)}
                className="mt-2 px-4 py-2 bg-gray-300 text-black rounded-md dark:bg-gray-600 dark:text-gray-300"
              >
                Cancel
              </button> */}
            </div>
          </div>
        )}
      </div>
    )}
  </div>
);

};

export default FileUpload;
