import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import type { RequestStatus } from "@/lib/workshop/types";
import { STATUS_VARIANT } from "@/lib/workshop/status-style";

export function StatusBadge({ status }: { status: RequestStatus }) {
  const { status: label } = useI18n();
  return <Badge variant={STATUS_VARIANT[status]}>{label(status)}</Badge>;
}

export function PriorityBadge({ priority }: { priority: "urgent" | "normal" }) {
  const { t } = useI18n();
  if (priority === "urgent") return <Badge variant="destructive">{t("urgent")}</Badge>;
  return <Badge variant="muted">{t("normal")}</Badge>;
}
