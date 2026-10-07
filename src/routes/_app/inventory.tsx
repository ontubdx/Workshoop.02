import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { upsertInventory } from "@/lib/workshop/api";
import { useInventory, useProfile } from "@/lib/workshop/hooks";
import { formatBdt } from "@/lib/utils";
import type { InventoryItem } from "@/lib/workshop/types";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_app/inventory")({
  component: InventoryPage,
});

function InventoryPage() {
  const { data = [], isPending, refetch } = useInventory();
  const canEdit = ["admin", "manager"].includes(useProfile().data?.role ?? "");
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    id: "",
    partName: "",
    stockQty: "",
    reorderLevel: "",
    unit: "pcs",
    unitPrice: "",
  });

  function edit(item?: InventoryItem) {
    setForm({
      id: item?.id ?? "",
      partName: item?.partName ?? "",
      stockQty: item ? String(item.stockQty) : "",
      reorderLevel: item ? String(item.reorderLevel) : "",
      unit: item?.unit ?? "pcs",
      unitPrice: item ? String(item.unitPrice) : "",
    });
    setOpen(true);
  }

  async function save() {
    try {
      await upsertInventory({
        data: {
          id: form.id || undefined,
          partName: form.partName,
          stockQty: Number(form.stockQty),
          reorderLevel: Number(form.reorderLevel),
          unit: form.unit,
          unitPrice: Number(form.unitPrice),
        },
      });
      toast.success(t("inventorySaved"));
      setOpen(false);
      await refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("saveFailed"));
    }
  }

  const low = data.filter((i) => i.lowStock).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">{t("partsStore")}</h1>
          <p className="text-sm text-muted-foreground">
            {data.length} {t("skus")} · {low} {t("atReorder")}
          </p>
        </div>
        {canEdit && <Button onClick={() => edit()}>{t("addPartTitle")}</Button>}
      </div>

      {isPending ? (
        <p className="text-sm text-muted-foreground">{t("loadingInventory")}</p>
      ) : (
        <Card className="overflow-hidden rounded-2xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("parts")}</TableHead>
                <TableHead>{t("stock")}</TableHead>
                <TableHead className="hidden sm:table-cell">{t("reorderLevel")}</TableHead>
                <TableHead>{t("unitPrice")}</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.partName}
                    {item.lowStock && (
                      <Badge variant="destructive" className="ml-2">
                        {t("low")}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {item.stockQty} {item.unit}
                  </TableCell>
                  <TableCell className="hidden tabular-nums sm:table-cell">
                    {item.reorderLevel}
                  </TableCell>
                  <TableCell className="tabular-nums">{formatBdt(item.unitPrice)}</TableCell>
                  <TableCell className="text-right">
                    {canEdit && (
                      <Button variant="ghost" size="sm" onClick={() => edit(item)}>
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{form.id ? t("editPart") : t("addPartTitle")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>{t("name")}</Label>
              <Input
                value={form.partName}
                onChange={(e) => setForm((f) => ({ ...f, partName: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("stock")}</Label>
              <Input
                type="number"
                value={form.stockQty}
                onChange={(e) => setForm((f) => ({ ...f, stockQty: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("reorderLevel")}</Label>
              <Input
                type="number"
                value={form.reorderLevel}
                onChange={(e) => setForm((f) => ({ ...f, reorderLevel: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("unit")}</Label>
              <Input
                value={form.unit}
                onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("unitPrice")}</Label>
              <Input
                type="number"
                value={form.unitPrice}
                onChange={(e) => setForm((f) => ({ ...f, unitPrice: e.target.value }))}
              />
            </div>
          </div>
          <Button onClick={() => void save()}>{t("save")}</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
