import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cn } from "./utils-BK93iFu4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/label-gLwDjbOl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Label = (0, import_react.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
	ref,
	className: cn("text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50", className),
	...props
}));
Label.displayName = "Label";
//#endregion
export { Label as t };
