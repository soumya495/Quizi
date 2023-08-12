import { useQuery } from "@tanstack/react-query";
import { apiConnector } from "../../apiConnector";
import { GET_CREATED_QUIZZES, GET_QUIZ_DETAILS } from "../../apis";
import { useSearchParams } from "react-router-dom";

export const useCreatedQuizzes = () =>
  useQuery({
    queryKey: ["createdQuizzes"],
    queryFn: () => {
      return apiConnector("GET", GET_CREATED_QUIZZES);
    },
    refetchOnWindowFocus: false, // Disable automatic refetching when thewindow regains focus
    refetchOnMount: false, // Disable automatic refetching when the component mounts
    cacheTime: 600000, // Set cache expiry time (e.g., 10 minutes)
    staleTime: 300000,
  });

export const useQuizDetails = (quizId) => {
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;

  return useQuery({
    queryKey: ["quizDetails", quizId, page],
    queryFn: () => {
      return apiConnector("GET", `${GET_QUIZ_DETAILS}/${quizId}?page=${page}`);
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false, // Disable automatic refetching when thewindow regains focus
    refetchOnMount: false, // Disable automatic refetching when the component mounts
    cacheTime: 600000, // Set cache expiry time (e.g., 10 minutes)
    staleTime: 300000,
  });
};
