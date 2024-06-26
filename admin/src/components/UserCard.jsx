/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "@/src/util/axios";
import { Loader2 } from "lucide-react";
import { forwardRef, useEffect, useState } from "react";
import { useMutation } from "react-query";
import { toast } from "sonner";

const UserCard = forwardRef(({ userData, refetch }, ref) => {
  const [errMessage, setErrMessage] = useState("");
  const deleteUserMutation = useMutation(
    () =>
      axios.delete(`api/v1/admin/deleteuser/${userData._id}`, {
        withCredentials: true,
      }),
    {
      onSuccess: () => {
        refetch();
      },
      onError: (error) => {
        if (error.response) {
          if (typeof error.response.data === "string")
            setErrMessage(error.response.data);
        } else if (error.request) {
          setErrMessage(error.message);
        } else {
          setErrMessage(error.message);
        }
      },
    }
  );

  useEffect(() => {
    if (deleteUserMutation.isError) {
      toast.error(errMessage);
    }
  }, [errMessage, deleteUserMutation.isError]);

  return (
    <div ref={ref} className="mx-auto  self-center">
      <Card className="w-[350px] ">
        <CardHeader>
          <CardTitle>Stats</CardTitle>
        </CardHeader>
        <CardContent>
          {userData?.user_data.profilepic && (
            <Avatar>
              <AvatarImage
                src={`${process.env.SERVER_URL}/public/profile/${userData?.user_data.profilepic}`}
                alt="profile"
              />
            </Avatar>
          )}
          <p>No of posts {userData?.posts}</p>
          <p>Username {userData?.user_data.username}</p>
          <p>email {userData?.user_data.email}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={() => {
              deleteUserMutation.mutate();
            }}
          >
            {deleteUserMutation.isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Delete User & Posts
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
});
export default UserCard;
