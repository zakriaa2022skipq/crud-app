/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { forwardRef, useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import axios from "@/src/util/axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const PostCard = forwardRef(({ post, refetch }, ref) => {
  const postDate = new Date(post?.createdAt).toLocaleDateString();
  const navigate = useNavigate();
  const [errMessage, setErrMessage] = useState("");
  const deletePostMutation = useMutation(
    () =>
      axios.delete(`api/v1/post/${post._id}`, {
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
    if (deletePostMutation.isError) {
      toast.error(errMessage);
    }
  }, [errMessage, deletePostMutation.isError]);

  return (
    <div ref={ref} className="mx-auto  self-center">
      <Card className="w-[350px] ">
        <CardHeader>
          <CardTitle>{post?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{post?.text}</p>
          <p>Date posted:{postDate}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={() => {
              navigate(`/post/edit/${post._id}`, { state: { post } });
            }}
            title="edit story"
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              deletePostMutation.mutate();
            }}
          >
            {deletePostMutation.isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Delete
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
});
export default PostCard;
