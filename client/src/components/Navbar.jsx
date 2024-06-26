/* eslint-disable react/prop-types */
import { CrossIcon, MenuIcon, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import axios from "@/src/util/axios";
import { updateLoginStatus } from "../features/auth/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = ({ color }) => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const dispatch = useDispatch();
  const { username, profilepic } = useSelector((state) => state.user);
  const logoutMutation = useMutation(
    () =>
      axios({
        url: "api/v1/user/logout",
        method: "POST",
        withCredentials: true,
      }),
    {
      onSuccess: () => {
        dispatch(updateLoginStatus(false));
      },
    }
  );

  useEffect(() => {
    if (isSideBarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isSideBarOpen]);
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
          <ul className="capitalize flex items-center ">
            <li
              className={`${
                color == "white"
                  ? "hover:border-white"
                  : "hover:border-[#381fd1]"
              } mx-4 py-1 border-2 border-transparent  px-2 rounded-md text-[14px] font-bold max-[850px]:hidden`}
            >
              <Link to={"/post/new"}>CREATE POST</Link>
            </li>
            <li
              className={`${
                color == "white"
                  ? "hover:border-white"
                  : "hover:border-[#381fd1]"
              } mx-4 py-1 border-2 border-transparent  px-2 rounded-md text-[14px] font-bold max-[850px]:hidden`}
            >
              <Link to={"/profile/edit"}>EDIT PROFILE</Link>
            </li>

            <li className="ml-auto">
              <Button
                onClick={() => {
                  logoutMutation.mutate();
                }}
                className={` mx-4 py-1 border-2 border-transparent  px-2 rounded-md text-[14px] font-bold max-[850px]:hidden`}
              >
                {logoutMutation.isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                LOG OUT
              </Button>
            </li>
            <li>
              <Link to="/profile/me">
                <div className="flex items-center gap-2 ">
                  {profilepic && (
                    <Avatar title={username}>
                      <AvatarImage
                        src={`${process.env.SERVER_URL}/public/profile/${profilepic}`}
                        alt="profile"
                      />
                    </Avatar>
                  )}
                  <span>{username}</span>
                </div>
              </Link>
            </li>
            {isSideBarOpen && (
              <li className="min-[850px]:hidden">
                <button className="cursor-pointer block">
                  <CrossIcon
                    className="mx-4"
                    size={33}
                    onClick={() => {
                      setIsSideBarOpen(false);
                    }}
                  />
                </button>
              </li>
            )}
            {!isSideBarOpen && (
              <li className="min-[850px]:hidden">
                <button className="cursor-pointer">
                  <MenuIcon
                    className="mx-4"
                    size={33}
                    onClick={() => {
                      setIsSideBarOpen(true);
                    }}
                  />
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
      {isSideBarOpen && (
        <div className="  min-h-[100vh] bg-white ">
          <ul className="text-[#381fd1] bg-white text-sm">
            <li className="py-6 mx-6 border-b border-gray-300 font-bold">
              <Link to={"/profile/edit"}>EDIT PROFILE</Link>
            </li>
            <li className="py-6 mx-6 border-b border-gray-300 font-bold">
              <Link to={"/post/new"}>CREATE POST</Link>
            </li>
            <li className="py-6 mx-6 border-b border-gray-300 font-bold">
              <Button
                onClick={() => {
                  logoutMutation.mutate();
                }}
                className={` mx-4 py-1 border-2 border-transparent  px-2 rounded-md text-[14px] font-bold`}
              >
                {logoutMutation.isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                LOG OUT
              </Button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
export default Navbar;
