import { Link } from "react-router-dom";
import logo from "../assets/logo-small.png";
import OtpInput from "react-otp-input";
import { useState } from "react";
import { useUser } from "../store/useUser";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { apiConnector } from "../services/apiConnector";
import { SIGNUP } from "../services/apis";
import { toast } from "react-hot-toast";

export default function Otp() {
  // state for otp
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  // access zustand store
  const signupData = useUser((state) => state.signupData);
  const setSignupData = useUser((state) => state.setSignupData);

  useEffect(() => {
    if (!signupData) {
      navigate("/signup");
    }
  }, [navigate, signupData]);

  // mutation to verify otp and signup user
  const mutation = useMutation({
    mutationFn: (payload) => {
      return apiConnector("POST", SIGNUP, payload, null, null, true);
    },
    onSuccess: () => {
      // show success toast
      toast.success("Signup successful!");
      // reset the form
      setSignupData(null);
      // redirect to login page
      navigate("/login");
    },
    onError: (error) => {
      // show error toast
      toast.error(error?.response?.data?.message || "Something went wrong!");
      // reset the otp field
      setOtp("");
    },
  });

  // handle Submit button click
  const handleOnClick = () => {
    if (otp.length === 6) {
      mutation.mutate({ ...signupData, otp });
    } else {
      toast.error("Please enter a valid OTP!");
    }
  };

  // handle go back
  const handleGoBack = () => {
    setSignupData(null);
    navigate("/signup");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="flex-1 h-full grid place-content-center">
        <div className="flex flex-col items-center text-neutral-content">
          <Link to="/">
            <img
              src={logo}
              width={60}
              loading="lazy"
              className="mx-auto lg:mx-0"
            />
          </Link>
          <h1 className="text-3xl font-bold mt-3 mb-8 tracking-wide">
            Enter OTP
          </h1>
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderSeparator={<span>-</span>}
            renderInput={(props) => (
              <input disabled={mutation.isLoading} {...props} type="number" />
            )}
            containerStyle={{
              columnGap: "0.25rem",
              marginBottom: "1.5rem",
            }}
            inputStyle={{
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "0.25rem",
            }}
          />
          <button
            disabled={mutation.isLoading}
            onClick={handleOnClick}
            className="btn btn-block btn-primary"
          >
            {mutation.isLoading ? "Loading..." : "Submit"}
          </button>
          <div className="text-sm mt-4">
            <button onClick={handleGoBack} to="/signup">
              <span className="text-primary font-medium">
                {"<-"} Back to Signup
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
