/* eslint-disable react/prop-types */
import { CrossIcon, MenuIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

const Navbar = ({ color }) => {
 
  return (
    <div
      className={`max-[850px]:w-full ${
        color === "white" ? "bg-[#381fd3]" : "bg-white"
      } max-w-[100vw]`}
    >
      <div
        className={`${
          color == "white" ? "text-white" : "text-[#381fd1]"
        }  flex min-w-0 w-[95%] mx-auto  py-6 items-center relative z-30 bg-transparent `}
      >
        <div>
          <Link to={"/home"}>
            <h1 className="text-5xl">Blogga</h1>
          </Link>
        </div>
        <div className="flex-1">          
        </div>
      </div>
     
    </div>
  );
};
export default Navbar;
