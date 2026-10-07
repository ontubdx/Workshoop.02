import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  ClipboardList,
  Gauge,
  LayoutDashboard,
  Menu,
  Package,
  PlusCircle,
  ScrollText,
  Truck,
  Users,
  Wrench,
} from "lucide-react";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { cn, formatDateTime } from "@/lib/utils";
import { LanguageToggle, useI18n, type MsgKey } from "@/lib/i18n";
import type { Profile, Role } from "@/lib/workshop/types";
import { markNotificationsRead } from "@/lib/workshop/api";
import { useNotifications } from "@/lib/workshop/hooks";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useQueryClient } from "@tanstack/react-query";

type NavItem = {
  to: string;
  labelKey: MsgKey;
  icon: typeof LayoutDashboard;
  roles: Role[];
};

const NAV: NavItem[] = [
  {
    to: "/",
    labelKey: "navDashboard",
    icon: LayoutDashboard,
    roles: ["admin", "manager", "mechanic", "vehicle_user", "viewer"],
  },
  {
    to: "/requests/new",
    labelKey: "navNew",
    icon: PlusCircle,
    roles: ["admin", "manager", "vehicle_user"],
  },
  {
    to: "/requests",
    labelKey: "navRequests",
    icon: ClipboardList,
    roles: ["admin", "manager", "mechanic", "vehicle_user", "viewer"],
  },
  {
    to: "/vehicles",
    labelKey: "navVehicles",
    icon: Truck,
    roles: ["admin", "manager", "viewer"],
  },
  {
    to: "/inventory",
    labelKey: "navInventory",
    icon: Package,
    roles: ["admin", "manager"],
  },
  {
    to: "/users",
    labelKey: "navUsers",
    icon: Users,
    roles: ["admin"],
  },
  {
    to: "/reports",
    labelKey: "navReports",
    icon: Gauge,
    roles: ["admin", "manager", "viewer"],
  },
  {
    to: "/audit",
    labelKey: "navAudit",
    icon: ScrollText,
    roles: ["admin"],
  },
];

function navFor(role: Role) {
  return NAV.filter((item) => item.roles.includes(role)).map((item) => {
    if (item.to === "/requests" && role === "mechanic") {
      return { ...item, labelKey: "navMyJobs" as const };
    }
    if (item.to === "/requests" && role === "vehicle_user") {
      return { ...item, labelKey: "navMyRequests" as const };
    }
    if (item.to === "/requests") return { ...item, labelKey: "navAllRequests" as const };
    return item;
  });
}

function BrandMark({ compact = false }: { compact?: boolean }) {
  const { t } = useI18n();
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
        <Wrench className="size-4" />
      </span>
      {!compact && (
        <div className="min-w-0">
          <p className="font-display text-base leading-none font-semibold tracking-wide text-sidebar-foreground">
            {t("appName")}
          </p>
          <p className="mt-1 truncate text-xs tracking-wide text-sidebar-muted uppercase">
            {t("dept")}
          </p>
        </div>
      )}
    </div>
  );
}

function NavLinks({
  role,
  pathname,
  onNavigate,
  variant,
}: {
  role: Role;
  pathname: string;
  onNavigate?: () => void;
  variant: "sidebar" | "mobile";
}) {
  const { t } = useI18n();
  const items = navFor(role);
  return (
    <nav className={cn("flex flex-col gap-1", variant === "mobile" && "px-3")}>
      {items.map((item) => {
        const active =
          item.to === "/"
            ? pathname === "/"
            : pathname === item.to || pathname.startsWith(`${item.to}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
              variant === "sidebar" &&
                (active
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground"),
              variant === "mobile" &&
                (active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"),
            )}
          >
            <Icon className="size-4 shrink-0" />
            {t(item.labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}

function NotificationBell() {
  const { data = [] } = useNotifications();
  const qc = useQueryClient();
  const { t, locale } = useI18n();
  const unread = data.filter((n) => !n.read).length;
  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (open && unread > 0) {
          void markNotificationsRead().then(() =>
            qc.invalidateQueries({ queryKey: ["notifications"] }),
          );
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative" aria-label={t("notifications")}>
          <Bell className="size-4" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-xs font-semibold text-destructive-foreground">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>{t("notifications")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {data.length === 0 && (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">{t("allCaughtUp")}</p>
        )}
        {data.slice(0, 12).map((n) => (
          <DropdownMenuItem key={n.id} asChild>
            <Link
              to={n.requestId ? "/requests/$requestId" : "/"}
              params={n.requestId ? { requestId: n.requestId } : undefined}
              className="flex flex-col items-start gap-0.5 py-2"
            >
              <span className="text-sm leading-snug">{n.message}</span>
              <span className="text-xs text-muted-foreground">
                {formatDateTime(n.createdAt, locale)}
              </span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppShell({
  profile,
  children,
}: {
  profile: Profile;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const user = useCurrentUser();
  const { t, role } = useI18n();
  const [open, setOpen] = useState(false);
  const mobileNav = navFor(profile.role).slice(0, 4);

  return (
    <div className="min-h-dvh bg-background">
      <aside className="print-hidden fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="px-4 py-5">
          <BrandMark />
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <NavLinks role={profile.role} pathname={pathname} variant="sidebar" />
        </div>
        <div className="space-y-3 border-t border-sidebar-border p-4">
          <LanguageToggle tone="dark" />
          <p className="text-xs tracking-wide text-sidebar-muted uppercase">
            {role(profile.role)}
          </p>
          <div className="text-sidebar-foreground [&_span]:text-sidebar-foreground [&_button]:text-sidebar-muted">
            <UserButton />
          </div>
        </div>
      </aside>

      <div className="lg:pl-60">
        <header className="print-hidden sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-sm">
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(true)}
            aria-label={t("openMenu")}
          >
            <Menu className="size-4" />
          </Button>
          <div className="lg:hidden">
            <BrandMark compact />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="lg:hidden">
              <LanguageToggle />
            </div>
            <span className="hidden text-sm text-muted-foreground md:inline">
              {user?.displayName ?? profile.name}
            </span>
            <NotificationBell />
          </div>
        </header>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="bg-sidebar pt-12">
            <div className="px-4 pb-6">
              <BrandMark />
            </div>
            <NavLinks
              role={profile.role}
              pathname={pathname}
              variant="sidebar"
              onNavigate={() => setOpen(false)}
            />
            <div className="mt-auto space-y-3 p-4 text-sidebar-foreground">
              <LanguageToggle tone="dark" />
              <UserButton />
            </div>
          </SheetContent>
        </Sheet>

        <main className="px-4 py-6 pb-24 lg:px-8 lg:pb-10">{children}</main>
      </div>

      <nav className="print-hidden fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-border bg-card lg:hidden">
        {mobileNav.map((item) => {
          const active =
            item.to === "/"
              ? pathname === "/"
              : pathname === item.to || pathname.startsWith(`${item.to}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 px-1 text-center text-xs font-medium",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="size-4" />
              <span className="line-clamp-1">{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
