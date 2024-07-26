import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_STUDENT } from "../Services/utility";
import Loading from "../components/Loading";
import toast from "react-hot-toast";

const FileUpload = () => {
  const auth = useSelector((state) => state.auth.user);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"], // Only accept PDF files
    },
    maxFiles: 1, // Only allow one file
    onDrop: (acceptedFiles) => {
      // Check if the file is a PDF and only one file is accepted
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setError(""); // Clear any previous errors
      }
    },
    onDropRejected: () => {
      // Handle file rejection (e.g., display error message)
      setFile(null); // Clear file state
      setError("Only PDF files are allowed.");
    },
  });

  const checkinFun = async (formData) => {
    try {
      const res = await axios.put(`${API_STUDENT}/student/check-in`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: checkinFun,
    onSuccess: (data) => {
      console.log(data);
      setFile(null);
      toast.success("Check-in successful");
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle file submission
    if (file) {
      const formData = new FormData();
      formData.append("checkin_file", file);
      formData.append("id", auth._id);

      mutate(formData);
    } else {
      console.log("No file selected.");
    }
  };

  return (
    <div>
      <p className="text-center mt-20 text-gray-700 dark:text-gray-300 text-xl font-serif font-semibold">
        Upload a check-in file here Please!
      </p>

      <div className="w-full flex flex-row max-md:flex-col gap-20 max-md:gap-10 p-2 mt-14 max-md:mt-8 justify-center items-center">
        <div
          {...getRootProps()}
          className={`max-w-[600px] cursor-pointer h-48 border-2 border-dashed rounded-lg flex items-center justify-center p-4  ${
            isDragActive
              ? "bg-gray-200 dark:bg-gray-700"
              : "bg-gray-50 dark:bg-gray-800"
          } ${
            isDragActive
              ? "border-blue-500 dark:border-blue-400"
              : "border-gray-300 dark:border-gray-600"
          }`}
        >
          <input {...getInputProps()} />
          <p className="text-gray-500 dark:text-gray-400 text-center">
            {isDragActive
              ? "Drop the PDF here ..."
              : "Drag and drop a PDF file here, or click to select one"}
          </p>
        </div>
        {error && (
          <p className="text-red-500 dark:text-red-400 mt-2">{error}</p>
        )}
        {file && (
          <div className="mt-4">
            <div className="text-gray-700 dark:text-gray-300">
              <p>
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            </div>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 mt-4 px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white dark:text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
            >
              <p>Submit</p>
              {isPending && <Loading />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
