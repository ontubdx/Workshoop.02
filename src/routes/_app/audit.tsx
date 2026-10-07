import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { listAudit } from "@/lib/workshop/api";
import { useProfile } from "@/lib/workshop/hooks";
import { formatDateTime } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_app/audit")({
  component: AuditPage,
});

function AuditPage() {
  const role = useProfile().data?.role;
  const { t, locale } = useI18n();
  const { data = [], isPending, error } = useQuery({
    queryKey: ["audit"],
    queryFn: () => listAudit(),
    enabled: role === "admin",
  });
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return data;
    return data.filter((row) =>
      `${row.action} ${row.userName} ${row.targetCollection} ${row.targetId} ${row.details}`
        .toLowerCase()
        .includes(query),
    );
  }, [data, q]);

  if (role && role !== "admin") {
    return <p className="text-sm text-muted-foreground">{t("onlyAdminsAudit")}</p>;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl font-semibold">{t("auditTitle")}</h1>
        <p className="text-sm text-muted-foreground">{t("auditLead")}</p>
      </div>
      <Input
        placeholder={t("searchAudit")}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="max-w-sm"
      />
      {isPending && <p className="text-sm text-muted-foreground">{t("loading")}</p>}
      {error && (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : t("couldNotLoadAudit")}
        </p>
      )}
      <Card className="divide-y divide-border rounded-2xl">
        {filtered.map((row) => (
          <div key={row.id} className="px-4 py-3">
            <p className="text-sm font-medium">{row.action.replaceAll("_", " ")}</p>
            <p className="text-xs text-muted-foreground">
              {row.userName ?? row.userId} · {row.targetCollection}
              {row.targetId ? ` · ${row.targetId}` : ""} · {formatDateTime(row.createdAt, locale)}
            </p>
            {row.details && <p className="mt-1 text-xs text-muted-foreground">{row.details}</p>}
          </div>
        ))}
        {!isPending && filtered.length === 0 && (
          <p className="p-6 text-sm text-muted-foreground">{t("noMatchingEvents")}</p>
        )}
      </Card>
    </div>
  );
}
