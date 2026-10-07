import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { importVehicles, listRequests, upsertVehicle } from "@/lib/workshop/api";
import { useProfile, useVehicles } from "@/lib/workshop/hooks";
import { parseCsv } from "@/lib/utils";
import { StatusBadge } from "@/components/status-badge";
import type { Vehicle } from "@/lib/workshop/types";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_app/vehicles")({
  component: VehiclesPage,
});

function emptyForm() {
  return {
    id: "",
    registrationNo: "",
    type: "Van",
    brand: "",
    model: "",
    department: "",
    assignedDriver: "",
    odometerKm: "",
    serviceIntervalKm: "5000",
  };
}

function VehiclesPage() {
  const { data = [], isPending, refetch } = useVehicles();
  const role = useProfile().data?.role;
  const isAdmin = role === "admin";
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [historyId, setHistoryId] = useState<string | null>(null);
  const jobs = useQuery({
    queryKey: ["requests"],
    queryFn: () => listRequests(),
  });

  const filtered = data.filter((v) => {
    const hay = `${v.registrationNo} ${v.brand} ${v.model} ${v.department} ${v.assignedDriver}`.toLowerCase();
    return hay.includes(q.trim().toLowerCase());
  });

  function edit(v?: Vehicle) {
    if (!v) {
      setForm(emptyForm());
    } else {
      setForm({
        id: v.id,
        registrationNo: v.registrationNo,
        type: v.type,
        brand: v.brand ?? "",
        model: v.model ?? "",
        department: v.department ?? "",
        assignedDriver: v.assignedDriver ?? "",
        odometerKm: v.odometerKm != null ? String(v.odometerKm) : "",
        serviceIntervalKm: v.serviceIntervalKm != null ? String(v.serviceIntervalKm) : "",
      });
    }
    setOpen(true);
  }

  async function save() {
    try {
      await upsertVehicle({
        data: {
          id: form.id || undefined,
          registrationNo: form.registrationNo,
          type: form.type,
          brand: form.brand,
          model: form.model,
          department: form.department,
          assignedDriver: form.assignedDriver,
          odometerKm: form.odometerKm ? Number(form.odometerKm) : null,
          serviceIntervalKm: form.serviceIntervalKm ? Number(form.serviceIntervalKm) : null,
        },
      });
      toast.success(form.id ? t("vehicleUpdated") : t("vehicleAdded"));
      setOpen(false);
      await refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("saveFailed"));
    }
  }

  async function onCsv(file: File | undefined) {
    if (!file) return;
    const text = await file.text();
    const rows = parseCsv(text);
    if (rows.length < 2) {
      toast.error(t("csvNeedRows"));
      return;
    }
    const header = rows[0].map((h) => h.toLowerCase().replace(/[\s_]+/g, ""));
    const idx = (names: string[]) => header.findIndex((h) => names.includes(h));
    const mapped = rows.slice(1).map((row) => ({
      registrationNo: row[idx(["registrationno", "reg", "registration"])] ?? "",
      type: row[idx(["type"])] ?? "Vehicle",
      brand: row[idx(["brand", "make"])] ?? "",
      model: row[idx(["model"])] ?? "",
      department: row[idx(["department", "dept"])] ?? "",
      assignedDriver: row[idx(["assigneddriver", "driver"])] ?? "",
      odometerKm: Number(row[idx(["odometerkm", "odometer", "km"])] ?? "") || null,
    }));
    try {
      const res = await importVehicles({ data: { rows: mapped } });
      toast.success(`${res.imported} ${t("imported")}`);
      await refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("importFailed"));
    }
  }

  const historyVehicle = data.find((v) => v.id === historyId);
  const historyJobs = (jobs.data ?? []).filter((j) => j.vehicleId === historyId);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">{t("fleet")}</h1>
          <p className="text-sm text-muted-foreground">
            {data.length} {t("vehiclesOnBooks")}
          </p>
        </div>
        {isAdmin && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => {
                const template =
                  "registrationNo,type,brand,model,department,assignedDriver,odometerKm\nDHAKA-GA-21-1001,Van,Toyota,Hiace,Hatchery,Karim Uddin,128400\n";
                const blob = new Blob([template], { type: "text/csv;charset=utf-8" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "vehicles-template.csv";
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              {t("csvTemplate")}
            </Button>
            <label className="inline-flex h-10 cursor-pointer items-center rounded-md border border-border bg-card px-4 text-sm font-medium">
              {t("importCsv")}
              <input
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => void onCsv(e.target.files?.[0])}
              />
            </label>
            <Button onClick={() => edit()}>{t("addVehicle")}</Button>
          </div>
        )}
      </div>

      <Input
        placeholder={t("searchFleet")}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="max-w-sm"
      />

      {isPending ? (
        <p className="text-sm text-muted-foreground">{t("loadingFleet")}</p>
      ) : (
        <Card className="overflow-hidden rounded-2xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("registration")}</TableHead>
                <TableHead className="hidden md:table-cell">{t("vehicle")}</TableHead>
                <TableHead className="hidden lg:table-cell">{t("department")}</TableHead>
                <TableHead className="hidden lg:table-cell">{t("driver")}</TableHead>
                <TableHead>{t("km")}</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>
                    <p className="font-mono text-sm">{v.registrationNo}</p>
                    <p className="text-xs text-muted-foreground md:hidden">
                      {v.brand} {v.model}
                    </p>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {v.brand} {v.model}
                    <span className="block text-xs text-muted-foreground">{v.type}</span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{v.department ?? "—"}</TableCell>
                  <TableCell className="hidden lg:table-cell">{v.assignedDriver ?? "—"}</TableCell>
                  <TableCell>
                    <span className="text-sm tabular-nums">
                      {v.odometerKm != null ? v.odometerKm.toLocaleString() : "—"}
                    </span>
                    {v.dueForService && (
                      <Badge variant="warning" className="ml-2">
                        {t("due")}
                      </Badge>
                    )}
                    {v.status === "in_workshop" && (
                      <Badge variant="default" className="ml-2">
                        {t("statusInBay")}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setHistoryId(v.id)}>
                      {t("history")}
                    </Button>
                    {isAdmin && (
                      <Button variant="ghost" size="sm" onClick={() => edit(v)}>
                        {t("edit")}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <p className="text-xs text-muted-foreground">{t("csvHint")}</p>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{form.id ? t("editVehicle") : t("addVehicleTitle")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ["registrationNo", t("registration")],
                ["type", t("type")],
                ["brand", t("brand")],
                ["model", t("model")],
                ["department", t("department")],
                ["assignedDriver", t("driver")],
                ["odometerKm", t("odometer")],
                ["serviceIntervalKm", t("serviceInterval")],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="space-y-1.5">
                <Label>{label}</Label>
                <Input
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                />
              </div>
            ))}
          </div>
          <Button onClick={() => void save()}>{t("save")}</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={!!historyId} onOpenChange={(o) => !o && setHistoryId(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {historyVehicle?.registrationNo} · {t("serviceHistory")}
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-80 space-y-2 overflow-y-auto">
            {historyJobs.length === 0 && (
              <p className="text-sm text-muted-foreground">{t("noHistory")}</p>
            )}
            {historyJobs.map((j) => (
              <Link
                key={j.id}
                to="/requests/$requestId"
                params={{ requestId: j.id }}
                className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm"
              >
                <span className="line-clamp-1">{j.problemDescription}</span>
                <StatusBadge status={j.status} />
              </Link>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
