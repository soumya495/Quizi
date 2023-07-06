import { Link } from "react-router-dom";
import logo from "../assets/logo-small.png";
import TextInput from "../components/reusable/TextInput";
import { useForm } from "react-hook-form";

export default function ForgotPasswordEmail() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => console.log(data);

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
          <h1 className="text-3xl font-bold mt-3 mb-1 tracking-wide">
            Enter your email address
          </h1>
          <p className="mb-8 max-w-md text-center">
            We will send you an email to verify your account and reset your
            password.
          </p>
          <form
            className="w-11/12 mx-auto md:w-[350px] flex flex-col space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* email */}
            <TextInput
              register={register}
              errors={errors}
              fieldName="email"
              label="Email"
              placeholder="Enter your email address"
              required={true}
              validate={{
                maxLength: (v) =>
                  v.length <= 50 ||
                  "The email should have at most 50 characters",
                matchPattern: (v) =>
                  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                  "Email address must be a valid address",
              }}
            />
            <button className="btn btn-block btn-primary">Submit</button>
          </form>
          <div className="text-sm mt-4">
            <Link to="/login">
              <span className="text-primary font-medium">
                {"<-"} Back to Login
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
