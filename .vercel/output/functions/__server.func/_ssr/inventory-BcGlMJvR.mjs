import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as formatBdt } from "./utils-BK93iFu4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useI18n } from "./router-DoBdnNsS.mjs";
import { C as useInventory, T as useProfile, b as upsertInventory } from "./hooks-DHQe4QNS.mjs";
import { t as Button } from "./button-C6_0vgHL.mjs";
import { t as Card } from "./card-BJS0x5ZB.mjs";
import { t as Badge } from "./badge-CruQ1s1c.mjs";
import { t as Input } from "./input-CAtov6Vz.mjs";
import { t as Label } from "./label-gLwDjbOl.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, t as Dialog } from "./dialog--dQC52OP.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-xrtlFUw-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/inventory-BcGlMJvR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InventoryPage() {
	const { data = [], isPending, refetch } = useInventory();
	const canEdit = ["admin", "manager"].includes(useProfile().data?.role ?? "");
	const { t } = useI18n();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		id: "",
		partName: "",
		stockQty: "",
		reorderLevel: "",
		unit: "pcs",
		unitPrice: ""
	});
	function edit(item) {
		setForm({
			id: item?.id ?? "",
			partName: item?.partName ?? "",
			stockQty: item ? String(item.stockQty) : "",
			reorderLevel: item ? String(item.reorderLevel) : "",
			unit: item?.unit ?? "pcs",
			unitPrice: item ? String(item.unitPrice) : ""
		});
		setOpen(true);
	}
	async function save() {
		try {
			await upsertInventory({ data: {
				id: form.id || void 0,
				partName: form.partName,
				stockQty: Number(form.stockQty),
				reorderLevel: Number(form.reorderLevel),
				unit: form.unit,
				unitPrice: Number(form.unitPrice)
			} });
			toast.success(t("inventorySaved"));
			setOpen(false);
			await refetch();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : t("saveFailed"));
		}
	}
	const low = data.filter((i) => i.lowStock).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-semibold",
					children: t("partsStore")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						data.length,
						" ",
						t("skus"),
						" · ",
						low,
						" ",
						t("atReorder")
					]
				})] }), canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => edit(),
					children: t("addPartTitle")
				})]
			}),
			isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: t("loadingInventory")
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "overflow-hidden rounded-2xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: t("parts") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: t("stock") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "hidden sm:table-cell",
						children: t("reorderLevel")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: t("unitPrice") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: data.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [item.partName, item.lowStock && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "destructive",
						className: "ml-2",
						children: t("low")
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						className: "tabular-nums",
						children: [
							item.stockQty,
							" ",
							item.unit
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "hidden tabular-nums sm:table-cell",
						children: item.reorderLevel
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "tabular-nums",
						children: formatBdt(item.unitPrice)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right",
						children: canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => edit(item),
							children: t("edit")
						})
					})
				] }, item.id)) })] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: form.id ? t("editPart") : t("addPartTitle") }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5 sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("name") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.partName,
									onChange: (e) => setForm((f) => ({
										...f,
										partName: e.target.value
									}))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("stock") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: form.stockQty,
									onChange: (e) => setForm((f) => ({
										...f,
										stockQty: e.target.value
									}))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("reorderLevel") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: form.reorderLevel,
									onChange: (e) => setForm((f) => ({
										...f,
										reorderLevel: e.target.value
									}))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("unit") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.unit,
									onChange: (e) => setForm((f) => ({
										...f,
										unit: e.target.value
									}))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("unitPrice") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: form.unitPrice,
									onChange: (e) => setForm((f) => ({
										...f,
										unitPrice: e.target.value
									}))
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => void save(),
						children: t("save")
					})
				] })
			})
		]
	});
}
//#endregion
export { InventoryPage as component };
