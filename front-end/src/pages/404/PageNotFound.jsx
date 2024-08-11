import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="bg-[#ecf0fe] min-h-screen flex flex-col items-center justify-center ">
      <div className="text-center p-1">
        <div className="flex items-center md:flex-row flex-col">
        <img src="src/assets/images/404.png" alt="404" className="bg-transparent w-28"/>
        <p className="font-bold text-5xl">  ERROR <span className="text-red-600">404</span> !</p>
        </div>
        <p className="text-xl mt-3 font-semibold mb-3">Sorry, the page not found.</p>
        <p className="mb-6 text-lg">The page you are looking for doesn't exist. Go back...</p>
        <Link to={'/'} className="bg-[#4669ff] hover:bg-[#4159c5] text-white p-2 px-12 rounded-full">Login</Link>
      </div>
    </div>
  );
};

export default PageNotFound;
