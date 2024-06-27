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
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { updateLoginStatus } from "../features/auth/authSlice";
import axios from "@/src/util/axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [errMessage, setErrMessage] = useState("");
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const formSchema = z.object({
    username: z.string().min(5).max(30),
    password: z.string().min(5).max(30),
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const loginMutation = useMutation(
    (loginData) =>
      axios.post("api/v1/admin/login", loginData, { withCredentials: true }),
    {
      onSuccess: () => {
        dispatch(updateLoginStatus(true));
        queryClient.invalidateQueries({ queryKey: "userDetail" });
        navigate("/home");
      },
      onError: (error) => {
        if (error.response) {
          if (typeof error.response.data === "string") {
            setErrMessage(error.response.data);
            console.log("here");
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
    if (loginMutation.isError) {
      toast.error(errMessage);
    }
  }, [errMessage, loginMutation.isError]);

  function onSubmit(values) {
    loginMutation.mutate(values);
  }

  return (
    <div className="mx-auto mt-28 w-[min(450px,80vw)] ">
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
            <Button type="submit" disabled={loginMutation.isLoading}>
              {loginMutation.isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Login
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                navigate("/register");
              }}
            >
              Register
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                navigate("/password/reqreset");
              }}
            >
              Forgot Password
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};
export default Login;
