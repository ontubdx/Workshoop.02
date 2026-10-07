//#region node_modules/.nitro/vite/services/ssr/assets/types-DcxPO1Wc.js
var ROLES = [
	"admin",
	"manager",
	"mechanic",
	"vehicle_user",
	"viewer"
];
var STATUSES = [
	"pending",
	"accepted",
	"rejected",
	"in_workshop",
	"work_complete",
	"delivered"
];
var MECHANIC_STATUSES = [
	"not_started",
	"in_progress",
	"done"
];
function canManageJobs(role) {
	return role === "admin" || role === "manager";
}
function canSeeAllRequests(role) {
	return role === "admin" || role === "manager" || role === "viewer";
}
function canAdmin(role) {
	return role === "admin";
}
//#endregion
export { canManageJobs as a, canAdmin as i, ROLES as n, canSeeAllRequests as o, STATUSES as r, MECHANIC_STATUSES as t };
