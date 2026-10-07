import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cn } from "./utils-BK93iFu4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/card-BJS0x5ZB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Card = (0, import_react.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("rounded-xl border border-border bg-card text-card-foreground shadow-card", className),
	...props
}));
Card.displayName = "Card";
var CardHeader = (0, import_react.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex flex-col gap-1 p-5", className),
	...props
}));
CardHeader.displayName = "CardHeader";
var CardTitle = (0, import_react.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
	ref,
	className: cn("font-display text-lg font-semibold leading-tight", className),
	...props
}));
CardTitle.displayName = "CardTitle";
var CardDescription = (0, import_react.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
CardDescription.displayName = "CardDescription";
var CardContent = (0, import_react.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("p-5 pt-0", className),
	...props
}));
CardContent.displayName = "CardContent";
//#endregion
export { CardTitle as i, CardContent as n, CardHeader as r, Card as t };
