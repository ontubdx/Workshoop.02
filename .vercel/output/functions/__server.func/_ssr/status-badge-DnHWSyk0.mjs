import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as useI18n } from "./router-DoBdnNsS.mjs";
import { t as Badge } from "./badge-CruQ1s1c.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-badge-DnHWSyk0.js
var import_jsx_runtime = require_jsx_runtime();
var STATUS_VARIANT = {
	pending: "warning",
	accepted: "info",
	rejected: "destructive",
	in_workshop: "default",
	work_complete: "success",
	delivered: "muted"
};
function StatusBadge({ status }) {
	const { status: label } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: STATUS_VARIANT[status],
		children: label(status)
	});
}
function PriorityBadge({ priority }) {
	const { t } = useI18n();
	if (priority === "urgent") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "destructive",
		children: t("urgent")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "muted",
		children: t("normal")
	});
}
//#endregion
export { StatusBadge as n, PriorityBadge as t };
