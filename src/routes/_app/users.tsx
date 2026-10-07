import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { updateUser } from "@/lib/workshop/api";
import { useProfile, useStaff } from "@/lib/workshop/hooks";
import { ROLES, type Role } from "@/lib/workshop/types";
import { formatDate } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_app/users")({
  component: UsersPage,
});

function UsersPage() {
  const me = useProfile().data;
  const { data = [], refetch, isPending } = useStaff();
  const { t, role, locale } = useI18n();

  if (me && me.role !== "admin") {
    return <p className="text-sm text-muted-foreground">{t("onlyAdminsUsers")}</p>;
  }

  async function setRole(userId: string, next: Role) {
    try {
      await updateUser({ data: { userId, role: next } });
      toast.success(t("roleUpdated"));
      await refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("updateFailed"));
    }
  }

  async function setActive(userId: string, active: boolean) {
    try {
      await updateUser({ data: { userId, active } });
      toast.success(active ? t("userActivated") : t("userDeactivated"));
      await refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("updateFailed"));
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl font-semibold">{t("usersTitle")}</h1>
        <p className="max-w-xl text-sm text-muted-foreground">{t("usersLead")}</p>
      </div>
      <Card className="overflow-hidden rounded-2xl">
        {isPending ? (
          <p className="p-6 text-sm text-muted-foreground">{t("loadingUsers")}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("name")}</TableHead>
                <TableHead className="hidden md:table-cell">{t("email")}</TableHead>
                <TableHead>{t("navUsers")}</TableHead>
                <TableHead>{t("status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((u) => (
                <TableRow key={u.userId}>
                  <TableCell>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-xs text-muted-foreground md:hidden">{u.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {t("joined")} {formatDate(u.createdAt, locale)}
                    </p>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{u.email ?? "—"}</TableCell>
                  <TableCell>
                    <Select value={u.role} onValueChange={(v) => void setRole(u.userId, v as Role)}>
                      <SelectTrigger className="w-44">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((r) => (
                          <SelectItem key={r} value={r}>
                            {role(r)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <button type="button" onClick={() => void setActive(u.userId, !u.active)}>
                      {u.active ? (
                        <Badge variant="success">{t("active")}</Badge>
                      ) : (
                        <Badge variant="muted">{t("inactive")}</Badge>
                      )}
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
