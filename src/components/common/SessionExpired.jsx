import logo from "../../assets/logo-black.png";
import { useUser } from "../../store/useUser";

export default function SessionExpired({ setSessionExpired }) {
  const { setIsAuthenticated } = useUser();

  return (
    <div className="min-h-screen w-full grid place-content-center">
      <div className="card w-96 bg-neutral text-neutral-content">
        <div className="card-body items-center text-center">
          <img
            src={logo}
            width={200}
            loading="lazy"
            className="mx-auto lg:mx-0"
          />
          <h2 className="card-title">Session Expired!</h2>
          <p className="mb-4">Please Log In Again</p>
          <div className="card-actions justify-end">
            <button
              onClick={() => {
                setSessionExpired(false);
                setIsAuthenticated(false);
              }}
              className="btn btn-primary"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
