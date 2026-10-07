import { r as createServerFn } from "./ssr.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as createSsrRpc } from "./router-DoBdnNsS.mjs";
import { t as authMiddleware } from "./middleware-CvjxVJ3G.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hooks-DHQe4QNS.js
var ensureProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("cc1354930acb6e1c5392b51609d51f52e1a42e0f89cc812d48fc06bc86644ec5"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("6a4e8449718e858051191262d851c21c31f83bcfd354f732bd73fb7e6e811195"));
var listStaff = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("710376a715317838e3c3cf4af2a1205c2fab3ca5bad5665d9f6c6e5aa4b8360c"));
var updateUser = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("e22eefdf303932c4b9d04e849191a64f6d7e7edd83ea8a0e6b608d5577a1c7ae"));
var listVehicles = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("11240ed50b75833853c719dc49bb0ef779f49db3372fa8e31f122b279d8ba485"));
var upsertVehicle = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("054039b8823be3cb8c17a2642228391a0d7862b4ed0572fbd1b88de6a21e74c7"));
var importVehicles = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("c8b4ae39aa89b3d085f64be8abcf2170bc572ab8cdd143700f8475974b261c74"));
var listRequests = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("c88de2c2e180a8ae0f8af56a4d6f7db0ee387dfaf91418cf3d482f8a48262678"));
var getRequest = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("3f48bc24afd735344d83d7ac5f466858a8b9794fa3bb7949d914b000ca5c9880"));
var createRequest = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("4cc33191aa7ba3634589a11f6bd46d9bef7c0f4db3d8a0f089cb3ed32da9f137"));
var acceptRequest = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("ad133c6f84f935bc26dbe30390e0f4952a4088a8334501c2ea6863e77abafd2c"));
var rejectRequest = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("a1d130fe17c563a82f75b65422cf6ed71c24bbe0cb26f6dd38a47a720baea3cd"));
var assignMechanic = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("bdc183b7c58edd372a92a91bbbe710686be769eb37e0acf69b8de5bc0ea1373d"));
var updateMechanicStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("2604c36d08e25908261e1d0aee43d418d369131853ced77c32195a04ffb9ee1a"));
var addWorkItem = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("5639315f51ee5fb8a4796c67c63d9a3efac2b52a4f5cbb957004b9b75d51cc38"));
var removeWorkItem = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("35f9df1ef598344da5f5cc8c5709d00fb040e1a11eea476d31d4ac94a17c91c6"));
var addPart = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("1dd2ba65942b79c4946233bba97f401f230b68b2a5a7c317e12cee49d60d7007"));
var removePart = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("98199a9c2e3b54473e447811c038f7ad76d65b74f682aac2d0c2fc44dc7509a9"));
var setLaborCost = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("cdfaaef0e01770c5023018520bf598dcad27b8eb3a94976aa26a0a4c2c681156"));
var completeWork = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("4630c7de40e104300828811e0165cd1bd3938737d135c308dfe39bd2d1cf69fc"));
var confirmDelivery = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("92a76ae7a143b68b00413e9c8a2490dbc5c112fc328c606a0144a46f8c23cefb"));
var requestParts = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("099f28cb72f6653c3347a4a927411e5ab838a4288af4ff6a3a50cc4876185b4e"));
var listInventory = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("23968e6d9cdb624b8b6f6c254c3de20402f9bddc4ea5450663f1e3b2c1ac46ab"));
var upsertInventory = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("1e875b66c50e96ac3aa0b1e271c5100b029da484d7b1b67ee084955b515c3cbc"));
var listNotifications = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("0d59c289ca21cab13dbbb0fc709e9fde8be9d23740e3e095dddf7508259c9418"));
var markNotificationsRead = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("012fa7f56c83f10fcf17d6009b25daac7e51fc2dfc6983c2a5083cdb90f441d7"));
var listAudit = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("795581339fac43aa67fe1ca6625468847dbfdcac9a9eebc802a7e3db7b630512"));
var dashboardData = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("732a3e5c18cc86d5cc53d9bb6761f5ea0c5de3df7037a2d6d5c55d1b967a4ac6"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("f8f0a4ee50359c36d9bf9bc19002fe0eb82bc070f04e7a4c54d797f1012e0bf9"));
function useProfile(enabled = true) {
	return useQuery({
		queryKey: ["profile"],
		queryFn: () => ensureProfile(),
		enabled,
		retry: false
	});
}
function useDashboard() {
	return useQuery({
		queryKey: ["dashboard"],
		queryFn: () => dashboardData()
	});
}
function useRequests() {
	return useQuery({
		queryKey: ["requests"],
		queryFn: () => listRequests()
	});
}
function useVehicles() {
	return useQuery({
		queryKey: ["vehicles"],
		queryFn: () => listVehicles()
	});
}
function useInventory() {
	return useQuery({
		queryKey: ["inventory"],
		queryFn: () => listInventory()
	});
}
function useStaff() {
	return useQuery({
		queryKey: ["staff"],
		queryFn: () => listStaff()
	});
}
function useNotifications() {
	return useQuery({
		queryKey: ["notifications"],
		queryFn: () => listNotifications(),
		refetchInterval: 3e4
	});
}
//#endregion
export { useInventory as C, useStaff as D, useRequests as E, useVehicles as O, useDashboard as S, useProfile as T, setLaborCost as _, completeWork as a, upsertInventory as b, getRequest as c, listRequests as d, markNotificationsRead as f, requestParts as g, removeWorkItem as h, assignMechanic as i, importVehicles as l, removePart as m, addPart as n, confirmDelivery as o, rejectRequest as p, addWorkItem as r, createRequest as s, acceptRequest as t, listAudit as u, updateMechanicStatus as v, useNotifications as w, upsertVehicle as x, updateUser as y };
