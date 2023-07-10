import { useQuery } from "@tanstack/react-query";
import { apiConnector } from "../../apiConnector";
import { GET_USER } from "../../apis";

export const useProfile = () =>
  useQuery({
    queryKey: ["profile"],
    queryFn: () => {
      return apiConnector("GET", GET_USER);
    },
  });
