import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  dashboardData,
  ensureProfile,
  listInventory,
  listNotifications,
  listRequests,
  listStaff,
  listVehicles,
} from "./api";

export function useProfile(enabled = true) {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => ensureProfile(),
    enabled,
    retry: false,
  });
}

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: () => dashboardData(),
  });
}

export function useRequests() {
  return useQuery({
    queryKey: ["requests"],
    queryFn: () => listRequests(),
  });
}

export function useVehicles() {
  return useQuery({
    queryKey: ["vehicles"],
    queryFn: () => listVehicles(),
  });
}

export function useInventory() {
  return useQuery({
    queryKey: ["inventory"],
    queryFn: () => listInventory(),
  });
}

export function useStaff() {
  return useQuery({
    queryKey: ["staff"],
    queryFn: () => listStaff(),
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => listNotifications(),
    refetchInterval: 30_000,
  });
}

export function useInvalidateAll() {
  const qc = useQueryClient();
  return () =>
    qc.invalidateQueries({
      predicate: () => true,
    });
}

export function useMutate<TArgs, TResult>(
  fn: (args: TArgs) => Promise<TResult>,
) {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      void invalidate();
    },
  });
}
