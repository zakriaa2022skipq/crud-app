/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import {
  Card,
  CardContent, CardHeader,
  CardTitle
} from "@/components/ui/card";
import { forwardRef } from "react";

const PostCard = forwardRef(({ post, refetch }, ref) => {
  const postDate = new Date(post?.createdAt).toLocaleDateString();
 

  

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
      </Card>
    </div>
  );
});
export default PostCard;
