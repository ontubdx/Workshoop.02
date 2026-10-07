import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as formatDateTime, i as formatDate, r as formatBdt, t as cn } from "./utils-BK93iFu4.mjs";
import { b as Check, c as Star, t as X, u as Printer } from "../_libs/lucide-react.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useI18n, n as Route$2 } from "./router-DoBdnNsS.mjs";
import { C as useInventory, D as useStaff, T as useProfile, _ as setLaborCost, a as completeWork, c as getRequest, g as requestParts, h as removeWorkItem, i as assignMechanic, m as removePart, n as addPart, o as confirmDelivery, p as rejectRequest, r as addWorkItem, t as acceptRequest, v as updateMechanicStatus } from "./hooks-DHQe4QNS.mjs";
import { t as Button } from "./button-C6_0vgHL.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-BJS0x5ZB.mjs";
import { t as Skeleton } from "./skeleton-5e2aQTWQ.mjs";
import { n as StatusBadge, t as PriorityBadge } from "./status-badge-DnHWSyk0.mjs";
import { a as canManageJobs, t as MECHANIC_STATUSES } from "./types-DcxPO1Wc.mjs";
import { t as Input } from "./input-CAtov6Vz.mjs";
import { t as Label } from "./label-gLwDjbOl.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogDescription, t as Dialog } from "./dialog--dQC52OP.mjs";
import { t as Textarea } from "./textarea-DKMg2RMf.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Qurg98JM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/requests._requestId-BT9ha8Kn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STEPS = [
	"pending",
	"accepted",
	"in_workshop",
	"work_complete",
	"delivered"
];
function StatusStepper({ status }) {
	const { t, status: label } = useI18n();
	if (status === "rejected") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4 shrink-0" }), t("rejectedBanner")]
	});
	const current = STEPS.findIndex((s) => s === status);
	const short = {
		pending: label("pending"),
		accepted: label("accepted"),
		rejected: label("rejected"),
		in_workshop: t("statusInBay"),
		work_complete: t("completed"),
		delivered: label("delivered")
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "grid grid-cols-5 gap-1 sm:gap-2",
		children: STEPS.map((step, i) => {
			const done = i < current;
			const active = i === current;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("flex h-1.5 overflow-hidden rounded-full", done || active ? "bg-primary" : "bg-muted") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: cn("mt-2 flex items-center gap-1 text-xs leading-tight", active ? "font-semibold text-foreground" : done ? "text-foreground" : "text-muted-foreground"),
					children: [done && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "hidden size-3 shrink-0 sm:inline" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate",
						children: short[step]
					})]
				})]
			}, step);
		})
	});
}
function todayISO() {
	return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function plusDays(n) {
	const d = /* @__PURE__ */ new Date();
	d.setDate(d.getDate() + n);
	return d.toISOString().slice(0, 10);
}
function JobDetailPage() {
	const { requestId } = Route$2.useParams();
	const qc = useQueryClient();
	const profile = useProfile().data;
	const staff = useStaff();
	const inventory = useInventory();
	const { t, locale, mechanicStatus } = useI18n();
	const jobQuery = useQuery({
		queryKey: ["request", requestId],
		queryFn: () => getRequest({ data: { id: requestId } })
	});
	const [acceptOpen, setAcceptOpen] = (0, import_react.useState)(false);
	const [rejectOpen, setRejectOpen] = (0, import_react.useState)(false);
	const [entryDate, setEntryDate] = (0, import_react.useState)(todayISO());
	const [deliveryDate, setDeliveryDate] = (0, import_react.useState)(plusDays(3));
	const [mechanicId, setMechanicId] = (0, import_react.useState)("");
	const [reason, setReason] = (0, import_react.useState)("");
	const [workText, setWorkText] = (0, import_react.useState)("");
	const [partName, setPartName] = (0, import_react.useState)("");
	const [partSource, setPartSource] = (0, import_react.useState)("store");
	const [storeId, setStoreId] = (0, import_react.useState)("");
	const [vendor, setVendor] = (0, import_react.useState)("");
	const [unitPrice, setUnitPrice] = (0, import_react.useState)("");
	const [qty, setQty] = (0, import_react.useState)("1");
	const [labor, setLabor] = (0, import_react.useState)("");
	const [partsNeed, setPartsNeed] = (0, import_react.useState)("");
	const [rating, setRating] = (0, import_react.useState)(5);
	const [feedback, setFeedback] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const job = jobQuery.data;
	const role = profile?.role;
	const manager = role ? canManageJobs(role) : false;
	const isRequester = job && profile ? job.requestedBy === profile.userId : false;
	const isMechanic = job && profile ? job.assignedMechanic === profile.userId : false;
	const readOnly = role === "viewer";
	async function refresh() {
		await qc.invalidateQueries();
	}
	async function run(label, fn) {
		setBusy(true);
		try {
			await fn();
			await refresh();
			toast.success(label);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : t("updateFailed"));
		} finally {
			setBusy(false);
		}
	}
	if (jobQuery.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-64" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48 rounded-xl" })]
	});
	if (jobQuery.error || !job) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-destructive",
		children: jobQuery.error instanceof Error ? jobQuery.error.message : t("jobNotFound")
	});
	const mechanics = (staff.data ?? []).filter((p) => p.active && (p.role === "mechanic" || p.role === "manager" || p.role === "admin"));
	const storeItems = inventory.data ?? [];
	const selectedStore = storeItems.find((i) => i.id === storeId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "print-only mb-6 border-b border-border pb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs tracking-wide text-muted-foreground uppercase",
						children: [
							t("dept"),
							" · ",
							t("jobCard")
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl font-semibold",
						children: job.registrationNo
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: [job.vehicleLabel, job.department ? ` · ${job.department}` : ""]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "print-hidden flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/requests",
						className: "text-sm text-muted-foreground hover:text-foreground",
						children: t("backRequests")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-3xl font-semibold",
						children: job.registrationNo
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: [job.vehicleLabel, job.department ? ` · ${job.department}` : ""]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { priority: job.priority }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: job.status }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => window.print(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" }), t("printJobCard")]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusStepper, { status: job.status }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 xl:grid-cols-[1.4fr_0.8fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "rounded-2xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: t("problemTitle") }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm leading-relaxed",
										children: job.problemDescription
									}),
									job.rejectionReason && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive",
										children: [
											t("rejectedPrefix"),
											" ",
											job.rejectionReason
										]
									}),
									job.photoUrls.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
										children: job.photoUrls.map((src, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src,
											alt: "",
											className: "h-28 w-full rounded-lg border border-border object-cover"
										}, i))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
										className: "grid grid-cols-2 gap-3 text-sm sm:grid-cols-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
												className: "text-xs text-muted-foreground",
												children: t("requestedBy")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: job.requesterName })] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
												className: "text-xs text-muted-foreground",
												children: t("submitted")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formatDate(job.createdAt, locale) })] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
												className: "text-xs text-muted-foreground",
												children: t("entry")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formatDate(job.entryDate, locale) })] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
												className: "text-xs text-muted-foreground",
												children: t("tentativeDelivery")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formatDate(job.tentativeDeliveryDate, locale) })] })
										]
									})
								]
							})]
						}),
						manager && job.status === "pending" && !readOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "print-hidden flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => setAcceptOpen(true),
								children: t("acceptJob")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setRejectOpen(true),
								children: t("reject")
							})]
						}),
						manager && (job.status === "accepted" || job.status === "in_workshop") && !readOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "print-hidden rounded-2xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: t("assignMechanic") }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "flex flex-col gap-3 sm:flex-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: mechanicId,
									onValueChange: setMechanicId,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "sm:flex-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: job.assignedMechanicName ?? t("selectMechanic") })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: mechanics.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: m.userId,
										children: [
											m.name,
											" · ",
											m.role
										]
									}, m.userId)) })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									disabled: !mechanicId || busy,
									onClick: () => run(t("mechanicAssigned"), () => assignMechanic({ data: {
										id: job.id,
										mechanicId
									} })),
									children: t("assign")
								})]
							})]
						}),
						(isMechanic || manager) && job.status === "in_workshop" && !readOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "print-hidden rounded-2xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: t("mechanicProgress") }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "flex flex-col gap-3 sm:flex-row sm:items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: job.mechanicStatus,
									onValueChange: (v) => run(t("statusUpdated"), () => updateMechanicStatus({ data: {
										id: job.id,
										mechanicStatus: v
									} })),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "sm:w-56",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: MECHANIC_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: s,
										children: mechanicStatus(s)
									}, s)) })]
								}), isMechanic && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									className: "flex flex-1 flex-col gap-2 sm:flex-row",
									onSubmit: (e) => {
										e.preventDefault();
										if (!partsNeed.trim()) return;
										run(t("partsRequestSent"), () => requestParts({ data: {
											requestId: job.id,
											message: partsNeed
										} })).then(() => setPartsNeed(""));
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: t("requestPartsPlaceholder"),
										value: partsNeed,
										onChange: (e) => setPartsNeed(e.target.value)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										variant: "outline",
										disabled: busy,
										children: t("requestParts")
									})]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "rounded-2xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: t("workDone") }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "space-y-3",
								children: [
									job.workItems.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: t("noWorkItems")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "space-y-2",
										children: job.workItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-start justify-between gap-3 text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.description }), manager && !readOnly && job.status !== "delivered" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "print-hidden text-xs text-muted-foreground hover:text-destructive",
												onClick: () => run(t("removed"), () => removeWorkItem({ data: {
													id: item.id,
													requestId: job.id
												} })),
												children: t("remove")
											})]
										}, item.id))
									}),
									manager && !readOnly && job.status !== "delivered" && job.status !== "rejected" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
										className: "print-hidden flex flex-col gap-2 sm:flex-row",
										onSubmit: (e) => {
											e.preventDefault();
											if (!workText.trim()) return;
											run(t("workItemAdded"), () => addWorkItem({ data: {
												requestId: job.id,
												description: workText
											} })).then(() => setWorkText(""));
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: workText,
											onChange: (e) => setWorkText(e.target.value),
											placeholder: t("describeWork")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "submit",
											variant: "secondary",
											disabled: busy,
											children: t("add")
										})]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "rounded-2xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: t("parts") }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "space-y-4",
								children: [
									job.parts.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: t("noParts")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "space-y-2",
										children: job.parts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-start justify-between gap-3 text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
												p.name,
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-xs text-muted-foreground",
													children: ["· ", p.source === "store" ? t("store") : p.vendor || t("external")]
												})
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "tabular-nums text-muted-foreground",
												children: [
													p.qty,
													" × ",
													formatBdt(p.unitPrice)
												]
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-right",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-medium tabular-nums",
													children: formatBdt(p.totalPrice)
												}), manager && !readOnly && job.status !== "delivered" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													className: "print-hidden text-xs text-muted-foreground hover:text-destructive",
													onClick: () => run(t("partRemoved"), () => removePart({ data: {
														id: p.id,
														requestId: job.id
													} })),
													children: t("remove")
												})]
											})]
										}, p.id))
									}),
									manager && !readOnly && job.status !== "delivered" && job.status !== "rejected" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
										className: "print-hidden space-y-3 rounded-xl bg-muted/50 p-3",
										onSubmit: (e) => {
											e.preventDefault();
											const name = partSource === "store" ? selectedStore?.partName || partName : partName;
											const price = partSource === "store" && selectedStore ? selectedStore.unitPrice : Number(unitPrice);
											run(t("partAdded"), () => addPart({ data: {
												requestId: job.id,
												name,
												source: partSource,
												vendor: partSource === "external" ? vendor : void 0,
												unitPrice: price,
												qty: Number(qty),
												inventoryId: partSource === "store" ? storeId || null : null
											} })).then(() => {
												setPartName("");
												setVendor("");
												setUnitPrice("");
												setQty("1");
											});
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid gap-3 sm:grid-cols-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("source") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
														value: partSource,
														onValueChange: (v) => setPartSource(v),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "store",
															children: t("workshopStore")
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "external",
															children: t("purchasedOutside")
														})] })]
													})]
												}),
												partSource === "store" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("storePart") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
														value: storeId,
														onValueChange: setStoreId,
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: t("selectPart") }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: storeItems.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
															value: i.id,
															children: [
																i.partName,
																" · ",
																i.stockQty,
																" ",
																i.unit
															]
														}, i.id)) })]
													})]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("partName") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															value: partName,
															onChange: (e) => setPartName(e.target.value)
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("vendor") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															value: vendor,
															onChange: (e) => setVendor(e.target.value)
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("unitPrice") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															type: "number",
															min: "0",
															value: unitPrice,
															onChange: (e) => setUnitPrice(e.target.value)
														})]
													})
												] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("qty") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														type: "number",
														min: "0.1",
														step: "0.1",
														value: qty,
														onChange: (e) => setQty(e.target.value)
													})]
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "submit",
											variant: "secondary",
											size: "sm",
											disabled: busy,
											children: t("addPart")
										})]
									})
								]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "rounded-2xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: t("costSummary") }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "space-y-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: t("storeParts")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tabular-nums",
											children: formatBdt(job.partsStore)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: t("outsidePurchase")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tabular-nums",
											children: formatBdt(job.partsExternal)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: t("labour")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tabular-nums",
											children: formatBdt(job.laborCost)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between border-t border-border pt-2 font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("total") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tabular-nums",
											children: formatBdt(job.totalCost)
										})]
									}),
									manager && !readOnly && job.status !== "delivered" && job.status !== "rejected" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
										className: "print-hidden flex gap-2 pt-2",
										onSubmit: (e) => {
											e.preventDefault();
											run(t("labourSaved"), () => setLaborCost({ data: {
												requestId: job.id,
												laborCost: Number(labor || 0)
											} }));
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											min: "0",
											placeholder: `${t("labour")} ৳`,
											value: labor,
											onChange: (e) => setLabor(e.target.value)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "submit",
											variant: "secondary",
											disabled: busy,
											children: t("save")
										})]
									}),
									manager && !readOnly && (job.status === "in_workshop" || job.status === "accepted") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										className: "print-hidden mt-2 w-full",
										disabled: busy,
										onClick: () => run(t("markedComplete"), () => completeWork({ data: { id: job.id } })),
										children: t("markComplete")
									})
								]
							})]
						}),
						(isRequester || manager) && job.status === "work_complete" && !readOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "print-hidden rounded-2xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: t("confirmPickup") }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex gap-1",
										children: [
											1,
											2,
											3,
											4,
											5
										].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setRating(n),
											className: "p-1",
											"aria-label": `${n} ${t("rating")}`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: n <= rating ? "size-5 fill-primary text-primary" : "size-5 text-muted-foreground" })
										}, n))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										placeholder: t("optionalFeedback"),
										value: feedback,
										onChange: (e) => setFeedback(e.target.value)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										className: "w-full",
										disabled: busy,
										onClick: () => run(t("vehicleCollected"), () => confirmDelivery({ data: {
											id: job.id,
											rating,
											feedback
										} })),
										children: t("confirmDelivery")
									})
								]
							})]
						}),
						job.status === "delivered" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "rounded-2xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: t("delivery") }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										t("collected"),
										" ",
										formatDate(job.actualDeliveryDate, locale)
									] }),
									job.rating != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1",
										children: [
											t("rating"),
											" ",
											job.rating,
											"/5"
										]
									}),
									job.feedback && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-muted-foreground",
										children: job.feedback
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "rounded-2xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: t("auditTrail") }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "space-y-3",
								children: [job.history.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: t("noEvents")
								}), job.history.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium",
											children: h.action.replaceAll("_", " ")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground",
											children: [
												h.userName ?? "System",
												" · ",
												formatDateTime(h.createdAt, locale)
											]
										}),
										h.details && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: h.details
										})
									]
								}, h.id))]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "print-only mt-10 grid grid-cols-2 gap-10 pt-8 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-wide text-muted-foreground uppercase",
					children: t("mechanic")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 border-t border-border pt-2",
					children: job.assignedMechanicName ?? "________________"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-wide text-muted-foreground uppercase",
					children: t("receivedBy")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 border-t border-border pt-2",
					children: job.requesterName
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: acceptOpen,
				onOpenChange: setAcceptOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: t("acceptJob") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: t("acceptDates") })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("entryDate") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: entryDate,
								onChange: (e) => setEntryDate(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("tentativeDelivery") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: deliveryDate,
								onChange: (e) => setDeliveryDate(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: [
								t("mechanic"),
								" (",
								t("assignLater"),
								")"
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: mechanicId,
								onValueChange: setMechanicId,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: t("assignLater") }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: mechanics.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: m.userId,
									children: m.name
								}, m.userId)) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "w-full",
							disabled: busy,
							onClick: () => run(t("accepted"), () => acceptRequest({ data: {
								id: job.id,
								entryDate,
								tentativeDeliveryDate: deliveryDate,
								assignedMechanic: mechanicId || null
							} })).then(() => setAcceptOpen(false)),
							children: t("acceptJob")
						})
					]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: rejectOpen,
				onOpenChange: setRejectOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: t("rejectJob") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: t("rejectReasonLead") })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: reason,
						onChange: (e) => setReason(e.target.value),
						rows: 4
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "destructive",
						className: "w-full",
						disabled: busy,
						onClick: () => run(t("jobRejected"), () => rejectRequest({ data: {
							id: job.id,
							reason
						} })).then(() => setRejectOpen(false)),
						children: t("rejectRequest")
					})
				] })
			})
		]
	});
}
//#endregion
export { JobDetailPage as component };
