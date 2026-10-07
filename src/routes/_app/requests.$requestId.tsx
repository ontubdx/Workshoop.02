import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Printer, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PriorityBadge, StatusBadge } from "@/components/status-badge";
import { StatusStepper } from "@/components/status-stepper";
import {
  acceptRequest,
  addPart,
  addWorkItem,
  assignMechanic,
  completeWork,
  confirmDelivery,
  getRequest,
  rejectRequest,
  removePart,
  removeWorkItem,
  requestParts,
  setLaborCost,
  updateMechanicStatus,
} from "@/lib/workshop/api";
import { useInventory, useProfile, useStaff } from "@/lib/workshop/hooks";
import { formatBdt, formatDate, formatDateTime } from "@/lib/utils";
import { MECHANIC_STATUSES, canManageJobs, type MechanicStatus } from "@/lib/workshop/types";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_app/requests/$requestId")({
  component: JobDetailPage,
});

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function plusDays(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function JobDetailPage() {
  const { requestId } = Route.useParams();
  const qc = useQueryClient();
  const profile = useProfile().data;
  const staff = useStaff();
  const inventory = useInventory();
  const { t, locale, mechanicStatus } = useI18n();
  const jobQuery = useQuery({
    queryKey: ["request", requestId],
    queryFn: () => getRequest({ data: { id: requestId } }),
  });

  const [acceptOpen, setAcceptOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [entryDate, setEntryDate] = useState(todayISO());
  const [deliveryDate, setDeliveryDate] = useState(plusDays(3));
  const [mechanicId, setMechanicId] = useState("");
  const [reason, setReason] = useState("");
  const [workText, setWorkText] = useState("");
  const [partName, setPartName] = useState("");
  const [partSource, setPartSource] = useState<"store" | "external">("store");
  const [storeId, setStoreId] = useState("");
  const [vendor, setVendor] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [qty, setQty] = useState("1");
  const [labor, setLabor] = useState("");
  const [partsNeed, setPartsNeed] = useState("");
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);

  const job = jobQuery.data;
  const role = profile?.role;
  const manager = role ? canManageJobs(role) : false;
  const isRequester = job && profile ? job.requestedBy === profile.userId : false;
  const isMechanic = job && profile ? job.assignedMechanic === profile.userId : false;
  const readOnly = role === "viewer";

  async function refresh() {
    await qc.invalidateQueries();
  }

  async function run(label: string, fn: () => Promise<unknown>) {
    setBusy(true);
    try {
      await fn();
      await refresh();
      toast.success(label);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("updateFailed"));
    } finally {
      setBusy(false);
    }
  }

  if (jobQuery.isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }
  if (jobQuery.error || !job) {
    return (
      <p className="text-sm text-destructive">
        {jobQuery.error instanceof Error ? jobQuery.error.message : t("jobNotFound")}
      </p>
    );
  }

  const mechanics = (staff.data ?? []).filter(
    (p) => p.active && (p.role === "mechanic" || p.role === "manager" || p.role === "admin"),
  );
  const storeItems = inventory.data ?? [];
  const selectedStore = storeItems.find((i) => i.id === storeId);

  return (
    <div className="space-y-6">
      <div className="print-only mb-6 border-b border-border pb-4">
        <p className="text-xs tracking-wide text-muted-foreground uppercase">
          {t("dept")} · {t("jobCard")}
        </p>
        <h1 className="font-display text-3xl font-semibold">{job.registrationNo}</h1>
        <p className="text-sm">
          {job.vehicleLabel}
          {job.department ? ` · ${job.department}` : ""}
        </p>
      </div>

      <div className="print-hidden flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link to="/requests" className="text-sm text-muted-foreground hover:text-foreground">
            {t("backRequests")}
          </Link>
          <h1 className="mt-1 font-display text-3xl font-semibold">{job.registrationNo}</h1>
          <p className="text-sm text-muted-foreground">
            {job.vehicleLabel}
            {job.department ? ` · ${job.department}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <PriorityBadge priority={job.priority} />
          <StatusBadge status={job.status} />
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="size-4" />
            {t("printJobCard")}
          </Button>
        </div>
      </div>

      <StatusStepper status={job.status} />

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-4">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>{t("problemTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm leading-relaxed">{job.problemDescription}</p>
              {job.rejectionReason && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {t("rejectedPrefix")} {job.rejectionReason}
                </p>
              )}
              {job.photoUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {job.photoUrls.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="h-28 w-full rounded-lg border border-border object-cover"
                    />
                  ))}
                </div>
              )}
              <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <div>
                  <dt className="text-xs text-muted-foreground">{t("requestedBy")}</dt>
                  <dd>{job.requesterName}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">{t("submitted")}</dt>
                  <dd>{formatDate(job.createdAt, locale)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">{t("entry")}</dt>
                  <dd>{formatDate(job.entryDate, locale)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">{t("tentativeDelivery")}</dt>
                  <dd>{formatDate(job.tentativeDeliveryDate, locale)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {manager && job.status === "pending" && !readOnly && (
            <div className="print-hidden flex flex-wrap gap-2">
              <Button onClick={() => setAcceptOpen(true)}>{t("acceptJob")}</Button>
              <Button variant="outline" onClick={() => setRejectOpen(true)}>
                {t("reject")}
              </Button>
            </div>
          )}

          {manager && (job.status === "accepted" || job.status === "in_workshop") && !readOnly && (
            <Card className="print-hidden rounded-2xl">
              <CardHeader>
                <CardTitle>{t("assignMechanic")}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 sm:flex-row">
                <Select value={mechanicId} onValueChange={setMechanicId}>
                  <SelectTrigger className="sm:flex-1">
                    <SelectValue placeholder={job.assignedMechanicName ?? t("selectMechanic")} />
                  </SelectTrigger>
                  <SelectContent>
                    {mechanics.map((m) => (
                      <SelectItem key={m.userId} value={m.userId}>
                        {m.name} · {m.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  disabled={!mechanicId || busy}
                  onClick={() =>
                    run(t("mechanicAssigned"), () =>
                      assignMechanic({ data: { id: job.id, mechanicId } }),
                    )
                  }
                >
                  {t("assign")}
                </Button>
              </CardContent>
            </Card>
          )}

          {(isMechanic || manager) && job.status === "in_workshop" && !readOnly && (
            <Card className="print-hidden rounded-2xl">
              <CardHeader>
                <CardTitle>{t("mechanicProgress")}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Select
                  value={job.mechanicStatus}
                  onValueChange={(v) =>
                    run(t("statusUpdated"), () =>
                      updateMechanicStatus({
                        data: { id: job.id, mechanicStatus: v as MechanicStatus },
                      }),
                    )
                  }
                >
                  <SelectTrigger className="sm:w-56">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MECHANIC_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {mechanicStatus(s)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isMechanic && (
                  <form
                    className="flex flex-1 flex-col gap-2 sm:flex-row"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!partsNeed.trim()) return;
                      void run(t("partsRequestSent"), () =>
                        requestParts({ data: { requestId: job.id, message: partsNeed } }),
                      ).then(() => setPartsNeed(""));
                    }}
                  >
                    <Input
                      placeholder={t("requestPartsPlaceholder")}
                      value={partsNeed}
                      onChange={(e) => setPartsNeed(e.target.value)}
                    />
                    <Button type="submit" variant="outline" disabled={busy}>
                      {t("requestParts")}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          )}

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>{t("workDone")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {job.workItems.length === 0 && (
                <p className="text-sm text-muted-foreground">{t("noWorkItems")}</p>
              )}
              <ul className="space-y-2">
                {job.workItems.map((item) => (
                  <li key={item.id} className="flex items-start justify-between gap-3 text-sm">
                    <span>{item.description}</span>
                    {manager && !readOnly && job.status !== "delivered" && (
                      <button
                        type="button"
                        className="print-hidden text-xs text-muted-foreground hover:text-destructive"
                        onClick={() =>
                          run(t("removed"), () =>
                            removeWorkItem({ data: { id: item.id, requestId: job.id } }),
                          )
                        }
                      >
                        {t("remove")}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              {manager && !readOnly && job.status !== "delivered" && job.status !== "rejected" && (
                <form
                  className="print-hidden flex flex-col gap-2 sm:flex-row"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!workText.trim()) return;
                    void run(t("workItemAdded"), () =>
                      addWorkItem({ data: { requestId: job.id, description: workText } }),
                    ).then(() => setWorkText(""));
                  }}
                >
                  <Input
                    value={workText}
                    onChange={(e) => setWorkText(e.target.value)}
                    placeholder={t("describeWork")}
                  />
                  <Button type="submit" variant="secondary" disabled={busy}>
                    {t("add")}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>{t("parts")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {job.parts.length === 0 && (
                <p className="text-sm text-muted-foreground">{t("noParts")}</p>
              )}
              <ul className="space-y-2">
                {job.parts.map((p) => (
                  <li key={p.id} className="flex items-start justify-between gap-3 text-sm">
                    <div>
                      <p>
                        {p.name}{" "}
                        <span className="text-xs text-muted-foreground">
                          · {p.source === "store" ? t("store") : p.vendor || t("external")}
                        </span>
                      </p>
                      <p className="tabular-nums text-muted-foreground">
                        {p.qty} × {formatBdt(p.unitPrice)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium tabular-nums">{formatBdt(p.totalPrice)}</p>
                      {manager && !readOnly && job.status !== "delivered" && (
                        <button
                          type="button"
                          className="print-hidden text-xs text-muted-foreground hover:text-destructive"
                          onClick={() =>
                            run(t("partRemoved"), () =>
                              removePart({ data: { id: p.id, requestId: job.id } }),
                            )
                          }
                        >
                          {t("remove")}
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              {manager && !readOnly && job.status !== "delivered" && job.status !== "rejected" && (
                <form
                  className="print-hidden space-y-3 rounded-xl bg-muted/50 p-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const name = partSource === "store" ? selectedStore?.partName || partName : partName;
                    const price =
                      partSource === "store" && selectedStore ? selectedStore.unitPrice : Number(unitPrice);
                    void run(t("partAdded"), () =>
                      addPart({
                        data: {
                          requestId: job.id,
                          name,
                          source: partSource,
                          vendor: partSource === "external" ? vendor : undefined,
                          unitPrice: price,
                          qty: Number(qty),
                          inventoryId: partSource === "store" ? storeId || null : null,
                        },
                      }),
                    ).then(() => {
                      setPartName("");
                      setVendor("");
                      setUnitPrice("");
                      setQty("1");
                    });
                  }}
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>{t("source")}</Label>
                      <Select
                        value={partSource}
                        onValueChange={(v) => setPartSource(v as "store" | "external")}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="store">{t("workshopStore")}</SelectItem>
                          <SelectItem value="external">{t("purchasedOutside")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {partSource === "store" ? (
                      <div className="space-y-1.5">
                        <Label>{t("storePart")}</Label>
                        <Select value={storeId} onValueChange={setStoreId}>
                          <SelectTrigger>
                            <SelectValue placeholder={t("selectPart")} />
                          </SelectTrigger>
                          <SelectContent>
                            {storeItems.map((i) => (
                              <SelectItem key={i.id} value={i.id}>
                                {i.partName} · {i.stockQty} {i.unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-1.5">
                          <Label>{t("partName")}</Label>
                          <Input value={partName} onChange={(e) => setPartName(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                          <Label>{t("vendor")}</Label>
                          <Input value={vendor} onChange={(e) => setVendor(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                          <Label>{t("unitPrice")}</Label>
                          <Input
                            type="number"
                            min="0"
                            value={unitPrice}
                            onChange={(e) => setUnitPrice(e.target.value)}
                          />
                        </div>
                      </>
                    )}
                    <div className="space-y-1.5">
                      <Label>{t("qty")}</Label>
                      <Input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button type="submit" variant="secondary" size="sm" disabled={busy}>
                    {t("addPart")}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>{t("costSummary")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("storeParts")}</span>
                <span className="tabular-nums">{formatBdt(job.partsStore)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("outsidePurchase")}</span>
                <span className="tabular-nums">{formatBdt(job.partsExternal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("labour")}</span>
                <span className="tabular-nums">{formatBdt(job.laborCost)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 font-medium">
                <span>{t("total")}</span>
                <span className="tabular-nums">{formatBdt(job.totalCost)}</span>
              </div>
              {manager && !readOnly && job.status !== "delivered" && job.status !== "rejected" && (
                <form
                  className="print-hidden flex gap-2 pt-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void run(t("labourSaved"), () =>
                      setLaborCost({ data: { requestId: job.id, laborCost: Number(labor || 0) } }),
                    );
                  }}
                >
                  <Input
                    type="number"
                    min="0"
                    placeholder={`${t("labour")} ৳`}
                    value={labor}
                    onChange={(e) => setLabor(e.target.value)}
                  />
                  <Button type="submit" variant="secondary" disabled={busy}>
                    {t("save")}
                  </Button>
                </form>
              )}
              {manager && !readOnly && (job.status === "in_workshop" || job.status === "accepted") && (
                <Button
                  className="print-hidden mt-2 w-full"
                  disabled={busy}
                  onClick={() =>
                    run(t("markedComplete"), () => completeWork({ data: { id: job.id } }))
                  }
                >
                  {t("markComplete")}
                </Button>
              )}
            </CardContent>
          </Card>

          {(isRequester || manager) && job.status === "work_complete" && !readOnly && (
            <Card className="print-hidden rounded-2xl">
              <CardHeader>
                <CardTitle>{t("confirmPickup")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      className="p-1"
                      aria-label={`${n} ${t("rating")}`}
                    >
                      <Star
                        className={
                          n <= rating
                            ? "size-5 fill-primary text-primary"
                            : "size-5 text-muted-foreground"
                        }
                      />
                    </button>
                  ))}
                </div>
                <Textarea
                  placeholder={t("optionalFeedback")}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <Button
                  className="w-full"
                  disabled={busy}
                  onClick={() =>
                    run(t("vehicleCollected"), () =>
                      confirmDelivery({ data: { id: job.id, rating, feedback } }),
                    )
                  }
                >
                  {t("confirmDelivery")}
                </Button>
              </CardContent>
            </Card>
          )}

          {job.status === "delivered" && (
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>{t("delivery")}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>
                  {t("collected")} {formatDate(job.actualDeliveryDate, locale)}
                </p>
                {job.rating != null && (
                  <p className="mt-1">
                    {t("rating")} {job.rating}/5
                  </p>
                )}
                {job.feedback && <p className="mt-2 text-muted-foreground">{job.feedback}</p>}
              </CardContent>
            </Card>
          )}

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>{t("auditTrail")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {job.history.length === 0 && (
                <p className="text-sm text-muted-foreground">{t("noEvents")}</p>
              )}
              {job.history.map((h) => (
                <div key={h.id} className="text-sm">
                  <p className="font-medium">{h.action.replaceAll("_", " ")}</p>
                  <p className="text-xs text-muted-foreground">
                    {h.userName ?? "System"} · {formatDateTime(h.createdAt, locale)}
                  </p>
                  {h.details && <p className="text-xs text-muted-foreground">{h.details}</p>}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="print-only mt-10 grid grid-cols-2 gap-10 pt-8 text-sm">
        <div>
          <p className="text-xs tracking-wide text-muted-foreground uppercase">{t("mechanic")}</p>
          <p className="mt-8 border-t border-border pt-2">
            {job.assignedMechanicName ?? "________________"}
          </p>
        </div>
        <div>
          <p className="text-xs tracking-wide text-muted-foreground uppercase">{t("receivedBy")}</p>
          <p className="mt-8 border-t border-border pt-2">{job.requesterName}</p>
        </div>
      </div>

      <Dialog open={acceptOpen} onOpenChange={setAcceptOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("acceptJob")}</DialogTitle>
            <DialogDescription>{t("acceptDates")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>{t("entryDate")}</Label>
              <Input type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>{t("tentativeDelivery")}</Label>
              <Input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>
                {t("mechanic")} ({t("assignLater")})
              </Label>
              <Select value={mechanicId} onValueChange={setMechanicId}>
                <SelectTrigger>
                  <SelectValue placeholder={t("assignLater")} />
                </SelectTrigger>
                <SelectContent>
                  {mechanics.map((m) => (
                    <SelectItem key={m.userId} value={m.userId}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full"
              disabled={busy}
              onClick={() =>
                run(t("accepted"), () =>
                  acceptRequest({
                    data: {
                      id: job.id,
                      entryDate,
                      tentativeDeliveryDate: deliveryDate,
                      assignedMechanic: mechanicId || null,
                    },
                  }),
                ).then(() => setAcceptOpen(false))
              }
            >
              {t("acceptJob")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("rejectJob")}</DialogTitle>
            <DialogDescription>{t("rejectReasonLead")}</DialogDescription>
          </DialogHeader>
          <Textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={4} />
          <Button
            variant="destructive"
            className="w-full"
            disabled={busy}
            onClick={() =>
              run(t("jobRejected"), () => rejectRequest({ data: { id: job.id, reason } })).then(() =>
                setRejectOpen(false),
              )
            }
          >
            {t("rejectRequest")}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
