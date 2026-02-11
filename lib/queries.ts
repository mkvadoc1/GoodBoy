import { useMutation, useQuery } from "@tanstack/react-query";
import { contribute, getShelters, getSheltersResults } from "@/lib/api";
import type { ApiError, ContributePayload, ContributeResponse } from "@/lib/api";

export function useShelters(search?: string) {
  return useQuery({
    queryKey: ["shelters", search ?? ""],
    queryFn: () => getShelters(search),
  });
}

export function useSheltersResults(search?: string) {
  return useQuery({
    queryKey: ["shelters-results", search ?? ""],
    queryFn: () => getSheltersResults(search),
  });
}

export function useContribute() {
  return useMutation<ContributeResponse, ApiError<ContributeResponse>, ContributePayload>({
    mutationFn: (payload) => contribute(payload),
  });
}
