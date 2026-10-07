import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { C as useRouter, _ as lazyRouteComponent, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, v as createFileRoute, y as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn, s as __exportAll } from "./ssr.mjs";
import { L as string, N as number, P as object, R as union, j as literal } from "../_libs/@better-auth/core+[...].mjs";
import { n as auth } from "./server-TYYuhGC5.mjs";
import { t as cn } from "./utils-BK93iFu4.mjs";
import { o as TriangleAlert } from "../_libs/lucide-react.mjs";
import { n as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Provider } from "../_libs/radix-ui__react-tooltip.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DoBdnNsS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var TooltipProvider = Provider;
/**
* App-wide client provider mounted once near the top of the document shell.
* Better Auth's React client needs no context — this hosts Query, tooltips, toasts.
*/
function AuthProvider({ children }) {
	const [queryClient] = (0, import_react.useState)(() => new QueryClient({ defaultOptions: { queries: {
		staleTime: 2e4,
		refetchOnWindowFocus: false,
		retry: 1
	} } }));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TooltipProvider, {
			delayDuration: 200,
			children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				position: "top-center",
				richColors: true,
				closeButton: true,
				toastOptions: { className: "font-sans" }
			})]
		})
	});
}
var en = {
	appName: "Fleet Workshop",
	dept: "Automobile & Transport",
	loadingBay: "Loading the workshop…",
	checkingSession: "Checking your session…",
	signIn: "Sign in",
	createAccount: "Create account",
	welcomeIn: "Welcome in",
	loginLead: "Use your work account. The first person to sign in becomes Admin.",
	loginLeadMobile: "Every vehicle that enters the bay, accounted for.",
	loginHero: "Every vehicle that enters the bay, accounted for.",
	loginBody: "Problem reports, job cards, parts from store or outside, labour, and a signed delivery — with a role for each person in the chain.",
	loginFoot: "Internal use · Poultry & Hatchery fleet",
	fullName: "Full name",
	email: "Email",
	password: "Password",
	pleaseWait: "Please wait…",
	continueWith: "Continue with",
	orEmail: "or email",
	signInDisabled: "Sign-in is disabled.",
	navDashboard: "Dashboard",
	navNew: "New request",
	navRequests: "Requests",
	navAllRequests: "All requests",
	navMyRequests: "My requests",
	navMyJobs: "My jobs",
	navVehicles: "Vehicles",
	navInventory: "Inventory",
	navUsers: "Users & roles",
	navReports: "Reports",
	navAudit: "Audit log",
	notifications: "Notifications",
	allCaughtUp: "All caught up.",
	openMenu: "Open menu",
	profileErrorTitle: "Could not load your profile",
	profileErrorBody: "Try reloading the page.",
	deactivatedTitle: "Account deactivated",
	deactivatedBody: "Ask an administrator to restore access.",
	roleAdmin: "Admin",
	roleManager: "Workshop Manager",
	roleMechanic: "Mechanic",
	roleVehicleUser: "Vehicle User",
	roleViewer: "Web Viewer",
	statusPending: "Pending",
	statusAccepted: "Accepted",
	statusRejected: "Rejected",
	statusInWorkshop: "In workshop",
	statusWorkComplete: "Work complete",
	statusDelivered: "Delivered",
	statusInBay: "In bay",
	mechNotStarted: "Not started",
	mechInProgress: "In progress",
	mechDone: "Done",
	urgent: "Urgent",
	normal: "Normal",
	overview: "Overview",
	signedInAs: "Signed in as",
	headingFloor: "Workshop floor",
	headingMechanic: "Your assigned jobs",
	headingUser: "Your vehicles",
	kpiOpen: "Open jobs",
	kpiInBay: "In workshop",
	kpiMonth: "Cost this month",
	kpiTurnaround: "Avg. turnaround",
	kpiUrgentPending: "{urgent} urgent · {pending} pending",
	kpiInBayHint: "vehicles in the bay",
	kpiPartsLabour: "parts + labour",
	kpiEntryToDelivery: "entry to delivery",
	dueService: "due for service",
	lowStockAlert: "at or below reorder",
	costTrend: "Repair cost · last 6 months",
	topVehicles: "Highest cost vehicles",
	noBilled: "No billed jobs yet.",
	recentJobs: "Recent jobs",
	viewAll: "View all",
	noJobsYet: "No jobs yet.",
	newRequest: "New workshop request",
	newRequestLead: "Describe the fault clearly. Photos help the manager accept faster.",
	jobIntake: "Job intake",
	vehicle: "Vehicle",
	selectRegistration: "Select registration",
	priority: "Priority",
	urgentOffRoad: "Urgent — vehicle off the road",
	problem: "Problem description",
	problemHint: "When it happens, sounds, warning lights, last service…",
	photos: "Photos (optional, up to 4)",
	submitting: "Submitting…",
	submitRequest: "Submit request",
	selectVehicle: "Select a vehicle",
	describeProblem: "Describe the problem",
	requestSubmitted: "Request submitted",
	couldNotSubmit: "Could not submit",
	shown: "shown",
	searchJobs: "Search registration, problem, person",
	allStatuses: "All statuses",
	from: "From",
	to: "To",
	noMatch: "No jobs match these filters.",
	couldNotLoadJobs: "Could not load jobs",
	backRequests: "← Requests",
	printJobCard: "Print job card",
	jobCard: "Job card",
	problemTitle: "Problem",
	rejectedPrefix: "Rejected:",
	requestedBy: "Requested by",
	submitted: "Submitted",
	entry: "Entry",
	tentativeDelivery: "Tentative delivery",
	acceptJob: "Accept job",
	reject: "Reject",
	assignMechanic: "Assign mechanic",
	selectMechanic: "Select mechanic",
	assign: "Assign",
	mechanicAssigned: "Mechanic assigned",
	mechanicProgress: "Mechanic progress",
	requestPartsPlaceholder: "Request parts from the manager",
	requestParts: "Request parts",
	partsRequestSent: "Parts request sent",
	workDone: "Work done",
	noWorkItems: "No work items logged yet.",
	remove: "Remove",
	removed: "Removed",
	describeWork: "Describe work performed",
	add: "Add",
	workItemAdded: "Work item added",
	parts: "Parts",
	noParts: "No parts logged.",
	store: "Store",
	external: "External",
	partRemoved: "Part removed",
	source: "Source",
	workshopStore: "Workshop store",
	purchasedOutside: "Purchased outside",
	storePart: "Store part",
	selectPart: "Select part",
	partName: "Part name",
	vendor: "Vendor",
	unitPrice: "Unit price (৳)",
	qty: "Qty",
	addPart: "Add part",
	partAdded: "Part added",
	costSummary: "Cost summary",
	storeParts: "Store parts",
	outsidePurchase: "Outside purchase",
	labour: "Labour",
	total: "Total",
	labourSaved: "Labour saved",
	save: "Save",
	markComplete: "Mark work complete",
	markedComplete: "Marked work complete",
	confirmPickup: "Confirm pickup",
	optionalFeedback: "Optional feedback",
	confirmDelivery: "Confirm delivery",
	vehicleCollected: "Vehicle collected",
	delivery: "Delivery",
	collected: "Collected",
	rating: "Rating",
	auditTrail: "Audit trail",
	noEvents: "No events yet.",
	mechanic: "Mechanic",
	receivedBy: "Received by",
	acceptDates: "Set bay dates. Assign a mechanic now or later.",
	entryDate: "Entry date",
	assignLater: "Assign later",
	accepted: "Job accepted",
	rejectJob: "Reject job",
	rejectReasonLead: "The requester will see this reason.",
	rejectRequest: "Reject request",
	jobRejected: "Job rejected",
	statusUpdated: "Status updated",
	jobNotFound: "Job not found",
	fleet: "Fleet",
	vehiclesOnBooks: "vehicles on the books",
	csvTemplate: "CSV template",
	importCsv: "Import CSV",
	addVehicle: "Add vehicle",
	searchFleet: "Search registration, driver, department",
	loadingFleet: "Loading fleet…",
	registration: "Registration",
	department: "Department",
	driver: "Assigned driver",
	km: "Km",
	history: "History",
	edit: "Edit",
	due: "Due",
	csvHint: "CSV columns: registrationNo, type, brand, model, department, assignedDriver, odometerKm",
	editVehicle: "Edit vehicle",
	addVehicleTitle: "Add vehicle",
	type: "Type",
	brand: "Brand",
	model: "Model",
	odometer: "Odometer (km)",
	serviceInterval: "Service interval (km)",
	vehicleUpdated: "Vehicle updated",
	vehicleAdded: "Vehicle added",
	saveFailed: "Save failed",
	csvNeedRows: "CSV needs a header row and at least one vehicle",
	imported: "vehicles imported",
	importFailed: "Import failed",
	serviceHistory: "service history",
	noHistory: "No workshop jobs for this vehicle.",
	partsStore: "Parts store",
	skus: "SKUs",
	atReorder: "at or below reorder",
	addPartTitle: "Add part",
	editPart: "Edit part",
	name: "Name",
	stock: "Stock",
	reorderLevel: "Reorder level",
	unit: "Unit",
	loadingInventory: "Loading inventory…",
	inventorySaved: "Inventory saved",
	low: "Low",
	usersTitle: "Users & roles",
	usersLead: "People sign in with Google, X, or email. The first account becomes Admin. Everyone else starts as Vehicle User until you assign a role here.",
	onlyAdminsUsers: "Only admins can manage users.",
	status: "Status",
	active: "Active",
	inactive: "Inactive",
	roleUpdated: "Role updated",
	userActivated: "User activated",
	userDeactivated: "User deactivated",
	updateFailed: "Update failed",
	joined: "Joined",
	loadingUsers: "Loading users…",
	reports: "Reports",
	reportsLead: "Cost and activity across the fleet workshop.",
	exportCsv: "Export CSV",
	printPdf: "Print / PDF",
	jobs: "Jobs",
	completed: "Completed",
	totalCost: "Total cost",
	costByDept: "Cost by department",
	noCostData: "No cost data yet.",
	loading: "Loading…",
	unassigned: "Unassigned",
	auditTitle: "Audit log",
	auditLead: "Every status change and cost edit, timestamped.",
	searchAudit: "Search action, user, target",
	onlyAdminsAudit: "Only admins can view the audit log.",
	noMatchingEvents: "No matching events.",
	couldNotLoadAudit: "Could not load audit log",
	couldNotLoadDash: "Could not load dashboard",
	rejectedBanner: "Rejected — this job will not enter the workshop.",
	langBn: "বাং",
	langEn: "EN",
	noPermission: "You do not have permission to view this page."
};
var dictionaries = {
	en,
	bn: {
		appName: "ফ্লিট ওয়ার্কশপ",
		dept: "অটোমোবাইল ও ট্রান্সপোর্ট",
		loadingBay: "ওয়ার্কশপ লোড হচ্ছে…",
		checkingSession: "সেশন যাচাই হচ্ছে…",
		signIn: "সাইন ইন",
		createAccount: "অ্যাকাউন্ট তৈরি",
		welcomeIn: "স্বাগতম",
		loginLead: "কাজের অ্যাকাউন্ট ব্যবহার করুন। প্রথম সাইন-ইন করা ব্যক্তি অ্যাডমিন হবেন।",
		loginLeadMobile: "যে গাড়িই বেতে ঢুকুক, হিসাব থাকবে।",
		loginHero: "যে গাড়িই বেতে ঢুকুক, হিসাব থাকবে।",
		loginBody: "সমস্যার রিপোর্ট, জব কার্ড, স্টোর বা বাইরের যন্ত্রাংশ, শ্রমখরচ এবং স্বাক্ষরিত ডেলিভারি — চেইনের প্রতিটি মানুষের জন্য আলাদা রোল।",
		loginFoot: "অভ্যন্তরীণ ব্যবহার · পোল্ট্রি ও হ্যাচারি ফ্লিট",
		fullName: "পুরো নাম",
		email: "ইমেইল",
		password: "পাসওয়ার্ড",
		pleaseWait: "অপেক্ষা করুন…",
		continueWith: "চালিয়ে যান",
		orEmail: "অথবা ইমেইল",
		signInDisabled: "সাইন-ইন বন্ধ আছে।",
		navDashboard: "ড্যাশবোর্ড",
		navNew: "নতুন অনুরোধ",
		navRequests: "অনুরোধ",
		navAllRequests: "সব অনুরোধ",
		navMyRequests: "আমার অনুরোধ",
		navMyJobs: "আমার কাজ",
		navVehicles: "যানবাহন",
		navInventory: "স্টোর",
		navUsers: "ব্যবহারকারী",
		navReports: "রিপোর্ট",
		navAudit: "অডিট লগ",
		notifications: "নোটিফিকেশন",
		allCaughtUp: "নতুন কিছু নেই।",
		openMenu: "মেনু খুলুন",
		profileErrorTitle: "প্রোফাইল লোড হয়নি",
		profileErrorBody: "পেজ রিলোড করে আবার চেষ্টা করুন।",
		deactivatedTitle: "অ্যাকাউন্ট নিষ্ক্রিয়",
		deactivatedBody: "অ্যাডমিনকে অ্যাক্সেস ফিরিয়ে দিতে বলুন।",
		roleAdmin: "অ্যাডমিন",
		roleManager: "ওয়ার্কশপ ম্যানেজার",
		roleMechanic: "মেকানিক",
		roleVehicleUser: "যান ব্যবহারকারী",
		roleViewer: "ভিউয়ার",
		statusPending: "অপেক্ষমাণ",
		statusAccepted: "গৃহীত",
		statusRejected: "প্রত্যাখ্যাত",
		statusInWorkshop: "ওয়ার্কশপে",
		statusWorkComplete: "কাজ সম্পন্ন",
		statusDelivered: "ডেলিভারি হয়েছে",
		statusInBay: "বেতে আছে",
		mechNotStarted: "শুরু হয়নি",
		mechInProgress: "চলছে",
		mechDone: "শেষ",
		urgent: "জরুরি",
		normal: "সাধারণ",
		overview: "সারসংক্ষেপ",
		signedInAs: "সাইন ইন",
		headingFloor: "ওয়ার্কশপ ফ্লোর",
		headingMechanic: "আপনার অ্যাসাইন করা কাজ",
		headingUser: "আপনার যানবাহন",
		kpiOpen: "খোলা কাজ",
		kpiInBay: "ওয়ার্কশপে",
		kpiMonth: "এই মাসের খরচ",
		kpiTurnaround: "গড় সময়",
		kpiUrgentPending: "{urgent} জরুরি · {pending} অপেক্ষমাণ",
		kpiInBayHint: "বেতে থাকা যান",
		kpiPartsLabour: "যন্ত্রাংশ + শ্রম",
		kpiEntryToDelivery: "প্রবেশ থেকে ডেলিভারি",
		dueService: "সার্ভিসের সময় হয়েছে",
		lowStockAlert: "রিঅর্ডার স্তরের নিচে",
		costTrend: "মেরামত খরচ · গত ৬ মাস",
		topVehicles: "সর্বোচ্চ খরচের যান",
		noBilled: "এখনো বিল করা কাজ নেই।",
		recentJobs: "সাম্প্রতিক কাজ",
		viewAll: "সব দেখুন",
		noJobsYet: "এখনো কোনো কাজ নেই।",
		newRequest: "নতুন ওয়ার্কশপ অনুরোধ",
		newRequestLead: "সমস্যা স্পষ্ট করে লিখুন। ছবি থাকলে ম্যানেজার দ্রুত গ্রহণ করতে পারেন।",
		jobIntake: "জব ইনটেক",
		vehicle: "যানবাহন",
		selectRegistration: "রেজিস্ট্রেশন বাছুন",
		priority: "অগ্রাধিকার",
		urgentOffRoad: "জরুরি — যান চলছে না",
		problem: "সমস্যার বিবরণ",
		problemHint: "কখন হয়, শব্দ, ওয়ার্নিং লাইট, শেষ সার্ভিস…",
		photos: "ছবি (ঐচ্ছিক, সর্বোচ্চ ৪টি)",
		submitting: "জমা হচ্ছে…",
		submitRequest: "অনুরোধ জমা দিন",
		selectVehicle: "একটি যান বাছুন",
		describeProblem: "সমস্যাটি লিখুন",
		requestSubmitted: "অনুরোধ জমা হয়েছে",
		couldNotSubmit: "জমা হয়নি",
		shown: "দেখানো হচ্ছে",
		searchJobs: "রেজিস্ট্রেশন, সমস্যা, ব্যক্তি খুঁজুন",
		allStatuses: "সব স্ট্যাটাস",
		from: "থেকে",
		to: "পর্যন্ত",
		noMatch: "এই ফিল্টারে কোনো কাজ নেই।",
		couldNotLoadJobs: "কাজ লোড হয়নি",
		backRequests: "← অনুরোধ",
		printJobCard: "জব কার্ড প্রিন্ট",
		jobCard: "জব কার্ড",
		problemTitle: "সমস্যা",
		rejectedPrefix: "প্রত্যাখ্যান:",
		requestedBy: "অনুরোধকারী",
		submitted: "জমা",
		entry: "প্রবেশ",
		tentativeDelivery: "সম্ভাব্য ডেলিভারি",
		acceptJob: "কাজ গ্রহণ",
		reject: "প্রত্যাখ্যান",
		assignMechanic: "মেকানিক অ্যাসাইন",
		selectMechanic: "মেকানিক বাছুন",
		assign: "অ্যাসাইন",
		mechanicAssigned: "মেকানিক অ্যাসাইন হয়েছে",
		mechanicProgress: "মেকানিকের অগ্রগতি",
		requestPartsPlaceholder: "ম্যানেজারের কাছে যন্ত্রাংশ চান",
		requestParts: "যন্ত্রাংশ চান",
		partsRequestSent: "যন্ত্রাংশের অনুরোধ পাঠানো হয়েছে",
		workDone: "করা কাজ",
		noWorkItems: "এখনো কোনো কাজ লগ হয়নি।",
		remove: "মুছুন",
		removed: "মুছেছে",
		describeWork: "করা কাজের বিবরণ",
		add: "যোগ",
		workItemAdded: "কাজ যোগ হয়েছে",
		parts: "যন্ত্রাংশ",
		noParts: "কোনো যন্ত্রাংশ লগ হয়নি।",
		store: "স্টোর",
		external: "বাইরে",
		partRemoved: "যন্ত্রাংশ সরানো হয়েছে",
		source: "উৎস",
		workshopStore: "ওয়ার্কশপ স্টোর",
		purchasedOutside: "বাইরে কেনা",
		storePart: "স্টোরের যন্ত্রাংশ",
		selectPart: "যন্ত্রাংশ বাছুন",
		partName: "যন্ত্রাংশের নাম",
		vendor: "ভেন্ডর",
		unitPrice: "একক মূল্য (৳)",
		qty: "পরিমাণ",
		addPart: "যন্ত্রাংশ যোগ",
		partAdded: "যন্ত্রাংশ যোগ হয়েছে",
		costSummary: "খরচের সারসংক্ষেপ",
		storeParts: "স্টোরের যন্ত্রাংশ",
		outsidePurchase: "বাইরের কেনাকাটা",
		labour: "শ্রমখরচ",
		total: "মোট",
		labourSaved: "শ্রমখরচ সংরক্ষিত",
		save: "সংরক্ষণ",
		markComplete: "কাজ সম্পন্ন চিহ্নিত করুন",
		markedComplete: "কাজ সম্পন্ন হয়েছে",
		confirmPickup: "পিকআপ নিশ্চিত করুন",
		optionalFeedback: "ঐচ্ছিক মতামত",
		confirmDelivery: "ডেলিভারি নিশ্চিত",
		vehicleCollected: "যান সংগ্রহ হয়েছে",
		delivery: "ডেলিভারি",
		collected: "সংগ্রহ",
		rating: "রেটিং",
		auditTrail: "অডিট ট্রেইল",
		noEvents: "এখনো কোনো ইভেন্ট নেই।",
		mechanic: "মেকানিক",
		receivedBy: "গ্রহণকারী",
		acceptDates: "বে তারিখ দিন। মেকানিক এখন বা পরে অ্যাসাইন করতে পারেন।",
		entryDate: "প্রবেশের তারিখ",
		assignLater: "পরে অ্যাসাইন",
		accepted: "কাজ গৃহীত",
		rejectJob: "কাজ প্রত্যাখ্যান",
		rejectReasonLead: "অনুরোধকারী এই কারণ দেখতে পাবেন।",
		rejectRequest: "অনুরোধ প্রত্যাখ্যান",
		jobRejected: "কাজ প্রত্যাখ্যাত",
		statusUpdated: "স্ট্যাটাস আপডেট হয়েছে",
		jobNotFound: "কাজ পাওয়া যায়নি",
		fleet: "ফ্লিট",
		vehiclesOnBooks: "যান রেকর্ডে আছে",
		csvTemplate: "CSV টেমপ্লেট",
		importCsv: "CSV ইমপোর্ট",
		addVehicle: "যান যোগ",
		searchFleet: "রেজিস্ট্রেশন, ড্রাইভার, ডিপার্টমেন্ট খুঁজুন",
		loadingFleet: "ফ্লিট লোড হচ্ছে…",
		registration: "রেজিস্ট্রেশন",
		department: "ডিপার্টমেন্ট",
		driver: "অ্যাসাইনড ড্রাইভার",
		km: "কিমি",
		history: "ইতিহাস",
		edit: "সম্পাদনা",
		due: "সময় হয়েছে",
		csvHint: "CSV কলাম: registrationNo, type, brand, model, department, assignedDriver, odometerKm",
		editVehicle: "যান সম্পাদনা",
		addVehicleTitle: "যান যোগ",
		type: "ধরন",
		brand: "ব্র্যান্ড",
		model: "মডেল",
		odometer: "ওডোমিটার (কিমি)",
		serviceInterval: "সার্ভিস ইন্টারভাল (কিমি)",
		vehicleUpdated: "যান আপডেট হয়েছে",
		vehicleAdded: "যান যোগ হয়েছে",
		saveFailed: "সংরক্ষণ হয়নি",
		csvNeedRows: "CSV-তে হেডার ও অন্তত একটি যান লাগবে",
		imported: "যান ইমপোর্ট হয়েছে",
		importFailed: "ইমপোর্ট হয়নি",
		serviceHistory: "সার্ভিস ইতিহাস",
		noHistory: "এই যানের কোনো ওয়ার্কশপ কাজ নেই।",
		partsStore: "যন্ত্রাংশ স্টোর",
		skus: "আইটেম",
		atReorder: "রিঅর্ডার স্তরে বা নিচে",
		addPartTitle: "যন্ত্রাংশ যোগ",
		editPart: "যন্ত্রাংশ সম্পাদনা",
		name: "নাম",
		stock: "স্টক",
		reorderLevel: "রিঅর্ডার স্তর",
		unit: "একক",
		loadingInventory: "স্টোর লোড হচ্ছে…",
		inventorySaved: "স্টোর সংরক্ষিত",
		low: "কম",
		usersTitle: "ব্যবহারকারী ও রোল",
		usersLead: "মানুষ গুগল, এক্স বা ইমেইলে সাইন ইন করেন। প্রথম অ্যাকাউন্ট অ্যাডমিন হয়। বাকিরা যান ব্যবহারকারী হিসেবে শুরু করেন — এখানে রোল দিন।",
		onlyAdminsUsers: "শুধু অ্যাডমিন ব্যবহারকারী পরিচালনা করতে পারেন।",
		status: "স্ট্যাটাস",
		active: "সক্রিয়",
		inactive: "নিষ্ক্রিয়",
		roleUpdated: "রোল আপডেট হয়েছে",
		userActivated: "ব্যবহারকারী সক্রিয়",
		userDeactivated: "ব্যবহারকারী নিষ্ক্রিয়",
		updateFailed: "আপডেট হয়নি",
		joined: "যোগদান",
		loadingUsers: "ব্যবহারকারী লোড হচ্ছে…",
		reports: "রিপোর্ট",
		reportsLead: "ফ্লিট ওয়ার্কশপের খরচ ও কার্যক্রম।",
		exportCsv: "CSV এক্সপোর্ট",
		printPdf: "প্রিন্ট / PDF",
		jobs: "কাজ",
		completed: "সম্পন্ন",
		totalCost: "মোট খরচ",
		costByDept: "ডিপার্টমেন্ট অনুযায়ী খরচ",
		noCostData: "এখনো খরচের তথ্য নেই।",
		loading: "লোড হচ্ছে…",
		unassigned: "অ্যাসাইন হয়নি",
		auditTitle: "অডিট লগ",
		auditLead: "প্রতিটি স্ট্যাটাস পরিবর্তন ও খরচের সম্পাদনা, সময়সহ।",
		searchAudit: "অ্যাকশন, ব্যবহারকারী, টার্গেট খুঁজুন",
		onlyAdminsAudit: "শুধু অ্যাডমিন অডিট লগ দেখতে পারেন।",
		noMatchingEvents: "মিলছে এমন ইভেন্ট নেই।",
		couldNotLoadAudit: "অডিট লগ লোড হয়নি",
		couldNotLoadDash: "ড্যাশবোর্ড লোড হয়নি",
		rejectedBanner: "প্রত্যাখ্যাত — এই কাজ ওয়ার্কশপে ঢুকবে না।",
		langBn: "বাং",
		langEn: "EN",
		noPermission: "এই পেজ দেখার অনুমতি নেই।"
	}
};
var STATUS_KEYS = {
	pending: "statusPending",
	accepted: "statusAccepted",
	rejected: "statusRejected",
	in_workshop: "statusInWorkshop",
	work_complete: "statusWorkComplete",
	delivered: "statusDelivered"
};
var ROLE_KEYS = {
	admin: "roleAdmin",
	manager: "roleManager",
	mechanic: "roleMechanic",
	vehicle_user: "roleVehicleUser",
	viewer: "roleViewer"
};
var MECH_KEYS = {
	not_started: "mechNotStarted",
	in_progress: "mechInProgress",
	done: "mechDone"
};
var I18nContext = (0, import_react.createContext)(null);
function applyLang(lang) {
	if (typeof document === "undefined") return;
	document.documentElement.lang = lang === "bn" ? "bn" : "en";
	document.documentElement.dataset.lang = lang;
}
function LanguageProvider({ children }) {
	const [lang, setLangState] = (0, import_react.useState)("bn");
	(0, import_react.useEffect)(() => {
		const saved = window.localStorage.getItem("wms-lang");
		const next = saved === "en" || saved === "bn" ? saved : "bn";
		setLangState(next);
		applyLang(next);
	}, []);
	const setLang = (0, import_react.useCallback)((next) => {
		setLangState(next);
		window.localStorage.setItem("wms-lang", next);
		applyLang(next);
	}, []);
	const value = (0, import_react.useMemo)(() => {
		const dict = dictionaries[lang];
		const t = (key, vars) => {
			let out = dict[key] ?? en[key] ?? key;
			if (vars) for (const [k, v] of Object.entries(vars)) out = out.replaceAll(`{${k}}`, String(v));
			return out;
		};
		return {
			lang,
			setLang,
			t,
			status: (s) => t(STATUS_KEYS[s]),
			role: (r) => t(ROLE_KEYS[r]),
			mechanicStatus: (s) => t(MECH_KEYS[s]),
			locale: lang === "bn" ? "bn-BD" : "en-GB"
		};
	}, [lang, setLang]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I18nContext.Provider, {
		value,
		children
	});
}
function useI18n() {
	const ctx = (0, import_react.useContext)(I18nContext);
	if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
	return ctx;
}
function LanguageToggle({ tone = "light" }) {
	const { lang, setLang, t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("inline-flex overflow-hidden rounded-md border text-xs font-medium", tone === "dark" ? "border-sidebar-border bg-sidebar-accent text-sidebar-muted" : "border-border bg-card text-muted-foreground"),
		role: "group",
		"aria-label": "Language",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: cn("h-9 min-w-11 px-2.5", lang === "bn" && (tone === "dark" ? "bg-primary text-primary-foreground" : "bg-primary text-primary-foreground")),
			onClick: () => setLang("bn"),
			children: t("langBn")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: cn("h-9 min-w-11 px-2.5", lang === "en" && (tone === "dark" ? "bg-primary text-primary-foreground" : "bg-primary text-primary-foreground")),
			onClick: () => setLang("en"),
			children: t("langEn")
		})]
	});
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var styles_default = "/assets/styles-BJamRrPO.css";
var APP_NAME = "Workshop Management System";
var fetchSessionUser = createServerFn({ method: "GET" }).handler(createSsrRpc("2c4985e96c199268f7f639534cb5e8e31d6b19d43286bf77416413db60ffde26"));
var Route$13 = createRootRoute({
	beforeLoad: async () => ({ sessionUser: await fetchSessionUser() }),
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#1c1915"
			},
			{
				name: "description",
				content: "Internal workshop jobs, parts, and repair costs for the Automobile & Transport Department."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Barlow:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "bn",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$11 = () => import("../_app-BIHDY-6d.mjs");
var Route$12 = createFileRoute("/_app")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./login-DZvmJaIF.mjs");
var Route$11 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("../_app-CrBYQHE9.mjs");
var Route$10 = createFileRoute("/_app/")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./audit-CbGQ1Cwa.mjs");
var Route$9 = createFileRoute("/_app/audit")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./inventory-BcGlMJvR.mjs");
var Route$8 = createFileRoute("/_app/inventory")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./reports-DFRMyKWU.mjs");
var Route$7 = createFileRoute("/_app/reports")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./requests-DoPZGIkh.mjs");
var Route$6 = createFileRoute("/_app/requests")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./users-B0gWcWLq.mjs");
var Route$5 = createFileRoute("/_app/users")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./vehicles-eSc9RT5G.mjs");
var Route$4 = createFileRoute("/_app/vehicles")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./requests.index-CPt4h8rT.mjs");
var Route$3 = createFileRoute("/_app/requests/")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./requests._requestId-BT9ha8Kn.mjs");
var Route$2 = createFileRoute("/_app/requests/$requestId")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./requests.new-DlPSPjlZ.mjs");
var Route$1 = createFileRoute("/_app/requests/new")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var Route = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var AppRoute = Route$12.update({
	id: "/_app",
	getParentRoute: () => Route$13
});
var LoginRoute = Route$11.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$13
});
var AppIndexRoute = Route$10.update({
	id: "/",
	path: "/",
	getParentRoute: () => AppRoute
});
var AppAuditRoute = Route$9.update({
	id: "/audit",
	path: "/audit",
	getParentRoute: () => AppRoute
});
var AppInventoryRoute = Route$8.update({
	id: "/inventory",
	path: "/inventory",
	getParentRoute: () => AppRoute
});
var AppReportsRoute = Route$7.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => AppRoute
});
var AppRequestsRoute = Route$6.update({
	id: "/requests",
	path: "/requests",
	getParentRoute: () => AppRoute
});
var AppUsersRoute = Route$5.update({
	id: "/users",
	path: "/users",
	getParentRoute: () => AppRoute
});
var AppVehiclesRoute = Route$4.update({
	id: "/vehicles",
	path: "/vehicles",
	getParentRoute: () => AppRoute
});
var AppRequestsIndexRoute = Route$3.update({
	id: "/",
	path: "/",
	getParentRoute: () => AppRequestsRoute
});
var AppRequestsRequestIdRoute = Route$2.update({
	id: "/$requestId",
	path: "/$requestId",
	getParentRoute: () => AppRequestsRoute
});
var AppRequestsNewRoute = Route$1.update({
	id: "/new",
	path: "/new",
	getParentRoute: () => AppRequestsRoute
});
var ApiAuthSplatRoute = Route.update({
	id: "/api/auth/$",
	path: "/api/auth/$",
	getParentRoute: () => Route$13
});
var AppRequestsRouteChildren = {
	AppRequestsRequestIdRoute,
	AppRequestsNewRoute,
	AppRequestsIndexRoute
};
var AppRouteChildren = {
	AppAuditRoute,
	AppInventoryRoute,
	AppReportsRoute,
	AppRequestsRoute: AppRequestsRoute._addFileChildren(AppRequestsRouteChildren),
	AppUsersRoute,
	AppVehiclesRoute,
	AppIndexRoute
};
var rootRouteChildren = {
	AppRoute: AppRoute._addFileChildren(AppRouteChildren),
	LoginRoute,
	ApiAuthSplatRoute
};
var routeTree = Route$13._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { createSsrRpc as a, useI18n as i, Route$2 as n, LanguageToggle as r, router_exports as t };
