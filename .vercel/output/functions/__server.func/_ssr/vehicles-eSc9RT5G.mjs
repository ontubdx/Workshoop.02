import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { c as parseCsv } from "./utils-BK93iFu4.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useI18n } from "./router-DoBdnNsS.mjs";
import { O as useVehicles, T as useProfile, d as listRequests, l as importVehicles, x as upsertVehicle } from "./hooks-DHQe4QNS.mjs";
import { t as Button } from "./button-C6_0vgHL.mjs";
import { t as Card } from "./card-BJS0x5ZB.mjs";
import { t as Badge } from "./badge-CruQ1s1c.mjs";
import { n as StatusBadge } from "./status-badge-DnHWSyk0.mjs";
import { t as Input } from "./input-CAtov6Vz.mjs";
import { t as Label } from "./label-gLwDjbOl.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, t as Dialog } from "./dialog--dQC52OP.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-xrtlFUw-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vehicles-eSc9RT5G.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function emptyForm() {
	return {
		id: "",
		registrationNo: "",
		type: "Van",
		brand: "",
		model: "",
		department: "",
		assignedDriver: "",
		odometerKm: "",
		serviceIntervalKm: "5000"
	};
}
function VehiclesPage() {
	const { data = [], isPending, refetch } = useVehicles();
	const isAdmin = useProfile().data?.role === "admin";
	const { t } = useI18n();
	const [q, setQ] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)(emptyForm());
	const [historyId, setHistoryId] = (0, import_react.useState)(null);
	const jobs = useQuery({
		queryKey: ["requests"],
		queryFn: () => listRequests()
	});
	const filtered = data.filter((v) => {
		return `${v.registrationNo} ${v.brand} ${v.model} ${v.department} ${v.assignedDriver}`.toLowerCase().includes(q.trim().toLowerCase());
	});
	function edit(v) {
		if (!v) setForm(emptyForm());
		else setForm({
			id: v.id,
			registrationNo: v.registrationNo,
			type: v.type,
			brand: v.brand ?? "",
			model: v.model ?? "",
			department: v.department ?? "",
			assignedDriver: v.assignedDriver ?? "",
			odometerKm: v.odometerKm != null ? String(v.odometerKm) : "",
			serviceIntervalKm: v.serviceIntervalKm != null ? String(v.serviceIntervalKm) : ""
		});
		setOpen(true);
	}
	async function save() {
		try {
			await upsertVehicle({ data: {
				id: form.id || void 0,
				registrationNo: form.registrationNo,
				type: form.type,
				brand: form.brand,
				model: form.model,
				department: form.department,
				assignedDriver: form.assignedDriver,
				odometerKm: form.odometerKm ? Number(form.odometerKm) : null,
				serviceIntervalKm: form.serviceIntervalKm ? Number(form.serviceIntervalKm) : null
			} });
			toast.success(form.id ? t("vehicleUpdated") : t("vehicleAdded"));
			setOpen(false);
			await refetch();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : t("saveFailed"));
		}
	}
	async function onCsv(file) {
		if (!file) return;
		const text = await file.text();
		const rows = parseCsv(text);
		if (rows.length < 2) {
			toast.error(t("csvNeedRows"));
			return;
		}
		const header = rows[0].map((h) => h.toLowerCase().replace(/[\s_]+/g, ""));
		const idx = (names) => header.findIndex((h) => names.includes(h));
		const mapped = rows.slice(1).map((row) => ({
			registrationNo: row[idx([
				"registrationno",
				"reg",
				"registration"
			])] ?? "",
			type: row[idx(["type"])] ?? "Vehicle",
			brand: row[idx(["brand", "make"])] ?? "",
			model: row[idx(["model"])] ?? "",
			department: row[idx(["department", "dept"])] ?? "",
			assignedDriver: row[idx(["assigneddriver", "driver"])] ?? "",
			odometerKm: Number(row[idx([
				"odometerkm",
				"odometer",
				"km"
			])] ?? "") || null
		}));
		try {
			const res = await importVehicles({ data: { rows: mapped } });
			toast.success(`${res.imported} ${t("imported")}`);
			await refetch();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : t("importFailed"));
		}
	}
	const historyVehicle = data.find((v) => v.id === historyId);
	const historyJobs = (jobs.data ?? []).filter((j) => j.vehicleId === historyId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-semibold",
					children: t("fleet")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						data.length,
						" ",
						t("vehiclesOnBooks")
					]
				})] }), isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => {
								const blob = new Blob(["registrationNo,type,brand,model,department,assignedDriver,odometerKm\nDHAKA-GA-21-1001,Van,Toyota,Hiace,Hatchery,Karim Uddin,128400\n"], { type: "text/csv;charset=utf-8" });
								const url = URL.createObjectURL(blob);
								const a = document.createElement("a");
								a.href = url;
								a.download = "vehicles-template.csv";
								a.click();
								URL.revokeObjectURL(url);
							},
							children: t("csvTemplate")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "inline-flex h-10 cursor-pointer items-center rounded-md border border-border bg-card px-4 text-sm font-medium",
							children: [t("importCsv"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								accept: ".csv,text/csv",
								className: "hidden",
								onChange: (e) => void onCsv(e.target.files?.[0])
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => edit(),
							children: t("addVehicle")
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: t("searchFleet"),
				value: q,
				onChange: (e) => setQ(e.target.value),
				className: "max-w-sm"
			}),
			isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: t("loadingFleet")
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "overflow-hidden rounded-2xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: t("registration") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "hidden md:table-cell",
						children: t("vehicle")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "hidden lg:table-cell",
						children: t("department")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "hidden lg:table-cell",
						children: t("driver")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: t("km") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: filtered.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-sm",
						children: v.registrationNo
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground md:hidden",
						children: [
							v.brand,
							" ",
							v.model
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						className: "hidden md:table-cell",
						children: [
							v.brand,
							" ",
							v.model,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs text-muted-foreground",
								children: v.type
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "hidden lg:table-cell",
						children: v.department ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "hidden lg:table-cell",
						children: v.assignedDriver ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm tabular-nums",
							children: v.odometerKm != null ? v.odometerKm.toLocaleString() : "—"
						}),
						v.dueForService && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "warning",
							className: "ml-2",
							children: t("due")
						}),
						v.status === "in_workshop" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "default",
							className: "ml-2",
							children: t("statusInBay")
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => setHistoryId(v.id),
							children: t("history")
						}), isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => edit(v),
							children: t("edit")
						})]
					})
				] }, v.id)) })] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: t("csvHint")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: form.id ? t("editVehicle") : t("addVehicleTitle") }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [
							["registrationNo", t("registration")],
							["type", t("type")],
							["brand", t("brand")],
							["model", t("model")],
							["department", t("department")],
							["assignedDriver", t("driver")],
							["odometerKm", t("odometer")],
							["serviceIntervalKm", t("serviceInterval")]
						].map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form[key],
								onChange: (e) => setForm((f) => ({
									...f,
									[key]: e.target.value
								}))
							})]
						}, key))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => void save(),
						children: t("save")
					})
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!historyId,
				onOpenChange: (o) => !o && setHistoryId(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-lg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: [
						historyVehicle?.registrationNo,
						" · ",
						t("serviceHistory")
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-h-80 space-y-2 overflow-y-auto",
						children: [historyJobs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: t("noHistory")
						}), historyJobs.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/requests/$requestId",
							params: { requestId: j.id },
							className: "flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "line-clamp-1",
								children: j.problemDescription
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: j.status })]
						}, j.id))]
					})]
				})
			})
		]
	});
}
//#endregion
export { VehiclesPage as component };
