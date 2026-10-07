import { useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PriorityBadge, StatusBadge } from "@/components/status-badge";
import { useProfile, useRequests } from "@/lib/workshop/hooks";
import { formatBdt, formatDate } from "@/lib/utils";
import { STATUSES, type RequestStatus } from "@/lib/workshop/types";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_app/requests/")({
  component: RequestsPage,
});

function RequestsPage() {
  const { data = [], isPending, error } = useRequests();
  const role = useProfile().data?.role;
  const { t, locale, status: statusLabel } = useI18n();
  const [status, setStatus] = useState<string>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return data.filter((row) => {
      if (status !== "all" && row.status !== status) return false;
      const day = row.createdAt.slice(0, 10);
      if (from && day < from) return false;
      if (to && day > to) return false;
      if (!query) return true;
      return (
        row.registrationNo.toLowerCase().includes(query) ||
        row.vehicleLabel.toLowerCase().includes(query) ||
        row.problemDescription.toLowerCase().includes(query) ||
        row.requesterName.toLowerCase().includes(query) ||
        (row.assignedMechanicName ?? "").toLowerCase().includes(query)
      );
    });
  }, [data, status, q, from, to]);

  const title =
    role === "mechanic"
      ? t("navMyJobs")
      : role === "vehicle_user"
        ? t("navMyRequests")
        : t("navAllRequests");

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} {t("shown")}
          </p>
        </div>
        {role && role !== "viewer" && role !== "mechanic" && (
          <Link
            to="/requests/new"
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
          >
            {t("navNew")}
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="request-search" className="sr-only">
            {t("searchJobs")}
          </Label>
          <Input
            id="request-search"
            placeholder={t("searchJobs")}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="lg:w-48">
            <SelectValue placeholder={t("status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allStatuses")}</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {statusLabel(s as RequestStatus)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="grid grid-cols-2 gap-3 lg:w-80">
          <div className="space-y-1.5">
            <Label htmlFor="from" className="text-xs text-muted-foreground">
              {t("from")}
            </Label>
            <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="to" className="text-xs text-muted-foreground">
              {t("to")}
            </Label>
            <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </div>
      </div>

      {isPending && (
        <div className="space-y-2">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
      )}
      {error && (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : t("couldNotLoadJobs")}
        </p>
      )}

      <div className="space-y-2">
        {!isPending && filtered.length === 0 && (
          <Card className="rounded-2xl p-8 text-center text-sm text-muted-foreground">
            {t("noMatch")}
          </Card>
        )}
        {filtered.map((job) => (
          <Link key={job.id} to="/requests/$requestId" params={{ requestId: job.id }}>
            <Card className="rounded-2xl p-4 transition-colors hover:bg-muted/40 sm:p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-medium">{job.registrationNo}</span>
                    <span className="text-xs text-muted-foreground">{job.vehicleLabel}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm">{job.problemDescription}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {job.requesterName} · {formatDate(job.createdAt, locale)}
                    {job.assignedMechanicName ? ` · ${job.assignedMechanicName}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-end">
                  <div className="flex gap-2">
                    <PriorityBadge priority={job.priority} />
                    <StatusBadge status={job.status} />
                  </div>
                  {job.totalCost > 0 && (
                    <span className="text-sm font-medium tabular-nums">{formatBdt(job.totalCost)}</span>
                  )}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
