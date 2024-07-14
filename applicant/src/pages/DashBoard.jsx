import React from 'react'
import { Link } from 'react-router-dom';
import Dash from '../assets/image/dash.png'

const DashBoard = () => {
  return (
    <div className="w-full">
      <section className="bg-gray-700 relative mb-12">
        <img src={Dash} className="w-full h-[600px] object-fit" />
        <div className="dark-overlay absolute  h-[600px] inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0  h-[600px] flex items-center justify-center">
          <div className="px-4 mx-auto max-w-screen-xl text-center py-24 lg:y-56">
            <h1 className="mb-4 text-2xl font-extrabold tracking-tight leading-none text-white md:text-4xl lg:text-5xl">
              Addis Ababa Science and Technology University
            </h1>
            <p className="mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-48">
              Apply for international scholarships and further your education
              abroad through our streamlined application process
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0">
              <Link
                to="/apply"
                className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg border hover:font-bb focus:ring-4 hover:border-none hover:bg-blue-700 transition-all duration-150 focus:outline-none hover:text-white"
              >
                Apply Now
                <svg
                  className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashBoard
