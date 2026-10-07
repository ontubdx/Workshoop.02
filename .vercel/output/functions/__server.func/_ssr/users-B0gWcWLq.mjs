import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as formatDate } from "./utils-BK93iFu4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useI18n } from "./router-DoBdnNsS.mjs";
import { D as useStaff, T as useProfile, y as updateUser } from "./hooks-DHQe4QNS.mjs";
import { t as Card } from "./card-BJS0x5ZB.mjs";
import { t as Badge } from "./badge-CruQ1s1c.mjs";
import { n as ROLES } from "./types-DcxPO1Wc.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-xrtlFUw-.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Qurg98JM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/users-B0gWcWLq.js
var import_jsx_runtime = require_jsx_runtime();
function UsersPage() {
	const me = useProfile().data;
	const { data = [], refetch, isPending } = useStaff();
	const { t, role, locale } = useI18n();
	if (me && me.role !== "admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: t("onlyAdminsUsers")
	});
	async function setRole(userId, next) {
		try {
			await updateUser({ data: {
				userId,
				role: next
			} });
			toast.success(t("roleUpdated"));
			await refetch();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : t("updateFailed"));
		}
	}
	async function setActive(userId, active) {
		try {
			await updateUser({ data: {
				userId,
				active
			} });
			toast.success(active ? t("userActivated") : t("userDeactivated"));
			await refetch();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : t("updateFailed"));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl font-semibold",
			children: t("usersTitle")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "max-w-xl text-sm text-muted-foreground",
			children: t("usersLead")
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "overflow-hidden rounded-2xl",
			children: isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "p-6 text-sm text-muted-foreground",
				children: t("loadingUsers")
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: t("name") }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "hidden md:table-cell",
					children: t("email")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: t("navUsers") }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: t("status") })
			] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: data.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: u.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground md:hidden",
						children: u.email
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							t("joined"),
							" ",
							formatDate(u.createdAt, locale)
						]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "hidden md:table-cell",
					children: u.email ?? "—"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: u.role,
					onValueChange: (v) => void setRole(u.userId, v),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "w-44",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: r,
						children: role(r)
					}, r)) })]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => void setActive(u.userId, !u.active),
					children: u.active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "success",
						children: t("active")
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "muted",
						children: t("inactive")
					})
				}) })
			] }, u.userId)) })] })
		})]
	});
}
//#endregion
export { UsersPage as component };
