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
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const PasswordReset = () => {
  const navigate = useNavigate();
  const [errMessage, setErrMessage] = useState("");
  const [currParam] = useSearchParams();
  const formSchema = z.object({
    password: z.string().min(5).max(30),
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });
  const ResetPasswordMutation = useMutation(
    (reqData) => axios.post("api/v1/auth/passwordreset", reqData),
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
    if (ResetPasswordMutation.isError) {
      toast.error(errMessage);
    }
  }, [errMessage, ResetPasswordMutation.isError]);
  function onSubmit(values) {
    const token = currParam.get("token");
    values["token"] = token;
    ResetPasswordMutation.mutate(values);
  }

  return (
    <div className="mx-auto mt-28 w-[min(450px,80vw)] ">
      <Card className="p-4">
        <h1>Password Reset</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="text-left">
                    <FormLabel>Password</FormLabel>
                  </div>
                  <FormControl>
                    <Input
                      placeholder="new password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={ResetPasswordMutation.isLoading}>
              {ResetPasswordMutation.isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Reset Password
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                navigate("/signin");
              }}
            >
              Signin
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};
export default PasswordReset;
