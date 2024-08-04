import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";
import { API, FILEAPI } from "../../utility";
import Loading from "../../components/Loading";

const ArchivedStudentDetail = () => {
  const { id } = useParams();

  const fetchData = async (id) => {
    try {
      const response = await axios.get(`${API}/college/archive/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw new Error("Failed to fetch data");
    }
  };

  const { data, isLoading, isSuccess, isError } = useQuery({
    queryKey: ["archived", id],
    queryFn: () => fetchData(id),
  });

  console.log(data);

  const viewFile = (file) => {
    window.open(`${FILEAPI}/files/${file}`, "_blank", "noreferrer");
  };

  if (isLoading || !data)
    return (
      <div className="w-full flex justify-center mt-10">
        <Loading />
      </div>
    );

  return (
    <div className="my-10">
      {data && !isLoading && (
        <div>
          <div className="p-6 max-w-4xl mx-auto bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
            <h1 className="text-2xl font-bold mb-4">Applicant Details</h1>

            {/* Applicant Information */}
            <div className="flex w-full max-md:flex-col justify-between">
              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">
                  Personal Information
                </h2>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Full Name:</span>{" "}
                    {data?.applicant?.first_name} {data?.applicant?.middle_name}{" "}
                    {data?.applicant?.last_name}
                  </p>
                  <p>
                    <span className="font-medium">Gender:</span>{" "}
                    {data?.applicant?.gender}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {data?.applicant?.email}
                  </p>
                  <p>
                    <span className="font-medium">Phone No:</span>{" "}
                    {data?.applicant?.phone_no}
                  </p>
                  <p>
                    <span className="font-medium">Title:</span>{" "}
                    {data?.applicant?.title}
                  </p>
                  <p>
                    <span className="font-medium">University:</span>{" "}
                    {data?.applicant?.university_name},{" "}
                    {data?.applicant?.university_location}
                  </p>
                  <p>
                    <span className="font-medium">Level of Application:</span>{" "}
                    {data?.applicant?.level_of_application}
                  </p>
                </div>
              </section>

              {/* Application Details */}
              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">
                  Application Information
                </h2>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Application Type:</span>{" "}
                    {data?.applicant?.application_type}
                  </p>
                  <p>
                    <span className="font-medium">Department:</span>{" "}
                    {data?.applicant?.department}
                  </p>
                  <p>
                    <span className="font-medium">College Status:</span>{" "}
                    {data?.applicant?.college_status}
                  </p>
                  <p>
                    <span className="font-medium">Department Status:</span>{" "}
                    {data?.applicant?.department_status}
                  </p>
                  <p>
                    <span className="font-medium">Confirmation Code:</span>{" "}
                    {data?.applicant?.confirmation_code}
                  </p>
                </div>
              </section>
            </div>

            {/* Attached Files */}
            <section>
              <h2 className="text-xl font-semibold mb-2">Attached Files</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li
                  onClick={() => viewFile(data?.applicant?.attached_file)}
                  className="bg-gray-100 cursor-pointer p-3 rounded-md shadow-sm dark:bg-gray-700"
                >
                  <p>
                    <span className="font-medium">Attached File:</span>{" "}
                    {data?.applicant?.attached_file}
                  </p>
                </li>
                <li
                  onClick={() => viewFile(data?.applicant?.college_minute)}
                  className="bg-gray-100 cursor-pointer p-3 rounded-md shadow-sm dark:bg-gray-700"
                >
                  <p>
                    <span className="font-medium">College Minute:</span>{" "}
                    {data?.applicant?.college_minute}
                  </p>
                </li>
                <li
                  onClick={() => viewFile(data?.applicant?.department_minute)}
                  className="bg-gray-100 cursor-pointer p-3 rounded-md shadow-sm dark:bg-gray-700"
                >
                  <p>
                    <span className="font-medium">Department Minute:</span>{" "}
                    {data?.applicant?.department_minute}
                  </p>
                </li>
              </ul>
            </section>
          </div>

          <div className="max-w-4xl mx-auto bg-white p-6 mt-6 rounded-lg dark:bg-gray-800 dark:text-white">
            {/* Duration Information */}
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-2">
                Duration Information
              </h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">From:</span>{" "}
                  {data?.duration?.from
                    ? new Date(data.duration.from).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>
                  <span className="font-medium">To:</span>{" "}
                  {data?.duration?.to
                    ? new Date(data.duration.to).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </section>

            {/* Previous Durations */}
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Previous Durations</h2>
              <ul className="list-disc pl-5 space-y-4">
                {data?.duration?.previousDurations?.map(
                  (prevDuration, index) => (
                    <div key={index} className="flex gap-6">
                      <li className="bg-gray-100 p-3 rounded-md shadow-sm dark:bg-gray-700 dark:text-white">
                        <p>
                          <span className="font-medium">From:</span>{" "}
                          {new Date(prevDuration.from).toLocaleDateString()}
                        </p>
                        <p>
                          <span className="font-medium">To:</span>{" "}
                          {new Date(prevDuration.to).toLocaleDateString()}
                        </p>
                      </li>
                      <div>
                        <div
                          onClick={() =>
                            viewFile(data?.duration?.update_file?.[index])
                          }
                          className="bg-gray-100 p-3 cursor-pointer rounded-md shadow-sm dark:bg-gray-700 dark:text-white"
                        >
                          <p>
                            <span className="font-medium">File:</span>{" "}
                            {data?.duration?.update_file?.[index]}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </ul>
            </section>
          </div>

          <div className="p-6 max-w-4xl mt-10 mx-auto shadow-md rounded-lg bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
            <h1 className="text-2xl font-bold mb-4">Student Details</h1>

            {/* Personal Information */}
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-2">
                Personal Information
              </h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {data?.student?.email}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  {data?.student?.status}
                </p>
              </div>
            </section>

            {/* Files Information */}
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Files Information</h2>
              <div className="space-y-2">
                <p
                  className="cursor-pointer"
                  onClick={() => viewFile(data?.student?.file)}
                >
                  <span className="font-medium">Agreement File:</span>{" "}
                  {data?.student?.file}
                </p>
                <p
                  className="cursor-pointer"
                  onClick={() => viewFile(data?.student?.file)}
                >
                  <span className="font-medium">Finished File:</span>{" "}
                  {data?.student?.finished_file}
                </p>
              </div>
            </section>

            <div className="p-6 max-w-4xl mx-auto shadow-md rounded-lg bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
              <h1 className="text-2xl font-bold mb-4">Files Details</h1>

              {/* Files Information */}
              <section>
                <h2 className="text-xl font-semibold mb-2">Check-in Files</h2>
                <ul className="list-disc pl-5 space-y-4">
                  {data?.files?.map((file, index) => (
                    <li
                      key={index}
                      className="bg-gray-100 p-4 rounded-md shadow-sm dark:bg-gray-700"
                    >
                      <div className="flex flex-col space-y-2">
                        <p
                          className="cursor-pointer"
                          onClick={() => viewFile(data?.student.file)}
                        >
                          <span className="font-medium">File:</span>{" "}
                          {file?.checkIn_file}
                        </p>
                        <p>
                          <span className="font-medium">Status:</span>{" "}
                          {file?.checkIn_status}
                        </p>
                        <p>
                          <span className="font-medium">Time to Check-In:</span>{" "}
                          {new Date(file?.time_to_checkIn).toLocaleDateString()}
                        </p>
                        <p>
                          <span className="font-medium">Created At:</span>{" "}
                          {new Date(file?.createdAt).toLocaleDateString()}
                        </p>
                        <p>
                          <span className="font-medium">Updated At:</span>{" "}
                          {new Date(file?.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </div>
      )}
      {isError && <div>Error loading data.</div>}
    </div>
  );
};

export default ArchivedStudentDetail;
