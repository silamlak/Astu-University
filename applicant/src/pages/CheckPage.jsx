import React, { useState } from "react";
import axios from "axios";

const CheckPage = () => {
  const [code, setCode] = useState("");
  const [details, setDetails] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace the URL with your API endpoint
      const response = await axios.post("http://localhost:8000/api/check", {
        code,
      });
      setDetails(response.data);
    } catch (error) {
      console.error("Error fetching details:", error);
      setDetails(null);
    }
  };

  return (
    <div className="container mx-auto mt-4">
      <h1 className="text-2xl font-bold mb-4">Check Your Code</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label
            htmlFor="code"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Enter Your Code:
          </label>
          <textarea
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows="4"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>

      {details && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Details:</h2>
          <pre className="bg-gray-100 p-4 rounded border">
            {JSON.stringify(details, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default CheckPage;
