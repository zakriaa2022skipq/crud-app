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

const PasswordResetReq = () => {
  const navigate = useNavigate();
  const [errMessage, setErrMessage] = useState("");

  const formSchema = z.object({
    email: z.string().email(),
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const requestResetMutation = useMutation(
    (reqData) => axios.post("api/v1/auth/reqpasswordreset", reqData),
    {
      onSuccess: () => {
        toast.info("Click the link sent to given email");
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
    if (requestResetMutation.isError) {
      toast.error(errMessage);
    }
  }, [errMessage, requestResetMutation.isError]);
  function onSubmit(values) {
    requestResetMutation.mutate(values);
  }

  return (
    <div className="mx-auto mt-28 w-[min(450px,80vw)] ">
      <Card className="p-4">
        <h1>Password Reset</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="text-left">
                    <FormLabel>Email</FormLabel>
                  </div>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={requestResetMutation.isLoading}>
              {requestResetMutation.isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Request Reset
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
export default PasswordResetReq;
