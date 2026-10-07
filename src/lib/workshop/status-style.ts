import type { RequestStatus } from "./types";

export const STATUS_VARIANT: Record<
  RequestStatus,
  "muted" | "info" | "warning" | "default" | "success" | "destructive"
> = {
  pending: "warning",
  accepted: "info",
  rejected: "destructive",
  in_workshop: "default",
  work_complete: "success",
  delivered: "muted",
};
