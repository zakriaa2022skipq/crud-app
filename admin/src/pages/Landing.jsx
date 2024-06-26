import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();
  return (
    <div className="h-[100vh] flex items-center justify-center w-[850px]  max-w-[80vw] text-center mx-auto">
      <div className=" border-[hsl(180, 27%, 58%)] border p-28">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Blogga
        </h1>
        <h2 className="leading-7 my-6">Admin App</h2>
        <div className="flex flex-col gap-4">
          <Button
            onClick={() => {
              navigate("/signin");
            }}
            sx={{
              color: "hsl(169, 79%, 37%)",
              borderColor: "hsl(180, 27%, 58%)",
              ":hover": {
                borderColor: "hsl(169, 79%, 48%)",
                backgroundColor: "tranparent",
              },
            }}
          >
            Already have an account? Signin
          </Button>
          <Button
            sx={{
              color: "hsl(169, 79%, 37%)",
              borderColor: "hsl(180, 27%, 58%)",
              ":hover": {
                borderColor: "hsl(169, 79%, 48%)",
                backgroundColor: "tranparent",
              },
            }}
            onClick={() => {
              navigate("/register");
            }}
          >
            {`Don't have an account? Signup`}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Landing;
