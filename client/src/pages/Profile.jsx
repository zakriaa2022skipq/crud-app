import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  return (
    <div>
      <Navbar />
      <div className="flex justify-center ">
        <Card className="w-[350px] ">
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
          </CardHeader>
          <CardContent>
            {user.profilepic && (
              <Avatar
                title={user.username}
                className="mx-auto my-8 w-[100px] h-[100px]"
              >
                <AvatarImage
                  src={`${process.env.SERVER_URL}/public/profile/${user.profilepic}`}
                  alt="profile"
                />
              </Avatar>
            )}
            <p>username: {user.username}</p>
            <p>email: {user.email}</p>
            <p>name: {user.name}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              onClick={() => {
                navigate(`/profile/edit`);
              }}
              title="edit story"
            >
              Edit Profile
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
export default Profile;
