import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRequests } from "@/lib/workshop/hooks";
import { formatBdt, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/status-badge";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_app/reports")({
  component: ReportsPage,
});

function downloadCsv(name: string, rows: string[][]) {
  const body = rows
    .map((r) => r.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([body], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function ReportsPage() {
  const { data = [], isPending } = useRequests();
  const { t, locale, status } = useI18n();
  const billed = data.filter((r) => r.status !== "rejected");
  const total = billed.reduce((s, r) => s + r.totalCost, 0);
  const complete = billed.filter((r) => r.status === "delivered" || r.status === "work_complete");

  const byDept = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of billed) {
      const key = r.department || t("unassigned");
      map.set(key, (map.get(key) ?? 0) + r.totalCost);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [billed, t]);

  function exportCsv() {
    downloadCsv("workshop-report.csv", [
      [
        "Registration",
        "Vehicle",
        "Department",
        "Status",
        "Priority",
        "Requester",
        "Mechanic",
        "Entry",
        "Delivery",
        "Labour",
        "Total",
      ],
      ...data.map((r) => [
        r.registrationNo,
        r.vehicleLabel,
        r.department ?? "",
        status(r.status),
        r.priority,
        r.requesterName,
        r.assignedMechanicName ?? "",
        r.entryDate ?? "",
        r.actualDeliveryDate ?? r.tentativeDeliveryDate ?? "",
        String(Math.round(r.laborCost)),
        String(Math.round(r.totalCost)),
      ]),
    ]);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">{t("reports")}</h1>
          <p className="text-sm text-muted-foreground">{t("reportsLead")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCsv}>
            {t("exportCsv")}
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            {t("printPdf")}
          </Button>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card className="rounded-2xl">
          <CardContent className="p-5">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">{t("jobs")}</p>
            <p className="mt-2 font-display text-3xl font-semibold tabular-nums">{data.length}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-5">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">{t("completed")}</p>
            <p className="mt-2 font-display text-3xl font-semibold tabular-nums">{complete.length}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-5">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">{t("totalCost")}</p>
            <p className="mt-2 font-display text-3xl font-semibold tabular-nums">{formatBdt(total)}</p>
          </CardContent>
        </Card>
      </section>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>{t("costByDept")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {byDept.map(([dept, cost]) => (
            <div key={dept} className="flex items-center justify-between text-sm">
              <span>{dept}</span>
              <span className="font-medium tabular-nums">{formatBdt(cost)}</span>
            </div>
          ))}
          {byDept.length === 0 && <p className="text-sm text-muted-foreground">{t("noCostData")}</p>}
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-2xl">
        {isPending ? (
          <p className="p-6 text-sm text-muted-foreground">{t("loading")}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("vehicle")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead className="hidden md:table-cell">{t("entry")}</TableHead>
                <TableHead>{t("total")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <p className="font-mono text-sm">{r.registrationNo}</p>
                    <p className="text-xs text-muted-foreground">{r.department}</p>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={r.status} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(r.entryDate, locale)}</TableCell>
                  <TableCell className="tabular-nums">{formatBdt(r.totalCost)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
