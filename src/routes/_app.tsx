import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Wrench } from "lucide-react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AppShell } from "@/components/app-shell";
import { useProfile } from "@/lib/workshop/hooks";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const { user, isPending } = useCurrentUserState();
  const profileQuery = useProfile(Boolean(user) && !isPending);
  const { t } = useI18n();

  if (isPending) return <ShellSkeleton />;
  if (!user) return <RedirectToSignIn />;
  if ((profileQuery.isPending || profileQuery.isFetching) && !profileQuery.data) {
    return <ShellSkeleton />;
  }
  if (profileQuery.error || !profileQuery.data) {
    return (
      <main className="grid min-h-dvh place-items-center bg-background p-6">
        <div className="max-w-sm text-center">
          <h1 className="font-display text-2xl font-semibold">{t("profileErrorTitle")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {profileQuery.error instanceof Error
              ? profileQuery.error.message
              : t("profileErrorBody")}
          </p>
        </div>
      </main>
    );
  }
  if (!profileQuery.data.active) {
    return (
      <main className="grid min-h-dvh place-items-center bg-background p-6">
        <div className="max-w-sm text-center">
          <h1 className="font-display text-2xl font-semibold">{t("deactivatedTitle")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("deactivatedBody")}</p>
        </div>
      </main>
    );
  }

  return (
    <AppShell profile={profileQuery.data}>
      <Outlet />
    </AppShell>
  );
}

function ShellSkeleton() {
  const { t } = useI18n();
  return (
    <div className="grid min-h-dvh place-items-center bg-sidebar px-6 text-sidebar-foreground">
      <div className="flex max-w-sm flex-col items-center text-center">
        <span className="grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground">
          <Wrench className="size-5" />
        </span>
        <h1 className="mt-5 font-display text-3xl font-semibold">{t("appName")}</h1>
        <p className="mt-2 text-sm text-sidebar-muted">{t("loadingBay")}</p>
      </div>
    </div>
  );
}
