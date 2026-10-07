import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as formatDate, r as formatBdt } from "./utils-BK93iFu4.mjs";
import { i as useI18n } from "./router-DoBdnNsS.mjs";
import { E as useRequests } from "./hooks-DHQe4QNS.mjs";
import { t as Button } from "./button-C6_0vgHL.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-BJS0x5ZB.mjs";
import { n as StatusBadge } from "./status-badge-DnHWSyk0.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-xrtlFUw-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-DFRMyKWU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function downloadCsv(name, rows) {
	const body = rows.map((r) => r.map((c) => `"${String(c).replaceAll("\"", "\"\"")}"`).join(",")).join("\n");
	const blob = new Blob([body], { type: "text/csv;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = name;
	a.click();
	URL.revokeObjectURL(url);
}
function ReportsPage() {
	const { data = [], isPending } = useRequests();
	const { t, locale, status } = useI18n();
	const billed = data.filter((r) => r.status !== "rejected");
	const total = billed.reduce((s, r) => s + r.totalCost, 0);
	const complete = billed.filter((r) => r.status === "delivered" || r.status === "work_complete");
	const byDept = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const r of billed) {
			const key = r.department || t("unassigned");
			map.set(key, (map.get(key) ?? 0) + r.totalCost);
		}
		return [...map.entries()].sort((a, b) => b[1] - a[1]);
	}, [billed, t]);
	function exportCsv() {
		downloadCsv("workshop-report.csv", [[
			"Registration",
			"Vehicle",
			"Department",
			"Status",
			"Priority",
			"Requester",
			"Mechanic",
			"Entry",
			"Delivery",
			"Labour",
			"Total"
		], ...data.map((r) => [
			r.registrationNo,
			r.vehicleLabel,
			r.department ?? "",
			status(r.status),
			r.priority,
			r.requesterName,
			r.assignedMechanicName ?? "",
			r.entryDate ?? "",
			r.actualDeliveryDate ?? r.tentativeDeliveryDate ?? "",
			String(Math.round(r.laborCost)),
			String(Math.round(r.totalCost))
		])]);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-semibold",
					children: t("reports")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: t("reportsLead")
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: exportCsv,
						children: t("exportCsv")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => window.print(),
						children: t("printPdf")
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "rounded-2xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs tracking-wide text-muted-foreground uppercase",
								children: t("jobs")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-display text-3xl font-semibold tabular-nums",
								children: data.length
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "rounded-2xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs tracking-wide text-muted-foreground uppercase",
								children: t("completed")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-display text-3xl font-semibold tabular-nums",
								children: complete.length
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "rounded-2xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs tracking-wide text-muted-foreground uppercase",
								children: t("totalCost")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-display text-3xl font-semibold tabular-nums",
								children: formatBdt(total)
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "rounded-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: t("costByDept") }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-3",
					children: [byDept.map(([dept, cost]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: dept }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium tabular-nums",
							children: formatBdt(cost)
						})]
					}, dept)), byDept.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: t("noCostData")
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "overflow-hidden rounded-2xl",
				children: isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "p-6 text-sm text-muted-foreground",
					children: t("loading")
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: t("vehicle") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: t("status") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "hidden md:table-cell",
						children: t("entry")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: t("total") })
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: data.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-sm",
						children: r.registrationNo
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: r.department
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: r.status }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "hidden md:table-cell",
						children: formatDate(r.entryDate, locale)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "tabular-nums",
						children: formatBdt(r.totalCost)
					})
				] }, r.id)) })] })
			})
		]
	});
}
//#endregion
export { ReportsPage as component };
