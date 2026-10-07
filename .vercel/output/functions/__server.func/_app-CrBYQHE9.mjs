import { b as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "./_libs/@radix-ui/react-collection+[...].mjs";
import { i as formatDate, r as formatBdt } from "./_ssr/utils-BK93iFu4.mjs";
import { g as Clock3, m as Hammer, r as Wallet, s as Timer } from "./_libs/lucide-react.mjs";
import { i as useI18n } from "./_ssr/router-DoBdnNsS.mjs";
import { S as useDashboard, T as useProfile } from "./_ssr/hooks-DHQe4QNS.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./_ssr/card-BJS0x5ZB.mjs";
import { t as Skeleton } from "./_ssr/skeleton-5e2aQTWQ.mjs";
import { n as StatusBadge, t as PriorityBadge } from "./_ssr/status-badge-DnHWSyk0.mjs";
import { a as Bar, i as CartesianGrid, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as BarChart } from "./_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app-CrBYQHE9.js
var import_jsx_runtime = require_jsx_runtime();
function DashboardPage() {
	const { data, isPending, error } = useDashboard();
	const profile = useProfile().data;
	const { t, locale, status } = useI18n();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-56" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
			children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 rounded-xl" }, i))
		})]
	});
	if (error || !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-destructive",
		children: error instanceof Error ? error.message : t("couldNotLoadDash")
	});
	const kpis = [
		{
			label: t("kpiOpen"),
			value: String(data.openRequests),
			hint: t("kpiUrgentPending", {
				urgent: data.urgentOpen,
				pending: data.pending
			}),
			icon: Hammer
		},
		{
			label: t("kpiInBay"),
			value: String(data.inWorkshop),
			hint: t("kpiInBayHint"),
			icon: Clock3
		},
		{
			label: t("kpiMonth"),
			value: formatBdt(data.monthCost),
			hint: t("kpiPartsLabour"),
			icon: Wallet
		},
		{
			label: t("kpiTurnaround"),
			value: data.avgTurnaroundDays == null ? "—" : `${data.avgTurnaroundDays}d`,
			hint: t("kpiEntryToDelivery"),
			icon: Timer
		}
	];
	const heading = profile?.role === "mechanic" ? t("headingMechanic") : profile?.role === "vehicle_user" ? t("headingUser") : t("headingFloor");
	const trend = data.costTrend.map((row) => ({
		...row,
		label: row.month.slice(5)
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
				children: profile ? `${t("signedInAs")} ${profile.name}` : t("overview")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-semibold tracking-tight",
				children: heading
			})] }),
			(data.lowStock > 0 || data.dueService > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2 text-sm",
				children: [data.dueService > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/vehicles",
					className: "rounded-full bg-warning/12 px-3 py-1 font-medium text-warning",
					children: [
						data.dueService,
						" ",
						t("dueService")
					]
				}), data.lowStock > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/inventory",
					className: "rounded-full bg-destructive/10 px-3 py-1 font-medium text-destructive",
					children: [
						data.lowStock,
						" ",
						t("lowStockAlert")
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: kpis.map((kpi) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "rounded-2xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "flex items-start justify-between p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
								children: kpi.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-display text-3xl leading-none font-semibold tabular-nums",
								children: kpi.value
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: kpi.hint
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(kpi.icon, { className: "size-4" })
						})]
					})
				}, kpi.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 xl:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "rounded-2xl xl:col-span-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: t("costTrend") }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "h-64",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: trend,
								barCategoryGap: "28%",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										vertical: false,
										stroke: "var(--color-border)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "label",
										tickLine: false,
										axisLine: false,
										fontSize: 12
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										tickLine: false,
										axisLine: false,
										fontSize: 12,
										tickFormatter: (v) => v >= 1e3 ? `${Math.round(v / 1e3)}k` : String(v)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										cursor: { fill: "var(--color-muted)" },
										formatter: (value) => formatBdt(Number(value ?? 0)),
										contentStyle: {
											background: "var(--color-card)",
											border: "1px solid var(--color-border)",
											borderRadius: 12
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "cost",
										fill: "var(--color-primary)",
										radius: [
											6,
											6,
											0,
											0
										]
									})
								]
							})
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "rounded-2xl xl:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: t("topVehicles") }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-3",
						children: [
							data.topVehicles.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: t("noBilled")
							}),
							data.topVehicles.map((row) => {
								const max = data.topVehicles[0]?.cost || 1;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-1 flex items-baseline justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-xs",
										children: row.registrationNo
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-medium tabular-nums",
										children: formatBdt(row.cost)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-1.5 overflow-hidden rounded-full bg-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full rounded-full bg-primary",
										style: { width: `${Math.max(8, row.cost / max * 100)}%` }
									})
								})] }, row.registrationNo);
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2 pt-2",
								children: data.statusBreakdown.filter((s) => s.count > 0).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground",
									children: [
										status(s.status),
										" ",
										s.count
									]
								}, s.status))
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "rounded-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "flex flex-row items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: t("recentJobs") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/requests",
						className: "text-sm font-medium text-primary",
						children: t("viewAll")
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-1 p-0",
					children: [data.recent.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-5 pb-5 text-sm text-muted-foreground",
						children: t("noJobsYet")
					}), data.recent.map((job) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/requests/$requestId",
						params: { requestId: job.id },
						className: "flex flex-col gap-2 border-t border-border px-5 py-4 hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-sm",
								children: job.registrationNo
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm text-muted-foreground",
								children: job.problemDescription
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { priority: job.priority }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: job.status }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: formatDate(job.createdAt, locale)
								})
							]
						})]
					}, job.id))]
				})]
			})
		]
	});
}
//#endregion
export { DashboardPage as component };
