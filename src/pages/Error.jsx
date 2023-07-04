import { ReactComponent as ErrorSvg } from "../assets/svgs/error.svg";
import { Link } from "react-router-dom";
import logo from "../assets/logo-black.png";

export default function Error() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <img src={logo} width={250} loading="lazy" className="mx-auto lg:mx-0" />
      <div className="w-[300px] xl:w-[400px] aspect-square mb-12 rounded-lg lg:mb-0">
        <ErrorSvg />
      </div>
      <Link to="/">
        <button className="btn btn-primary block mx-auto lg:mx-0">
          Back To Home
        </button>
      </Link>
    </div>
  );
}
