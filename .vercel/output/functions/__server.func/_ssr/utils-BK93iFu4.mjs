import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-BK93iFu4.js
function cn(...inputs) {
	return twMerge(inputs.filter(Boolean).join(" "));
}
function newId(prefix = "id") {
	return `${prefix}_${typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
}
function num(value) {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value === "string") {
		const n = Number(value);
		return Number.isFinite(n) ? n : 0;
	}
	return 0;
}
function formatBdt(value) {
	return `৳${Math.round(value).toLocaleString("en-BD")}`;
}
function formatDate(value, locale = "en-GB") {
	if (!value) return "—";
	const d = value.length <= 10 ? /* @__PURE__ */ new Date(`${value}T00:00:00`) : new Date(value);
	if (Number.isNaN(d.getTime())) return value;
	return d.toLocaleDateString(locale, {
		day: "2-digit",
		month: "short",
		year: "numeric"
	});
}
function formatDateTime(value, locale = "en-GB") {
	if (!value) return "—";
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return value;
	return d.toLocaleString(locale, {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	});
}
function parseCsv(text) {
	const rows = [];
	let row = [];
	let cell = "";
	let inQuotes = false;
	for (let i = 0; i < text.length; i += 1) {
		const ch = text[i];
		if (inQuotes) {
			if (ch === "\"") {
				if (text[i + 1] === "\"") {
					cell += "\"";
					i += 1;
				} else inQuotes = false;
			} else cell += ch;
		} else if (ch === "\"") inQuotes = true;
		else if (ch === ",") {
			row.push(cell.trim());
			cell = "";
		} else if (ch === "\n") {
			row.push(cell.trim());
			if (row.some((c) => c.length > 0)) rows.push(row);
			row = [];
			cell = "";
		} else if (ch !== "\r") cell += ch;
	}
	row.push(cell.trim());
	if (row.some((c) => c.length > 0)) rows.push(row);
	return rows;
}
async function compressImage(file, max = 960) {
	const url = URL.createObjectURL(file);
	try {
		const img = await new Promise((resolve, reject) => {
			const el = new Image();
			el.onload = () => resolve(el);
			el.onerror = () => reject(/* @__PURE__ */ new Error("Could not read image"));
			el.src = url;
		});
		let { width, height } = img;
		if (width > max || height > max) {
			const scale = max / Math.max(width, height);
			width = Math.round(width * scale);
			height = Math.round(height * scale);
		}
		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("Could not process image");
		ctx.drawImage(img, 0, 0, width, height);
		return canvas.toDataURL("image/jpeg", .72);
	} finally {
		URL.revokeObjectURL(url);
	}
}
//#endregion
export { formatDateTime as a, parseCsv as c, formatDate as i, compressImage as n, newId as o, formatBdt as r, num as s, cn as t };
