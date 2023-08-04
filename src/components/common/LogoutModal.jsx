import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { apiConnector } from "../../services/apiConnector";
import { LOGOUT } from "../../services/apis";
import { useUser } from "../../store/useUser";
import { useNavigate } from "react-router-dom";

export default function LogoutModal() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useUser();

  // mutation for logout
  const mutation = useMutation({
    mutationFn: () => {
      return apiConnector("POST", LOGOUT);
    },
    onSuccess: () => {
      setIsAuthenticated(false);
      navigate("/login");
      toast.success("Logged Out Successfully");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return (
    <dialog id="logout_modal" className="modal">
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">Logout !</h3>
        <p className="py-4">Are you sure you want to Logout </p>
        <div className="space-x-4 mt-3">
          <button onClick={mutation.mutate} className="btn btn-primary">
            Logout
          </button>
          <button className="btn">Cancel</button>
        </div>
      </form>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
