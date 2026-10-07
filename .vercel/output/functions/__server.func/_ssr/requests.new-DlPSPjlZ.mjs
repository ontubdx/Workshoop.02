import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { S as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as compressImage } from "./utils-BK93iFu4.mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useI18n } from "./router-DoBdnNsS.mjs";
import { O as useVehicles, T as useProfile, s as createRequest } from "./hooks-DHQe4QNS.mjs";
import { t as Button } from "./button-C6_0vgHL.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-BJS0x5ZB.mjs";
import { t as Label } from "./label-gLwDjbOl.mjs";
import { t as Textarea } from "./textarea-DKMg2RMf.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Qurg98JM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/requests.new-DlPSPjlZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NewRequestPage() {
	const vehicles = useVehicles();
	const profile = useProfile().data;
	const navigate = useNavigate();
	const qc = useQueryClient();
	const { t } = useI18n();
	const [vehicleId, setVehicleId] = (0, import_react.useState)("");
	const [priority, setPriority] = (0, import_react.useState)("normal");
	const [problem, setProblem] = (0, import_react.useState)("");
	const [photos, setPhotos] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onPhotos(files) {
		if (!files) return;
		try {
			const next = [];
			for (const file of Array.from(files).slice(0, 4 - photos.length)) {
				if (!file.type.startsWith("image/")) continue;
				next.push(await compressImage(file));
			}
			setPhotos((prev) => [...prev, ...next].slice(0, 4));
		} catch (err) {
			toast.error(err instanceof Error ? err.message : t("couldNotSubmit"));
		}
	}
	async function onSubmit(e) {
		e.preventDefault();
		if (!vehicleId) {
			toast.error(t("selectVehicle"));
			return;
		}
		if (!problem.trim()) {
			toast.error(t("describeProblem"));
			return;
		}
		setBusy(true);
		try {
			const res = await createRequest({ data: {
				vehicleId,
				problemDescription: problem,
				priority,
				photoUrls: photos
			} });
			await qc.invalidateQueries();
			toast.success(t("requestSubmitted"));
			await navigate({
				to: "/requests/$requestId",
				params: { requestId: res.id }
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : t("couldNotSubmit"));
		} finally {
			setBusy(false);
		}
	}
	const fleet = vehicles.data ?? [];
	if (profile && (profile.role === "viewer" || profile.role === "mechanic")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: t("noPermission")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl font-semibold",
			children: t("newRequest")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: t("newRequestLead")
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "rounded-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: t("jobIntake") }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-4",
				onSubmit,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("vehicle") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: vehicleId,
							onValueChange: setVehicleId,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: t("selectRegistration") }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: fleet.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
								value: v.id,
								children: [
									v.registrationNo,
									" · ",
									v.brand,
									" ",
									v.model
								]
							}, v.id)) })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("priority") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: priority,
							onValueChange: (v) => setPriority(v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "normal",
								children: t("normal")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "urgent",
								children: t("urgentOffRoad")
							})] })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "problem",
							children: t("problem")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "problem",
							required: true,
							rows: 6,
							value: problem,
							onChange: (e) => setProblem(e.target.value),
							placeholder: t("problemHint")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "photos",
								children: t("photos")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "photos",
								type: "file",
								accept: "image/*",
								multiple: true,
								className: "block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-sm file:font-medium file:text-secondary-foreground",
								onChange: (e) => void onPhotos(e.target.files)
							}),
							photos.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-4 gap-2 pt-2",
								children: photos.map((src, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "overflow-hidden rounded-lg border border-border",
									onClick: () => setPhotos((p) => p.filter((_, idx) => idx !== i)),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src,
										alt: "",
										className: "h-20 w-full object-cover"
									})
								}, i))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "h-11 w-full sm:w-auto",
						disabled: busy,
						children: busy ? t("submitting") : t("submitRequest")
					})
				]
			}) })]
		})]
	});
}
//#endregion
export { NewRequestPage as component };
