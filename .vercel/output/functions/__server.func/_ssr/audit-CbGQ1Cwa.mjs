import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as formatDateTime } from "./utils-BK93iFu4.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { i as useI18n } from "./router-DoBdnNsS.mjs";
import { T as useProfile, u as listAudit } from "./hooks-DHQe4QNS.mjs";
import { t as Card } from "./card-BJS0x5ZB.mjs";
import { t as Input } from "./input-CAtov6Vz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/audit-CbGQ1Cwa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuditPage() {
	const role = useProfile().data?.role;
	const { t, locale } = useI18n();
	const { data = [], isPending, error } = useQuery({
		queryKey: ["audit"],
		queryFn: () => listAudit(),
		enabled: role === "admin"
	});
	const [q, setQ] = (0, import_react.useState)("");
	const filtered = (0, import_react.useMemo)(() => {
		const query = q.trim().toLowerCase();
		if (!query) return data;
		return data.filter((row) => `${row.action} ${row.userName} ${row.targetCollection} ${row.targetId} ${row.details}`.toLowerCase().includes(query));
	}, [data, q]);
	if (role && role !== "admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: t("onlyAdminsAudit")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-semibold",
				children: t("auditTitle")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: t("auditLead")
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: t("searchAudit"),
				value: q,
				onChange: (e) => setQ(e.target.value),
				className: "max-w-sm"
			}),
			isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: t("loading")
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-destructive",
				children: error instanceof Error ? error.message : t("couldNotLoadAudit")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "divide-y divide-border rounded-2xl",
				children: [filtered.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: row.action.replaceAll("_", " ")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								row.userName ?? row.userId,
								" · ",
								row.targetCollection,
								row.targetId ? ` · ${row.targetId}` : "",
								" · ",
								formatDateTime(row.createdAt, locale)
							]
						}),
						row.details && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: row.details
						})
					]
				}, row.id)), !isPending && filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "p-6 text-sm text-muted-foreground",
					children: t("noMatchingEvents")
				})]
			})
		]
	});
}
//#endregion
export { AuditPage as component };
