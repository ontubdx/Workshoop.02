import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { x as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as signIn, t as authClient } from "./client-1vAx-gM_.mjs";
import { t as GROK_PROVIDERS } from "./server-TYYuhGC5.mjs";
import { t as cn } from "./utils-BK93iFu4.mjs";
import { n as Wrench } from "../_libs/lucide-react.mjs";
import { i as useI18n, r as LanguageToggle } from "./router-DoBdnNsS.mjs";
import { n as useCurrentUserState } from "./use-current-user-BYyFvsCd.mjs";
import { t as Button } from "./button-C6_0vgHL.mjs";
import { t as Input } from "./input-CAtov6Vz.mjs";
import { t as Label } from "./label-gLwDjbOl.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DZvmJaIF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Tabs = Root2;
function TabsList({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
		className: cn("inline-flex h-10 items-center gap-1 rounded-lg bg-muted p-1", className),
		...props
	});
}
function TabsTrigger({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
		className: cn("inline-flex h-8 items-center justify-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm", className),
		...props
	});
}
function TabsContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
		className: cn("mt-4", className),
		...props
	});
}
function Login() {
	const { user, isPending } = useCurrentUserState();
	const { t } = useI18n();
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-sidebar px-6 text-sidebar-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-semibold",
				children: t("appName")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-sidebar-muted",
				children: t("checkingSession")
			})]
		})
	});
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	async function onEmail(e) {
		e.preventDefault();
		setError(null);
		setBusy(true);
		try {
			if (mode === "signup") {
				const res = await authClient.signUp.email({
					email,
					password,
					name: name.trim() || email.split("@")[0],
					callbackURL: "/"
				});
				if (res.error) throw new Error(res.error.message || "Could not create account");
			} else {
				const res = await authClient.signIn.email({
					email,
					password,
					callbackURL: "/"
				});
				if (res.error) throw new Error(res.error.message || "Could not sign in");
			}
			window.location.href = "/";
		} catch (err) {
			setError(err instanceof Error ? err.message : "Sign-in failed");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "grid min-h-dvh bg-background lg:grid-cols-[1.1fr_0.9fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative hidden overflow-hidden bg-sidebar text-sidebar-foreground lg:flex lg:flex-col lg:justify-between lg:p-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg font-semibold",
							children: t("appName")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-wide text-sidebar-muted uppercase",
							children: t("dept")
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageToggle, { tone: "dark" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-md space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-5xl leading-[0.95] font-semibold tracking-tight",
						children: t("loginHero")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-sidebar-muted",
						children: t("loginBody")
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-sidebar-muted",
					children: t("loginFoot")
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "flex items-center justify-center px-4 py-10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-8 flex items-start justify-between gap-3 lg:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-4 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "size-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-lg font-semibold",
									children: t("appName")
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-3xl font-semibold",
								children: t("signIn")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: t("loginLeadMobile")
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageToggle, {})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6 hidden items-start justify-between gap-3 lg:flex",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-3xl font-semibold",
							children: t("welcomeIn")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: t("loginLead")
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageToggle, {})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2",
							children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "outline",
								className: "h-11 w-full",
								onClick: () => signIn(p.providerId, { callbackURL: "/" }),
								children: [
									t("continueWith"),
									" ",
									p.label
								]
							}, p.providerId))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "my-6 flex items-center gap-3 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" }),
								t("orEmail"),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
							value: mode,
							onValueChange: setMode,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
								className: "w-full",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "signin",
									className: "flex-1",
									children: t("signIn")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "signup",
									className: "flex-1",
									children: t("createAccount")
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: mode,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									className: "space-y-3",
									onSubmit: onEmail,
									children: [
										mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "name",
												children: t("fullName")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "name",
												value: name,
												onChange: (e) => setName(e.target.value),
												autoComplete: "name"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "email",
												children: t("email")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "email",
												type: "email",
												required: true,
												value: email,
												onChange: (e) => setEmail(e.target.value),
												autoComplete: "email"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "password",
												children: t("password")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "password",
												type: "password",
												required: true,
												minLength: 8,
												value: password,
												onChange: (e) => setPassword(e.target.value),
												autoComplete: mode === "signup" ? "new-password" : "current-password"
											})]
										}),
										error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-destructive",
											children: error
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "submit",
											className: "h-11 w-full",
											disabled: busy,
											children: busy ? t("pleaseWait") : mode === "signup" ? t("createAccount") : t("signIn")
										})
									]
								})
							})]
						})
					] })
				]
			})
		})]
	});
}
//#endregion
export { Login as component };
