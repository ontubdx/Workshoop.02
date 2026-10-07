import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as formatDate, r as formatBdt } from "./utils-BK93iFu4.mjs";
import { i as useI18n } from "./router-DoBdnNsS.mjs";
import { E as useRequests, T as useProfile } from "./hooks-DHQe4QNS.mjs";
import { t as Card } from "./card-BJS0x5ZB.mjs";
import { t as Skeleton } from "./skeleton-5e2aQTWQ.mjs";
import { n as StatusBadge, t as PriorityBadge } from "./status-badge-DnHWSyk0.mjs";
import { r as STATUSES } from "./types-DcxPO1Wc.mjs";
import { t as Input } from "./input-CAtov6Vz.mjs";
import { t as Label } from "./label-gLwDjbOl.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Qurg98JM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/requests.index-CPt4h8rT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RequestsPage() {
	const { data = [], isPending, error } = useRequests();
	const role = useProfile().data?.role;
	const { t, locale, status: statusLabel } = useI18n();
	const [status, setStatus] = (0, import_react.useState)("all");
	const [from, setFrom] = (0, import_react.useState)("");
	const [to, setTo] = (0, import_react.useState)("");
	const [q, setQ] = (0, import_react.useState)("");
	const filtered = (0, import_react.useMemo)(() => {
		const query = q.trim().toLowerCase();
		return data.filter((row) => {
			if (status !== "all" && row.status !== status) return false;
			const day = row.createdAt.slice(0, 10);
			if (from && day < from) return false;
			if (to && day > to) return false;
			if (!query) return true;
			return row.registrationNo.toLowerCase().includes(query) || row.vehicleLabel.toLowerCase().includes(query) || row.problemDescription.toLowerCase().includes(query) || row.requesterName.toLowerCase().includes(query) || (row.assignedMechanicName ?? "").toLowerCase().includes(query);
		});
	}, [
		data,
		status,
		q,
		from,
		to
	]);
	const title = role === "mechanic" ? t("navMyJobs") : role === "vehicle_user" ? t("navMyRequests") : t("navAllRequests");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-semibold",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						filtered.length,
						" ",
						t("shown")
					]
				})] }), role && role !== "viewer" && role !== "mechanic" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/requests/new",
					className: "inline-flex h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground",
					children: t("navNew")
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 lg:flex-row lg:items-end",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "request-search",
							className: "sr-only",
							children: t("searchJobs")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "request-search",
							placeholder: t("searchJobs"),
							value: q,
							onChange: (e) => setQ(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: status,
						onValueChange: setStatus,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "lg:w-48",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: t("status") })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: t("allStatuses")
						}), STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: s,
							children: statusLabel(s)
						}, s))] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3 lg:w-80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "from",
								className: "text-xs text-muted-foreground",
								children: t("from")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "from",
								type: "date",
								value: from,
								onChange: (e) => setFrom(e.target.value)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "to",
								className: "text-xs text-muted-foreground",
								children: t("to")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "to",
								type: "date",
								value: to,
								onChange: (e) => setTo(e.target.value)
							})]
						})]
					})
				]
			}),
			isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-20 rounded-xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-20 rounded-xl" })]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-destructive",
				children: error instanceof Error ? error.message : t("couldNotLoadJobs")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [!isPending && filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "rounded-2xl p-8 text-center text-sm text-muted-foreground",
					children: t("noMatch")
				}), filtered.map((job) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/requests/$requestId",
					params: { requestId: job.id },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "rounded-2xl p-4 transition-colors hover:bg-muted/40 sm:p-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-sm font-medium",
											children: job.registrationNo
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground",
											children: job.vehicleLabel
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 line-clamp-2 text-sm",
										children: job.problemDescription
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 text-xs text-muted-foreground",
										children: [
											job.requesterName,
											" · ",
											formatDate(job.createdAt, locale),
											job.assignedMechanicName ? ` · ${job.assignedMechanicName}` : ""
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2 lg:flex-col lg:items-end",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { priority: job.priority }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: job.status })]
								}), job.totalCost > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium tabular-nums",
									children: formatBdt(job.totalCost)
								})]
							})]
						})
					})
				}, job.id))]
			})
		]
	});
}
//#endregion
export { RequestsPage as component };
