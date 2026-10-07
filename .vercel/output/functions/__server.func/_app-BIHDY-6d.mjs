import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { b as Link, g as Outlet, p as useRouterState, x as Navigate } from "./_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "./_libs/@radix-ui/react-collection+[...].mjs";
import { i as signOut } from "./_ssr/client-1vAx-gM_.mjs";
import { a as hasGateSessionMarker } from "./_ssr/server-TYYuhGC5.mjs";
import { a as formatDateTime, t as cn } from "./_ssr/utils-BK93iFu4.mjs";
import { _ as ClipboardList, a as Truck, d as Package, f as Menu, h as Gauge, i as Users, l as ScrollText, n as Wrench, p as LayoutDashboard, t as X, v as CirclePlus, x as Bell } from "./_libs/lucide-react.mjs";
import { r as useQueryClient } from "./_libs/tanstack__react-query.mjs";
import { a as DialogOverlay, n as DialogClose, o as DialogPortal, r as DialogContent, t as Dialog } from "./_libs/@radix-ui/react-dialog+[...].mjs";
import { a as Root2, i as Portal2, n as Item2, o as Separator2, r as Label2, s as Trigger, t as Content2 } from "./_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { i as useI18n, r as LanguageToggle } from "./_ssr/router-DoBdnNsS.mjs";
import { n as useCurrentUserState, t as useCurrentUser } from "./_ssr/use-current-user-BYyFvsCd.mjs";
import { T as useProfile, f as markNotificationsRead, w as useNotifications } from "./_ssr/hooks-DHQe4QNS.mjs";
import { t as Button } from "./_ssr/button-C6_0vgHL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app-BIHDY-6d.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
function DropdownMenuContent({ className, sideOffset = 6, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
		sideOffset,
		className: cn("z-50 min-w-44 overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md", className),
		...props
	}) });
}
function DropdownMenuItem({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
		className: cn("flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm outline-none data-highlighted:bg-muted", className),
		...props
	});
}
function DropdownMenuLabel({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
		className: cn("px-2 py-1.5 text-xs font-medium text-muted-foreground", className),
		...props
	});
}
function DropdownMenuSeparator({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
		className: cn("my-1 h-px bg-border", className),
		...props
	});
}
var Sheet = Dialog;
function SheetContent({ className, children, side = "right", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-sidebar/50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: cn("fixed z-50 flex h-full w-[min(22rem,92vw)] flex-col bg-sidebar text-sidebar-foreground shadow-xl", side === "left" ? "inset-y-0 left-0" : "inset-y-0 right-0", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute top-3 right-3 rounded-md p-1 text-sidebar-muted hover:bg-sidebar-accent",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
var NAV = [
	{
		to: "/",
		labelKey: "navDashboard",
		icon: LayoutDashboard,
		roles: [
			"admin",
			"manager",
			"mechanic",
			"vehicle_user",
			"viewer"
		]
	},
	{
		to: "/requests/new",
		labelKey: "navNew",
		icon: CirclePlus,
		roles: [
			"admin",
			"manager",
			"vehicle_user"
		]
	},
	{
		to: "/requests",
		labelKey: "navRequests",
		icon: ClipboardList,
		roles: [
			"admin",
			"manager",
			"mechanic",
			"vehicle_user",
			"viewer"
		]
	},
	{
		to: "/vehicles",
		labelKey: "navVehicles",
		icon: Truck,
		roles: [
			"admin",
			"manager",
			"viewer"
		]
	},
	{
		to: "/inventory",
		labelKey: "navInventory",
		icon: Package,
		roles: ["admin", "manager"]
	},
	{
		to: "/users",
		labelKey: "navUsers",
		icon: Users,
		roles: ["admin"]
	},
	{
		to: "/reports",
		labelKey: "navReports",
		icon: Gauge,
		roles: [
			"admin",
			"manager",
			"viewer"
		]
	},
	{
		to: "/audit",
		labelKey: "navAudit",
		icon: ScrollText,
		roles: ["admin"]
	}
];
function navFor(role) {
	return NAV.filter((item) => item.roles.includes(role)).map((item) => {
		if (item.to === "/requests" && role === "mechanic") return {
			...item,
			labelKey: "navMyJobs"
		};
		if (item.to === "/requests" && role === "vehicle_user") return {
			...item,
			labelKey: "navMyRequests"
		};
		if (item.to === "/requests") return {
			...item,
			labelKey: "navAllRequests"
		};
		return item;
	});
}
function BrandMark({ compact = false }) {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "size-4" })
		}), !compact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-base leading-none font-semibold tracking-wide text-sidebar-foreground",
				children: t("appName")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 truncate text-xs tracking-wide text-sidebar-muted uppercase",
				children: t("dept")
			})]
		})]
	});
}
function NavLinks({ role, pathname, onNavigate, variant }) {
	const { t } = useI18n();
	const items = navFor(role);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: cn("flex flex-col gap-1", variant === "mobile" && "px-3"),
		children: items.map((item) => {
			const active = item.to === "/" ? pathname === "/" : pathname === item.to || pathname.startsWith(`${item.to}/`);
			const Icon = item.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.to,
				onClick: onNavigate,
				className: cn("flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors", variant === "sidebar" && (active ? "bg-sidebar-accent text-sidebar-foreground" : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground"), variant === "mobile" && (active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted")),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 shrink-0" }), t(item.labelKey)]
			}, item.to);
		})
	});
}
function NotificationBell() {
	const { data = [] } = useNotifications();
	const qc = useQueryClient();
	const { t, locale } = useI18n();
	const unread = data.filter((n) => !n.read).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, {
		onOpenChange: (open) => {
			if (open && unread > 0) markNotificationsRead().then(() => qc.invalidateQueries({ queryKey: ["notifications"] }));
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "icon",
				className: "relative",
				"aria-label": t("notifications"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-4" }), unread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute -top-1 -right-1 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-xs font-semibold text-destructive-foreground",
					children: unread > 9 ? "9+" : unread
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
			align: "end",
			className: "w-80",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, { children: t("notifications") }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
				data.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-2 py-6 text-center text-sm text-muted-foreground",
					children: t("allCaughtUp")
				}),
				data.slice(0, 12).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: n.requestId ? "/requests/$requestId" : "/",
						params: n.requestId ? { requestId: n.requestId } : void 0,
						className: "flex flex-col items-start gap-0.5 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm leading-snug",
							children: n.message
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: formatDateTime(n.createdAt, locale)
						})]
					})
				}, n.id))
			]
		})]
	});
}
function AppShell({ profile, children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const user = useCurrentUser();
	const { t, role } = useI18n();
	const [open, setOpen] = (0, import_react.useState)(false);
	const mobileNav = navFor(profile.role).slice(0, 4);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "print-hidden fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-sidebar-border bg-sidebar lg:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-4 py-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 overflow-y-auto px-3 pb-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLinks, {
							role: profile.role,
							pathname,
							variant: "sidebar"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 border-t border-sidebar-border p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageToggle, { tone: "dark" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs tracking-wide text-sidebar-muted uppercase",
								children: role(profile.role)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sidebar-foreground [&_span]:text-sidebar-foreground [&_button]:text-sidebar-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:pl-60",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "print-hidden sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "icon",
								className: "lg:hidden",
								onClick: () => setOpen(true),
								"aria-label": t("openMenu"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "lg:hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, { compact: true })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "ml-auto flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "lg:hidden",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageToggle, {})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden text-sm text-muted-foreground md:inline",
										children: user?.displayName ?? profile.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationBell, {})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
						open,
						onOpenChange: setOpen,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
							side: "left",
							className: "bg-sidebar pt-12",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "px-4 pb-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, {})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLinks, {
									role: profile.role,
									pathname,
									variant: "sidebar",
									onNavigate: () => setOpen(false)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-auto space-y-3 p-4 text-sidebar-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageToggle, { tone: "dark" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "px-4 py-6 pb-24 lg:px-8 lg:pb-10",
						children
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "print-hidden fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-border bg-card lg:hidden",
				children: mobileNav.map((item) => {
					const active = item.to === "/" ? pathname === "/" : pathname === item.to || pathname.startsWith(`${item.to}/`);
					const Icon = item.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						className: cn("flex min-h-14 flex-col items-center justify-center gap-1 px-1 text-center text-xs font-medium", active ? "text-primary" : "text-muted-foreground"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "line-clamp-1",
							children: t(item.labelKey)
						})]
					}, item.to);
				})
			})
		]
	});
}
function AppLayout() {
	const { user, isPending } = useCurrentUserState();
	const profileQuery = useProfile(Boolean(user) && !isPending);
	const { t } = useI18n();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShellSkeleton, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if ((profileQuery.isPending || profileQuery.isFetching) && !profileQuery.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShellSkeleton, {});
	if (profileQuery.error || !profileQuery.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-background p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-sm text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold",
				children: t("profileErrorTitle")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: profileQuery.error instanceof Error ? profileQuery.error.message : t("profileErrorBody")
			})]
		})
	});
	if (!profileQuery.data.active) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-background p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-sm text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold",
				children: t("deactivatedTitle")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: t("deactivatedBody")
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		profile: profileQuery.data,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
function ShellSkeleton() {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center bg-sidebar px-6 text-sidebar-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex max-w-sm flex-col items-center text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-5 font-display text-3xl font-semibold",
					children: t("appName")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-sidebar-muted",
					children: t("loadingBay")
				})
			]
		})
	});
}
//#endregion
export { AppLayout as component };
