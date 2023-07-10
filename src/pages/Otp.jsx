import { Link } from "react-router-dom";
import logo from "../assets/logo-small.png";
import OtpInput from "react-otp-input";
import { useState } from "react";
import { useUser } from "../store/useUser";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { apiConnector } from "../services/apiConnector";
import { FORGOT_PASSWORD, SEND_OTP, SIGNUP } from "../services/apis";
import { toast } from "react-hot-toast";

export default function Otp() {
  // state for otp
  const [otp, setOtp] = useState("");
  // react router navigate hook
  const navigate = useNavigate();

  // access zustand store
  const { otpType, payload, setOtpType, setPayload } = useUser();

  useEffect(() => {
    // if otpType or payload is not set, redirect to signup page
    if (!(otpType && payload)) {
      navigate("/signup");
    }
    console.log("payload", payload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // mutation to signup user OR verify otp
  const mutation = useMutation({
    mutationFn: (payload) => {
      const API_URL = otpType === "signup" ? SIGNUP : FORGOT_PASSWORD;
      return apiConnector("POST", API_URL, payload);
    },
    onSuccess: () => {
      // show success toast
      toast.success(
        otpType === "signup"
          ? "Signup successful!"
          : "Password reset successful!"
      );
      // reset the global state
      setOtpType(null);
      setPayload(null);
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

  // mutation to re-send otp to email
  const resendOtpMutation = useMutation({
    mutationFn: (payload) => {
      return apiConnector("POST", SEND_OTP, payload);
    },
    onSuccess: () => {
      // show success toast
      toast.success("OTP sent successfully!");
    },
    onError: (error) => {
      // show error toast
      toast.error(error?.response?.data?.message || "Something went wrong!");
    },
  });

  // handle Submit button click
  const handleOnClick = () => {
    if (otp.length === 6) {
      mutation.mutate({ ...payload, otp });
    } else {
      toast.error("Please enter a valid OTP!");
    }
  };

  // handle re-send otp button click
  const handleResendOtp = () => {
    resendOtpMutation.mutate({ email: payload?.email, type: otpType });
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
              <input
                disabled={mutation.isLoading || resendOtpMutation.isLoading}
                {...props}
                type="number"
              />
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
            disabled={mutation.isLoading || resendOtpMutation.isLoading}
            onClick={handleOnClick}
            className="btn btn-block btn-primary"
          >
            {mutation.isLoading || resendOtpMutation.isLoading
              ? "Loading..."
              : "Submit"}
          </button>
          <p className="text-sm mt-4">
            Didn&apos;t receive OTP ?{" "}
            <button onClick={handleResendOtp}>
              <span className="text-primary font-medium">Resend OTP</span>
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
