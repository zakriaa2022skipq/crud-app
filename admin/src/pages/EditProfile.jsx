import { Avatar, AvatarImage } from "@/components/ui/avatar";
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
import axios from "@/src/util/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import Navbar from "../components/Navbar";
const serverURL = import.meta.env.VITE_SERVER_URL

const EditProfile = () => {
  const navigate = useNavigate();
  const userDetail = useSelector((state) => state.user);
  const [errMessage, setErrMessage] = useState("");
  const queryClient = useQueryClient();
  const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];
  const MAX_FILE_SIZE = 2000000; //2MB
  const formSchema = z.object({
    username: z.string().min(5).max(30).optional().optional().or(z.literal("")),
    email: z
      .string()
      .email()
      .optional()
      .or(z.literal(""))
      .optional()
      .or(z.literal("")),
    name: z.string().min(1).max(30).optional().optional().or(z.literal("")),
    profilepic: z
      .any()
      .refine((file) => {
        return !!file;
      }, "Profile Image is required")
      .refine((file) => {
        return file?.size <= MAX_FILE_SIZE;
      }, "Max file size is 2mb")
      .refine((files) => {
        return ACCEPTED_IMAGE_TYPES.includes(files?.type);
      }, "Only .jpg, .jpeg, .png and .webp formats are supported.")
      .optional(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: userDetail.username,
      name: userDetail.name,
      email: userDetail.email,
    },
  });
  const editProfileMutation = useMutation(
    (updateProfileData) =>
      axios.patch("api/v1/user/edit", updateProfileData, {
        withCredentials: true,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: "userDetail" });
        navigate("/profile/me");
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
    if (editProfileMutation.isError) {
      toast.error(errMessage);
    }
  }, [errMessage, editProfileMutation.isError]);

  function onSubmit(values) {
    Object.keys(values).forEach(
      (k) => (values[k] === "" || values[k] === undefined) && delete values[k]
    );
    editProfileMutation.mutate(values);
  }

  return (
    <div>
      <Navbar />
      <div className="mx-auto mt-4 w-[min(450px,80vw)] ">
        <Card className="p-4">
          <h1>Edit Profile</h1>

          {userDetail?.profilepic && (
            <Avatar
              title={userDetail.username}
              className="mx-auto my-8 w-[100px] h-[100px]"
            >
              <AvatarImage
                src={`${serverURL}/public/profile/${userDetail.profilepic}`}
                alt="profile"
              />
            </Avatar>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <div className="text-left">
                      <FormLabel>Username</FormLabel>
                    </div>
                    <FormControl>
                      <Input placeholder="username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="text-left">
                      <FormLabel>Name</FormLabel>
                    </div>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="text-left">
                      <FormLabel>Email</FormLabel>
                    </div>
                    <FormControl>
                      <Input placeholder="email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="profilepic"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <div className="text-left">
                      <FormLabel>Profile Pic</FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        {...fieldProps}
                        type="file"
                        id="profilepic"
                        accept="image/*"
                        onChange={(event) =>
                          onChange(event.target.files && event.target.files[0])
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={editProfileMutation.isLoading}>
                {editProfileMutation.isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Edit
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};
export default EditProfile;
