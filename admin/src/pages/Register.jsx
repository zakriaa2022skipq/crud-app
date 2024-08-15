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
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const Register = () => {
  const navigate = useNavigate();
  const [errMessage, setErrMessage] = useState("");
  const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];
  const MAX_FILE_SIZE = 2000000; //2MB
  const formSchema = z.object({
    username: z.string().min(5).max(30),
    password: z.string().min(5).max(30),
    email: z.string().email(),
    name: z.string().min(1).max(30),
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
      }, "Only .jpg, .jpeg, .png and .webp formats are supported."),
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      name: "",
      email: "",
    },
  });
  const registerMutation = useMutation(
    (registerData) => axios.post("api/v1/admin/register", registerData),
    {
      onSuccess: () => {
        navigate("/signin");
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
    if (registerMutation.isError) {
      toast.error(errMessage);
    }
  }, [errMessage, registerMutation.isError]);

  function onSubmit(values) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.set(key, value);
    });
    registerMutation.mutate(formData);
  }

  return (
    <div className="mx-auto mt-4 w-[min(450px,80vw)] ">
      <Card className="p-4">
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="text-left">
                    <FormLabel>Password</FormLabel>
                  </div>
                  <FormControl>
                    <Input placeholder="password" type="password" {...field} />
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
            <Button type="submit" disabled={registerMutation.isLoading}>
              {registerMutation.isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Register
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                navigate("/signin");
              }}
            >
              Login
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};
export default Register;
