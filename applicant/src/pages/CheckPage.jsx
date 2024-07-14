import React, { useState } from "react";
import axios from "axios";
import Loading from "../component/Loading";
import { FaArrowRight } from "react-icons/fa";
import Wait from "../assets/image/wait.svg";
import NoData from '../assets/image/nodata.svg'

const CheckPage = () => {
  const [code, setCode] = useState("");
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
      setIsError(false);
    setDetails(null)
    try {
      // Replace the URL with your API endpoint
      const response = await axios.get(
        `http://localhost:8000/api/applicant/check/${code}`
      );
      setDetails(response.data);
      console.log(response.data);
      setIsLoading(false);
      setCode('')
    } catch (error) {
      console.error("Error fetching details:", error);
      setDetails(null);
      setIsLoading(false);
      setIsError(true)
    }
  };

  return (
    <div className="container mx-auto mt-12 flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold mb-4">Check Your Application Status</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label
            htmlFor="code"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Enter Your Code
          </label>
          <div className="flex items-center gap-4">
            <input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-ful pl-2 p-2 border border-gray-300 rounded-lg focus:outline-none bg-gray-50 mt-1"
              required
            />
            <button
              disabled={isLoading}
              type="submit"
              className="group flex items-center justify-center gap-4 bg-blue-700 hover:bg-blue-700 hover:font-bb transition-all duration-150 text-white border border-blue-700 py-2 px-4 rounded-lg text-center"
            >
              <p className="tracking-wider">Submit</p>
              {isLoading ? (
                <Loading color="ffffff" />
              ) : (
                <FaArrowRight className="text-sm" />
              )}
            </button>
          </div>
        </div>
      </form>

      {isError ? (
        <div className="my-20 flex flex-col gap-6 items-center justify-center">
          <span className="text-red-500 font-semibold">
            Invalid Code
          </span>
          <span className="text-red-500 font-semibold">
            <img src={NoData} className="w-[400px] h-[300px]" />
          </span>
        </div>
      ) : details ? (
        <div className="my-20 w-fit">
          {/* <h2 className="text-xl font-bold mb-2">Details:</h2> */}
          <div
            className="bg-white rounded-lg p-20"
            style={{ boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="mb-4">
              <span className="font-semibold text-gray-700">Name: </span>
              <span className="text-gray-600">
                {details.first_name} {details.last_name}
              </span>
            </div>
            <div className="mb-4">
              <span className="font-semibold text-gray-700">Email: </span>
              <span className="text-gray-600">{details.email}</span>
            </div>
            <div className="mb-4">
              <span className="font-semibold text-gray-700">Department: </span>
              <span className="text-gray-600">{details.department}</span>
            </div>
            <div className="mb-4">
              <span className="font-semibold text-gray-700">
                Phone Number:{" "}
              </span>
              <span className="text-gray-600">{details.phone_no}</span>
            </div>
            <div className="mb-4">
              <span className="font-semibold text-gray-700">
                Department Status:{" "}
              </span>
              <span className="text-gray-600">{details.department_status}</span>
            </div>
            <div className="mb-4">
              <span className="font-semibold text-gray-700">
                College Status:{" "}
              </span>
              <span className="text-gray-600">{details.college_status}</span>
            </div>
          </div>
        </div>
      ) : (
        !isError && (
          <div className="my-20 flex items-center justify-center">
            <img src={Wait} className="w-[400px] h-[350px]" />
          </div>
        )
      )}
    </div>
  );
};

export default CheckPage;
