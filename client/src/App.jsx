import Home from "@/src/pages/Home";
import axios from "@/src/util/axios";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import "./App.css";
import PrivateRoutes from "./components/PrivateRoute";
import { updateLoginStatus } from "./features/auth/authSlice";
import { updateUserState } from "./features/user/userSlice";
import CatchAll from "./pages/CatchAll";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import EditProfile from "./pages/EditProfile";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import PasswordReset from "./pages/PasswordReset";
import PasswordResetReq from "./pages/PasswordResetReq";
import Profile from "./pages/Profile";
import Register from "./pages/Register";

function App() {
  const dispatch = useDispatch();
  const getUserDetail = () =>
    axios
      .get("api/v1/user/detail", { withCredentials: true })
      .then((response) => response.data);

  const query = useQuery("userDetail", getUserDetail, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
    retry: false,
    onSuccess: (data) => {
      dispatch(updateLoginStatus(true));
      dispatch(updateUserState(data.userDetail));
    },
  });

  return (
    <>
      <div className="App">
        <Toaster position="top-center" closeButton richColors />
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/home" element={<Home />} />
            <Route path="/post/new" element={<CreatePost />} />
            <Route path="/post/edit/:postId" element={<EditPost />} />
            <Route path="/profile/me" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
          </Route>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/password/reqreset" element={<PasswordResetReq />} />
          <Route path="/passwordreset" element={<PasswordReset />} />
          <Route path="*" element={<CatchAll />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
