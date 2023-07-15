import { useQuery } from "@tanstack/react-query";
import { apiConnector } from "../../apiConnector";
import { GET_USER } from "../../apis";

export const useProfile = () =>
  useQuery({
    queryKey: ["profile"],
    queryFn: () => {
      return apiConnector("GET", GET_USER);
    },
    refetchOnWindowFocus: false, // Disable automatic refetching when thewindow regains focus
    refetchOnMount: false, // Disable automatic refetching when the component mounts
    cacheTime: 600000, // Set cache expiry time (e.g., 10 minutes)
    staleTime: 300000,
  });
