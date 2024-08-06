import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DashImage1 from "../assets/image/cs.jpg";
import DashImage2 from "../assets/image/dash.png";

const DashBoard = () => {
  const settings = {
    fade: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 1000,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="w-full bg-white">
      <section className="bg-white relative pb-12 overflow-hidden">
        <div className="slider-container">
          <Slider {...settings}>
            <div className="relative h-[600px]">
              <img
                src={DashImage1}
                alt="Slide 2"
                className="w-full h-full object-cover"
              />
              <div className="absolute flex items-center justify-center inset-0 p-8 text-white bg-opacity-20 bg-black">
                <div>
                  <h3 className="text-5xl text-center max-md:text-3xl max-w-6xl font-bold">
                    ADDIS ABABA SCIENCE AND TECHNOLOGY UNIVERSITY
                  </h3>
                  <p className="max-sm:text-md text-center text-xl max-w-6xl mt-4">
                    College of Natural and Applied Science (CNAS)
                  </p>
                  <div className="w-full flex justify-center mt-4">
                    <Link
                      to="/apply"
                      className="text-center text-slate-100 hover:text-slate-200 p-2 px-4 hover:bg-blue-700 bg-blue-500 cursor-pointer rounded w-fit"
                    >
                      Apply
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[600px]">
              <img
                src={DashImage2}
                alt="Slide 1"
                className="w-full h-full object-cover"
              />
              <div className="absolute flex items-center justify-center inset-0 p-8 text-white bg-opacity-20 bg-black">
                <div className="">
                  <h3 className="text-5xl text-center max-md:text-3xl font-bold">
                    Application Letter Submission
                  </h3>
                  <p className="max-sm:text-md text-center text-xl max-w-4xl mt-4">
                    Submit your application letter here to apply for the
                    opportunity. Make sure to provide all required details and
                    follow the guidelines for a successful submission.
                  </p>
                  <div className="w-full flex justify-center mt-4">
                    <Link
                      to="/apply"
                      className="text-center text-slate-100 hover:text-slate-200 p-2 px-4 hover:bg-blue-700 bg-blue-500 cursor-pointer rounded w-fit"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </section>
    </div>
  );
};

export default DashBoard;
