import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Clock3, Hammer, Timer, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PriorityBadge, StatusBadge } from "@/components/status-badge";
import { useDashboard, useProfile } from "@/lib/workshop/hooks";
import { formatBdt, formatDate } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_app/")({
  component: DashboardPage,
});

function DashboardPage() {
  const { data, isPending, error } = useDashboard();
  const profile = useProfile().data;
  const { t, locale, status } = useI18n();

  if (isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-56" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }
  if (error || !data) {
    return (
      <p className="text-sm text-destructive">
        {error instanceof Error ? error.message : t("couldNotLoadDash")}
      </p>
    );
  }

  const kpis = [
    {
      label: t("kpiOpen"),
      value: String(data.openRequests),
      hint: t("kpiUrgentPending", { urgent: data.urgentOpen, pending: data.pending }),
      icon: Hammer,
    },
    {
      label: t("kpiInBay"),
      value: String(data.inWorkshop),
      hint: t("kpiInBayHint"),
      icon: Clock3,
    },
    {
      label: t("kpiMonth"),
      value: formatBdt(data.monthCost),
      hint: t("kpiPartsLabour"),
      icon: Wallet,
    },
    {
      label: t("kpiTurnaround"),
      value: data.avgTurnaroundDays == null ? "—" : `${data.avgTurnaroundDays}d`,
      hint: t("kpiEntryToDelivery"),
      icon: Timer,
    },
  ];

  const heading =
    profile?.role === "mechanic"
      ? t("headingMechanic")
      : profile?.role === "vehicle_user"
        ? t("headingUser")
        : t("headingFloor");

  const trend = data.costTrend.map((row) => ({
    ...row,
    label: row.month.slice(5),
  }));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {profile ? `${t("signedInAs")} ${profile.name}` : t("overview")}
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">{heading}</h1>
      </div>

      {(data.lowStock > 0 || data.dueService > 0) && (
        <div className="flex flex-wrap gap-2 text-sm">
          {data.dueService > 0 && (
            <Link
              to="/vehicles"
              className="rounded-full bg-warning/12 px-3 py-1 font-medium text-warning"
            >
              {data.dueService} {t("dueService")}
            </Link>
          )}
          {data.lowStock > 0 && (
            <Link
              to="/inventory"
              className="rounded-full bg-destructive/10 px-3 py-1 font-medium text-destructive"
            >
              {data.lowStock} {t("lowStockAlert")}
            </Link>
          )}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="rounded-2xl">
            <CardContent className="flex items-start justify-between p-5">
              <div>
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {kpi.label}
                </p>
                <p className="mt-2 font-display text-3xl leading-none font-semibold tabular-nums">
                  {kpi.value}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">{kpi.hint}</p>
              </div>
              <span className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground">
                <kpi.icon className="size-4" />
              </span>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-5">
        <Card className="rounded-2xl xl:col-span-3">
          <CardHeader>
            <CardTitle>{t("costTrend")}</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend} barCategoryGap="28%">
                <CartesianGrid vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : String(v))}
                />
                <Tooltip
                  cursor={{ fill: "var(--color-muted)" }}
                  formatter={(value) => formatBdt(Number(value ?? 0))}
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                  }}
                />
                <Bar dataKey="cost" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl xl:col-span-2">
          <CardHeader>
            <CardTitle>{t("topVehicles")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.topVehicles.length === 0 && (
              <p className="text-sm text-muted-foreground">{t("noBilled")}</p>
            )}
            {data.topVehicles.map((row) => {
              const max = data.topVehicles[0]?.cost || 1;
              return (
                <div key={row.registrationNo}>
                  <div className="mb-1 flex items-baseline justify-between gap-3">
                    <span className="font-mono text-xs">{row.registrationNo}</span>
                    <span className="text-sm font-medium tabular-nums">{formatBdt(row.cost)}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.max(8, (row.cost / max) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
            <div className="flex flex-wrap gap-2 pt-2">
              {data.statusBreakdown
                .filter((s) => s.count > 0)
                .map((s) => (
                  <span key={s.status} className="text-xs text-muted-foreground">
                    {status(s.status)} {s.count}
                  </span>
                ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("recentJobs")}</CardTitle>
          <Link to="/requests" className="text-sm font-medium text-primary">
            {t("viewAll")}
          </Link>
        </CardHeader>
        <CardContent className="space-y-1 p-0">
          {data.recent.length === 0 && (
            <p className="px-5 pb-5 text-sm text-muted-foreground">{t("noJobsYet")}</p>
          )}
          {data.recent.map((job) => (
            <Link
              key={job.id}
              to="/requests/$requestId"
              params={{ requestId: job.id }}
              className="flex flex-col gap-2 border-t border-border px-5 py-4 hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-mono text-sm">{job.registrationNo}</p>
                <p className="truncate text-sm text-muted-foreground">{job.problemDescription}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <PriorityBadge priority={job.priority} />
                <StatusBadge status={job.status} />
                <span className="text-xs text-muted-foreground">
                  {formatDate(job.createdAt, locale)}
                </span>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
