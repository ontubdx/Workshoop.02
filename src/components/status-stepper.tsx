import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { type RequestStatus } from "@/lib/workshop/types";

const STEPS: RequestStatus[] = [
  "pending",
  "accepted",
  "in_workshop",
  "work_complete",
  "delivered",
];

export function StatusStepper({ status }: { status: RequestStatus }) {
  const { t, status: label } = useI18n();

  if (status === "rejected") {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        <X className="size-4 shrink-0" />
        {t("rejectedBanner")}
      </div>
    );
  }

  const current = STEPS.findIndex((s) => s === status);
  const short: Record<RequestStatus, string> = {
    pending: label("pending"),
    accepted: label("accepted"),
    rejected: label("rejected"),
    in_workshop: t("statusInBay"),
    work_complete: t("completed"),
    delivered: label("delivered"),
  };

  return (
    <ol className="grid grid-cols-5 gap-1 sm:gap-2">
      {STEPS.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={step} className="min-w-0">
            <div
              className={cn(
                "flex h-1.5 overflow-hidden rounded-full",
                done || active ? "bg-primary" : "bg-muted",
              )}
            />
            <p
              className={cn(
                "mt-2 flex items-center gap-1 text-xs leading-tight",
                active
                  ? "font-semibold text-foreground"
                  : done
                    ? "text-foreground"
                    : "text-muted-foreground",
              )}
            >
              {done && <Check className="hidden size-3 shrink-0 sm:inline" />}
              <span className="truncate">{short[step]}</span>
            </p>
          </li>
        );
      })}
    </ol>
  );
}
