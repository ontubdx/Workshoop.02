import { useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVehicles, useProfile } from "@/lib/workshop/hooks";
import { createRequest } from "@/lib/workshop/api";
import { compressImage } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_app/requests/new")({
  component: NewRequestPage,
});

function NewRequestPage() {
  const vehicles = useVehicles();
  const profile = useProfile().data;
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { t } = useI18n();
  const [vehicleId, setVehicleId] = useState("");
  const [priority, setPriority] = useState<"normal" | "urgent">("normal");
  const [problem, setProblem] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  async function onPhotos(files: FileList | null) {
    if (!files) return;
    try {
      const next: string[] = [];
      for (const file of Array.from(files).slice(0, 4 - photos.length)) {
        if (!file.type.startsWith("image/")) continue;
        next.push(await compressImage(file));
      }
      setPhotos((prev) => [...prev, ...next].slice(0, 4));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("couldNotSubmit"));
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!vehicleId) {
      toast.error(t("selectVehicle"));
      return;
    }
    if (!problem.trim()) {
      toast.error(t("describeProblem"));
      return;
    }
    setBusy(true);
    try {
      const res = await createRequest({
        data: {
          vehicleId,
          problemDescription: problem,
          priority,
          photoUrls: photos,
        },
      });
      await qc.invalidateQueries();
      toast.success(t("requestSubmitted"));
      await navigate({ to: "/requests/$requestId", params: { requestId: res.id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("couldNotSubmit"));
    } finally {
      setBusy(false);
    }
  }

  const fleet = vehicles.data ?? [];

  if (profile && (profile.role === "viewer" || profile.role === "mechanic")) {
    return <p className="text-sm text-muted-foreground">{t("noPermission")}</p>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="font-display text-3xl font-semibold">{t("newRequest")}</h1>
        <p className="text-sm text-muted-foreground">{t("newRequestLead")}</p>
      </div>
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>{t("jobIntake")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-1.5">
              <Label>{t("vehicle")}</Label>
              <Select value={vehicleId} onValueChange={setVehicleId}>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectRegistration")} />
                </SelectTrigger>
                <SelectContent>
                  {fleet.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.registrationNo} · {v.brand} {v.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t("priority")}</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as "normal" | "urgent")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">{t("normal")}</SelectItem>
                  <SelectItem value="urgent">{t("urgentOffRoad")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="problem">{t("problem")}</Label>
              <Textarea
                id="problem"
                required
                rows={6}
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder={t("problemHint")}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="photos">{t("photos")}</Label>
              <input
                id="photos"
                type="file"
                accept="image/*"
                multiple
                className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-sm file:font-medium file:text-secondary-foreground"
                onChange={(e) => void onPhotos(e.target.files)}
              />
              {photos.length > 0 && (
                <div className="grid grid-cols-4 gap-2 pt-2">
                  {photos.map((src, i) => (
                    <button
                      key={i}
                      type="button"
                      className="overflow-hidden rounded-lg border border-border"
                      onClick={() => setPhotos((p) => p.filter((_, idx) => idx !== i))}
                    >
                      <img src={src} alt="" className="h-20 w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button type="submit" className="h-11 w-full sm:w-auto" disabled={busy}>
              {busy ? t("submitting") : t("submitRequest")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
