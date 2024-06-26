import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "@/src/util/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import Navbar from "../components/Navbar";

const EditPost = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [errMessage, setErrMessage] = useState("");
  const { state } = useLocation();

  const formSchema = z.object({
    title: z.string().min(5).max(30),
    text: z.string().min(5).max(200),
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: state.post.title,
      text: state.post.text,
    },
  });
  const editPostMutation = useMutation(
    (postData) =>
      axios.put(`api/v1/post/${postId}`, postData, { withCredentials: true }),
    {
      onSuccess: () => {
        navigate("/home");
      },
      onError: (error) => {
        if (error.response) {
          if (typeof error.response.data === "string") {
            setErrMessage(error.response.data);
          }
        } else if (error.request) {
          setErrMessage(error.message);
        } else {
          setErrMessage(error.message);
        }
      },
    }
  );

  useEffect(() => {
    if (editPostMutation.isError) {
      toast.error(errMessage);
    }
  }, [errMessage, editPostMutation.isError]);

  function onSubmit(values) {
    editPostMutation.mutate(values);
  }

  return (
    <div>
      <Navbar />
      <div className="mx-auto mt-10 w-[min(450px,80vw)] ">
        <Card className="p-4">
          <h1>Edit Post</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <div className="text-left">
                      <FormLabel>Title</FormLabel>
                    </div>
                    <FormControl>
                      <Input placeholder="title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <div className="text-left">
                        <FormLabel>Text</FormLabel>
                      </div>
                      <FormControl>
                        <Textarea
                          placeholder="Post text..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Form>
              <Button type="submit" disabled={editPostMutation.isLoading}>
                {editPostMutation.isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                EditPost
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};
export default EditPost;
