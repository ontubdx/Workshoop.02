import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql, type Sql } from "@/lib/db";
import { newId, num } from "@/lib/utils";
import {
  type AuditEntry,
  type DashboardData,
  type InventoryItem,
  type JobPart,
  type MechanicStatus,
  type NotificationItem,
  type Profile,
  type RequestDetail,
  type RequestStatus,
  type Role,
  ROLES,
  type Vehicle,
  type WorkItem,
  type WorkshopRequest,
  canAdmin,
  canManageJobs,
  canSeeAllRequests,
} from "./types";

type Row = Record<string, unknown>;

class ApiError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function asString(v: unknown): string {
  return v == null ? "" : String(v);
}

function asStringOrNull(v: unknown): string | null {
  if (v == null || v === "") return null;
  return String(v);
}

function asBool(v: unknown): boolean {
  return v === true || v === "t" || v === "true";
}

function parsePhotos(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(String);
  try {
    const parsed = JSON.parse(String(raw));
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

const REQUEST_SQL = `
  select
    r.id,
    r.vehicle_id,
    v.registration_no,
    trim(both ' ' from coalesce(v.brand,'') || ' ' || coalesce(v.model,'')) as vehicle_label,
    v.department,
    r.requested_by,
    coalesce(p.name, r.requested_by) as requester_name,
    r.problem_description,
    r.photo_urls,
    r.priority,
    r.status,
    r.entry_date::text,
    r.tentative_delivery_date::text,
    r.actual_delivery_date::text,
    r.assigned_mechanic,
    m.name as assigned_mechanic_name,
    r.mechanic_status,
    r.rejection_reason,
    r.rating,
    r.feedback,
    coalesce(c.labor_cost, 0) as labor_cost,
    coalesce(c.total_cost, 0) as total_cost,
    r.created_at::text,
    r.updated_at::text
  from workshop_requests r
  join vehicles v on v.id = r.vehicle_id
  left join profiles p on p.user_id = r.requested_by
  left join profiles m on m.user_id = r.assigned_mechanic
  left join job_costs c on c.request_id = r.id
`;

function mapRequest(row: Row): WorkshopRequest {
  return {
    id: asString(row.id),
    vehicleId: asString(row.vehicle_id),
    registrationNo: asString(row.registration_no),
    vehicleLabel: asString(row.vehicle_label).trim() || asString(row.registration_no),
    department: asStringOrNull(row.department),
    requestedBy: asString(row.requested_by),
    requesterName: asString(row.requester_name),
    problemDescription: asString(row.problem_description),
    photoUrls: parsePhotos(row.photo_urls),
    priority: asString(row.priority) === "urgent" ? "urgent" : "normal",
    status: asString(row.status) as RequestStatus,
    entryDate: asStringOrNull(row.entry_date),
    tentativeDeliveryDate: asStringOrNull(row.tentative_delivery_date),
    actualDeliveryDate: asStringOrNull(row.actual_delivery_date),
    assignedMechanic: asStringOrNull(row.assigned_mechanic),
    assignedMechanicName: asStringOrNull(row.assigned_mechanic_name),
    mechanicStatus: (asString(row.mechanic_status) || "not_started") as MechanicStatus,
    rejectionReason: asStringOrNull(row.rejection_reason),
    rating: row.rating == null ? null : num(row.rating),
    feedback: asStringOrNull(row.feedback),
    laborCost: num(row.labor_cost),
    totalCost: num(row.total_cost),
    createdAt: asString(row.created_at),
    updatedAt: asString(row.updated_at),
  };
}

function mapProfile(row: Row): Profile {
  return {
    userId: asString(row.user_id),
    name: asString(row.name),
    email: asStringOrNull(row.email),
    phone: asStringOrNull(row.phone),
    role: asString(row.role) as Role,
    department: asStringOrNull(row.department),
    active: asBool(row.active),
    createdAt: asString(row.created_at),
  };
}

function mapVehicle(row: Row): Vehicle {
  const odometerKm = row.odometer_km == null ? null : num(row.odometer_km);
  const interval = row.service_interval_km == null ? null : num(row.service_interval_km);
  const lastServiceKm = row.last_service_km == null ? null : num(row.last_service_km);
  const due =
    odometerKm != null &&
    interval != null &&
    lastServiceKm != null &&
    odometerKm - lastServiceKm >= interval;
  return {
    id: asString(row.id),
    registrationNo: asString(row.registration_no),
    type: asString(row.type),
    brand: asStringOrNull(row.brand),
    model: asStringOrNull(row.model),
    department: asStringOrNull(row.department),
    assignedDriver: asStringOrNull(row.assigned_driver),
    status: asString(row.status),
    odometerKm,
    serviceIntervalKm: interval,
    lastServiceKm,
    lastServiceAt: asStringOrNull(row.last_service_at),
    importedFromCsv: asBool(row.imported_from_csv),
    createdAt: asString(row.created_at),
    dueForService: due,
  };
}

async function getAuthUser(userId: string) {
  const sql = await getSql();
  const rows = await sql.query<Row>(
    `select name, email from "user" where id = $1`,
    [userId],
  );
  return rows[0] ?? null;
}

async function loadProfile(sql: Sql, userId: string): Promise<Profile | null> {
  const rows = await sql.query<Row>(
    `select user_id, name, email, phone, role, department, active, created_at::text as created_at
     from profiles where user_id = $1`,
    [userId],
  );
  return rows[0] ? mapProfile(rows[0]) : null;
}

async function requireProfile(sql: Sql, userId: string): Promise<Profile> {
  const profile = await loadProfile(sql, userId);
  if (!profile) throw new ApiError("Profile not found. Reload and try again.", 403);
  if (!profile.active) throw new ApiError("Your account is deactivated. Contact an admin.", 403);
  return profile;
}

function assertRole(profile: Profile, allowed: Role[]) {
  if (!allowed.includes(profile.role)) {
    throw new ApiError("You do not have permission to do that.", 403);
  }
}

async function writeAudit(
  sql: Sql,
  userId: string,
  action: string,
  collection: string,
  targetId: string | null,
  details?: string | null,
) {
  await sql.query(
    `insert into audit_log (id, user_id, action, target_collection, target_id, details)
     values ($1,$2,$3,$4,$5::text,$6::text)`,
    [newId("aud"), userId, action, collection, targetId, details ?? null],
  );
}

async function notifyUsers(
  sql: Sql,
  userIds: string[],
  message: string,
  type: string,
  requestId: string | null,
) {
  const unique = [...new Set(userIds.filter(Boolean))];
  for (const to of unique) {
    await sql.query(
      `insert into notifications (id, to_user_id, request_id, message, type)
       values ($1,$2,$3::text,$4,$5)`,
      [newId("ntf"), to, requestId, message, type],
    );
  }
}

async function usersWithRoles(sql: Sql, roles: Role[]): Promise<string[]> {
  const rows = await sql.query<{ user_id: string }>(
    `select user_id from profiles where active = true and role = any($1::text[])`,
    [roles],
  );
  return rows.map((r) => r.user_id);
}

async function recalcCost(sql: Sql, requestId: string): Promise<number> {
  const partRows = await sql.query<{ s: unknown }>(
    `select coalesce(sum(total_price),0) as s from job_parts where request_id = $1`,
    [requestId],
  );
  const laborRows = await sql.query<{ labor_cost: unknown }>(
    `select labor_cost from job_costs where request_id = $1`,
    [requestId],
  );
  const parts = num(partRows[0]?.s);
  const labor = num(laborRows[0]?.labor_cost);
  const total = parts + labor;
  await sql.query(
    `insert into job_costs (request_id, labor_cost, total_cost, updated_at)
     values ($1,$2,$3, now())
     on conflict (request_id) do update set total_cost = $3, updated_at = now()`,
    [requestId, labor, total],
  );
  return total;
}

async function fetchRequest(sql: Sql, id: string): Promise<WorkshopRequest | null> {
  const rows = await sql.query<Row>(`${REQUEST_SQL} where r.id = $1`, [id]);
  return rows[0] ? mapRequest(rows[0]) : null;
}

async function fetchVisibleRequests(sql: Sql, profile: Profile): Promise<WorkshopRequest[]> {
  let where = "";
  const params: unknown[] = [];
  if (canSeeAllRequests(profile.role)) {
    where = "";
  } else if (profile.role === "mechanic") {
    where = "where r.assigned_mechanic = $1";
    params.push(profile.userId);
  } else {
    where = "where r.requested_by = $1";
    params.push(profile.userId);
  }
  const rows = await sql.query<Row>(
    `${REQUEST_SQL} ${where} order by r.created_at desc`,
    params,
  );
  return rows.map(mapRequest);
}

async function seedDemo(sql: Sql, adminId: string, adminName: string) {
  const flag = await sql.query<{ value: string }>(
    `select value from bootstrap_state where key = 'demo_seeded'`,
  );
  if (flag[0]?.value === "1") return;
  const existing = await sql.query<{ c: number }>(
    `select count(*)::int as c from workshop_requests`,
  );
  if (num(existing[0]?.c) > 0) {
    await sql.query(
      `insert into bootstrap_state (key, value) values ('demo_seeded','1') on conflict (key) do nothing`,
    );
    return;
  }

  const jobs: Array<{
    id: string;
    vehicle: string;
    problem: string;
    priority: "urgent" | "normal";
    status: RequestStatus;
    daysAgo: number;
    entryAgo?: number;
    tentativeIn?: number;
    mechanic?: boolean;
    mechanicStatus?: MechanicStatus;
    labor?: number;
    work?: string[];
    parts?: Array<{
      name: string;
      source: "store" | "external";
      vendor?: string;
      unit: number;
      qty: number;
      inv?: string;
    }>;
    rating?: number;
    feedback?: string;
    deliveredAgo?: number;
  }> = [
    {
      id: "req_demo_1",
      vehicle: "veh_01",
      problem:
        "Engine temperature climbing on hatchery chick runs. Coolant level drops after 40 km. Need inspection before Friday's placement.",
      priority: "urgent",
      status: "pending",
      daysAgo: 1,
    },
    {
      id: "req_demo_2",
      vehicle: "veh_02",
      problem:
        "Front brakes grinding on the feed mill Tata. Pedal travel is long and there is a pull to the left under load.",
      priority: "urgent",
      status: "in_workshop",
      daysAgo: 5,
      entryAgo: 4,
      tentativeIn: 1,
      mechanic: true,
      mechanicStatus: "in_progress",
      labor: 4500,
      work: ["Remove front wheels and inspect discs", "Replace front brake pad set", "Bleed DOT-4 circuit"],
      parts: [
        { name: "Brake pad set (front)", source: "store", unit: 4200, qty: 1, inv: "inv_03" },
        { name: "Brake fluid DOT-4", source: "store", unit: 390, qty: 2, inv: "inv_15" },
      ],
    },
    {
      id: "req_demo_3",
      vehicle: "veh_03",
      problem: "Clutch slipping on the broiler farm pickup when climbing the farm ramp with feed bags.",
      priority: "normal",
      status: "work_complete",
      daysAgo: 10,
      entryAgo: 9,
      tentativeIn: -1,
      mechanic: true,
      mechanicStatus: "done",
      labor: 6200,
      work: ["Replace clutch plate", "Adjust clutch free play"],
      parts: [{ name: "Clutch plate", source: "store", unit: 7800, qty: 1, inv: "inv_04" }],
    },
    {
      id: "req_demo_4",
      vehicle: "veh_05",
      problem: "Routine 3,000 km service plus a weak headlight on the transport Honda.",
      priority: "normal",
      status: "delivered",
      daysAgo: 18,
      entryAgo: 17,
      tentativeIn: -14,
      mechanic: true,
      mechanicStatus: "done",
      labor: 800,
      work: ["Engine oil change", "Replace H4 bulb", "Chain lubrication"],
      parts: [
        { name: "Engine oil 15W-40", source: "store", unit: 420, qty: 1.2, inv: "inv_01" },
        { name: "Headlight bulb H4", source: "store", unit: 450, qty: 1, inv: "inv_12" },
      ],
      rating: 5,
      feedback: "Collected same day. Headlight is bright again.",
      deliveredAgo: 14,
    },
    {
      id: "req_demo_5",
      vehicle: "veh_04",
      problem: "Cabin AC not cooling on layer farm Hiace. Compressor cycles then stops.",
      priority: "normal",
      status: "accepted",
      daysAgo: 2,
      entryAgo: 0,
      tentativeIn: 3,
    },
    {
      id: "req_demo_6",
      vehicle: "veh_08",
      problem:
        "Ashok Leyland from Tangail feed run — excessive smoke on startup and a knocking sound under load.",
      priority: "urgent",
      status: "in_workshop",
      daysAgo: 7,
      entryAgo: 6,
      tentativeIn: 2,
      mechanic: true,
      mechanicStatus: "in_progress",
      labor: 9800,
      work: ["Compression test", "Replace fuel filter", "Injector leak-off check"],
      parts: [
        { name: "Fuel filter", source: "store", unit: 1100, qty: 1, inv: "inv_10" },
        { name: "Injector nozzle (reconditioned)", source: "external", vendor: "Bengal Diesel Works", unit: 4500, qty: 2 },
      ],
    },
  ];

  for (const job of jobs) {
    const created = `now() - interval '${job.daysAgo} days'`;
    const entry =
      job.entryAgo == null ? "null" : `(current_date - ${job.entryAgo})`;
    const tentative =
      job.tentativeIn == null ? "null" : `(current_date + (${job.tentativeIn}))`;
    const delivered =
      job.deliveredAgo == null ? "null" : `(current_date - ${job.deliveredAgo})`;
    const mechanic = job.mechanic ? adminId : null;
    await sql.query(
      `insert into workshop_requests (
         id, vehicle_id, requested_by, problem_description, photo_urls, priority, status,
         entry_date, tentative_delivery_date, actual_delivery_date, assigned_mechanic,
         mechanic_status, rating, feedback, created_at, updated_at
       ) values (
         $1,$2,$3,$4,'[]',$5,$6, ${entry}, ${tentative}, ${delivered}, $7,
         $8, $9, $10, ${created}, ${created}
       )`,
      [
        job.id,
        job.vehicle,
        adminId,
        job.problem,
        job.priority,
        job.status,
        mechanic,
        job.mechanicStatus ?? "not_started",
        job.rating ?? null,
        job.feedback ?? null,
      ],
    );
    if (job.status === "in_workshop") {
      await sql.query(`update vehicles set status = 'in_workshop' where id = $1`, [job.vehicle]);
    }
    for (const w of job.work ?? []) {
      await sql.query(
        `insert into job_work_items (id, request_id, description) values ($1,$2,$3)`,
        [newId("wrk"), job.id, w],
      );
    }
    for (const p of job.parts ?? []) {
      await sql.query(
        `insert into job_parts (id, request_id, name, source, vendor, unit_price, qty, total_price, inventory_id)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [
          newId("prt"),
          job.id,
          p.name,
          p.source,
          p.vendor ?? null,
          p.unit,
          p.qty,
          p.unit * p.qty,
          p.inv ?? null,
        ],
      );
    }
    if (job.labor != null || (job.parts && job.parts.length)) {
      await sql.query(
        `insert into job_costs (request_id, labor_cost, total_cost) values ($1,$2,0)`,
        [job.id, job.labor ?? 0],
      );
      await recalcCost(sql, job.id);
    }
    await writeAudit(
      sql,
      adminId,
      "seed_request",
      "workshop_requests",
      job.id,
      `${job.status} sample job for ${job.vehicle}`,
    );
  }

  await notifyUsers(
    sql,
    [adminId],
    `Welcome ${adminName}. Sample fleet jobs are loaded so you can walk the Pending → Delivered flow.`,
    "system",
    null,
  );
  await sql.query(
    `insert into bootstrap_state (key, value) values ('demo_seeded','1') on conflict (key) do update set value = '1'`,
  );
}

export const ensureProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const authUser = await getAuthUser(context.userId);
    const existing = await loadProfile(sql, context.userId);
    const name =
      (authUser && asString(authUser.name)) || existing?.name || "Workshop User";
    const email = (authUser && asStringOrNull(authUser.email)) || existing?.email || null;

    if (!existing) {
      const countRows = await sql.query<{ c: number }>(`select count(*)::int as c from profiles`);
      const isFirst = num(countRows[0]?.c) === 0;
      const role: Role = isFirst ? "admin" : "vehicle_user";
      await sql.query(
        `insert into profiles (user_id, name, email, role) values ($1,$2,$3,$4)`,
        [context.userId, name, email, role],
      );
      await writeAudit(sql, context.userId, "create_profile", "profiles", context.userId, role);
      if (isFirst) {
        await seedDemo(sql, context.userId, name);
      }
    } else if ((email && email !== existing.email) || (name && name !== existing.name)) {
      await sql.query(`update profiles set name = $2, email = $3 where user_id = $1`, [
        context.userId,
        name,
        email,
      ]);
    }
    const profile = await requireProfile(sql, context.userId);
    return profile;
  });

export const getMe = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const profile = await loadProfile(sql, context.userId);
    if (!profile) return null;
    return profile;
  });

export const listStaff = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const me = await requireProfile(sql, context.userId);
    const rows = await sql.query<Row>(
      `select user_id, name, email, phone, role, department, active, created_at::text as created_at
       from profiles order by created_at asc`,
    );
    const all = rows.map(mapProfile);
    if (canAdmin(me.role) || canManageJobs(me.role)) return all;
    return all.filter((p) => p.userId === me.userId || p.role === "mechanic");
  });

export const updateUser = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: {
    userId: string;
    role?: Role;
    active?: boolean;
    name?: string;
    phone?: string | null;
    department?: string | null;
  }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const me = await requireProfile(sql, context.userId);
    assertRole(me, ["admin"]);
    if (data.role && !ROLES.includes(data.role)) throw new ApiError("Invalid role");
    if (data.userId === me.userId && data.role && data.role !== "admin") {
      const admins = await sql.query<{ c: number }>(
        `select count(*)::int as c from profiles where role = 'admin' and active = true and user_id <> $1`,
        [me.userId],
      );
      if (num(admins[0]?.c) === 0) {
        throw new ApiError("You are the last admin. Assign another admin before changing your role.");
      }
    }
    if (data.userId === me.userId && data.active === false) {
      throw new ApiError("You cannot deactivate your own account.");
    }
    await sql.query(
      `update profiles set
         role = coalesce($2::text, role),
         active = coalesce($3::boolean, active),
         name = coalesce($4::text, name),
         phone = coalesce($5::text, phone),
         department = coalesce($6::text, department)
       where user_id = $1`,
      [
        data.userId,
        data.role ?? null,
        data.active ?? null,
        data.name?.trim() || null,
        data.phone === undefined ? null : data.phone,
        data.department === undefined ? null : data.department,
      ],
    );
    await writeAudit(sql, me.userId, "update_user", "profiles", data.userId, JSON.stringify(data));
    return { ok: true };
  });

export const listVehicles = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await requireProfile(sql, context.userId);
    const rows = await sql.query<Row>(
      `select id, registration_no, type, brand, model, department, assigned_driver, status,
              odometer_km, service_interval_km, last_service_km, last_service_at::text,
              imported_from_csv, created_at::text
       from vehicles order by registration_no`,
    );
    return rows.map(mapVehicle);
  });

export const upsertVehicle = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: {
    id?: string;
    registrationNo: string;
    type: string;
    brand?: string;
    model?: string;
    department?: string;
    assignedDriver?: string;
    odometerKm?: number | null;
    serviceIntervalKm?: number | null;
    lastServiceKm?: number | null;
    lastServiceAt?: string | null;
  }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const me = await requireProfile(sql, context.userId);
    assertRole(me, ["admin"]);
    const id = data.id || newId("veh");
    const reg = data.registrationNo.trim().toUpperCase();
    if (!reg) throw new ApiError("Registration number is required");
    await sql.query(
      `insert into vehicles (
         id, registration_no, type, brand, model, department, assigned_driver,
         odometer_km, service_interval_km, last_service_km, last_service_at
       ) values ($1,$2,$3,$4::text,$5::text,$6::text,$7::text,$8::int,$9::int,$10::int,$11::date)
       on conflict (id) do update set
         registration_no = excluded.registration_no,
         type = excluded.type,
         brand = excluded.brand,
         model = excluded.model,
         department = excluded.department,
         assigned_driver = excluded.assigned_driver,
         odometer_km = excluded.odometer_km,
         service_interval_km = excluded.service_interval_km,
         last_service_km = excluded.last_service_km,
         last_service_at = excluded.last_service_at`,
      [
        id,
        reg,
        data.type.trim() || "Vehicle",
        data.brand?.trim() || null,
        data.model?.trim() || null,
        data.department?.trim() || null,
        data.assignedDriver?.trim() || null,
        data.odometerKm ?? null,
        data.serviceIntervalKm ?? null,
        data.lastServiceKm ?? null,
        data.lastServiceAt || null,
      ],
    );
    await writeAudit(sql, me.userId, data.id ? "update_vehicle" : "create_vehicle", "vehicles", id, reg);
    return { id };
  });

export const importVehicles = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: {
    rows: Array<{
      registrationNo: string;
      type?: string;
      brand?: string;
      model?: string;
      department?: string;
      assignedDriver?: string;
      odometerKm?: number | null;
    }>;
  }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const me = await requireProfile(sql, context.userId);
    assertRole(me, ["admin"]);
    let imported = 0;
    let skipped = 0;
    for (const row of data.rows) {
      const reg = row.registrationNo.trim().toUpperCase();
      if (!reg) {
        skipped += 1;
        continue;
      }
      const existing = await sql.query<{ id: string }>(
        `select id from vehicles where registration_no = $1`,
        [reg],
      );
      if (existing[0]) {
        await sql.query(
          `update vehicles set type = coalesce(nullif($2,''), type), brand = coalesce(nullif($3,''), brand),
           model = coalesce(nullif($4,''), model), department = coalesce(nullif($5,''), department),
           assigned_driver = coalesce(nullif($6,''), assigned_driver),
           odometer_km = coalesce($7::int, odometer_km)
           where id = $1`,
          [
            existing[0].id,
            row.type?.trim() ?? "",
            row.brand?.trim() ?? "",
            row.model?.trim() ?? "",
            row.department?.trim() ?? "",
            row.assignedDriver?.trim() ?? "",
            row.odometerKm ?? null,
          ],
        );
        imported += 1;
        continue;
      }
      await sql.query(
        `insert into vehicles (id, registration_no, type, brand, model, department, assigned_driver, odometer_km, imported_from_csv)
         values ($1,$2,$3,$4::text,$5::text,$6::text,$7::text,$8::int,true)`,
        [
          newId("veh"),
          reg,
          row.type?.trim() || "Vehicle",
          row.brand?.trim() || null,
          row.model?.trim() || null,
          row.department?.trim() || null,
          row.assignedDriver?.trim() || null,
          row.odometerKm ?? null,
        ],
      );
      imported += 1;
    }
    await writeAudit(
      sql,
      me.userId,
      "import_vehicles",
      "vehicles",
      null,
      `${imported} imported, ${skipped} skipped`,
    );
    return { imported, skipped };
  });

export const listRequests = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const me = await requireProfile(sql, context.userId);
    return fetchVisibleRequests(sql, me);
  });

export const getRequest = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: { id: string }) => data)
  .handler(async ({ context, data }): Promise<RequestDetail> => {
    const sql = await getSql();
    const me = await requireProfile(sql, context.userId);
    const request = await fetchRequest(sql, data.id);
    if (!request) throw new ApiError("Job not found", 404);
    const allowed =
      canSeeAllRequests(me.role) ||
      request.requestedBy === me.userId ||
      request.assignedMechanic === me.userId;
    if (!allowed) throw new ApiError("You cannot view this job", 403);

    const workRows = await sql.query<Row>(
      `select id, request_id, description, created_at::text from job_work_items where request_id = $1 order by created_at`,
      [data.id],
    );
    const partRows = await sql.query<Row>(
      `select id, request_id, name, source, vendor, unit_price, qty, total_price, inventory_id, created_at::text
       from job_parts where request_id = $1 order by created_at`,
      [data.id],
    );
    const workItems: WorkItem[] = workRows.map((r) => ({
      id: asString(r.id),
      requestId: asString(r.request_id),
      description: asString(r.description),
      createdAt: asString(r.created_at),
    }));
    const parts: JobPart[] = partRows.map((r) => ({
      id: asString(r.id),
      requestId: asString(r.request_id),
      name: asString(r.name),
      source: asString(r.source) === "external" ? "external" : "store",
      vendor: asStringOrNull(r.vendor),
      unitPrice: num(r.unit_price),
      qty: num(r.qty),
      totalPrice: num(r.total_price),
      inventoryId: asStringOrNull(r.inventory_id),
      createdAt: asString(r.created_at),
    }));
    const historyRows = await sql.query<Row>(
      `select a.id, a.action, a.user_id, p.name as user_name, a.details, a.created_at::text
       from audit_log a left join profiles p on p.user_id = a.user_id
       where a.target_id = $1 order by a.created_at asc`,
      [data.id],
    );
    return {
      ...request,
      workItems,
      parts,
      partsStore: parts.filter((p) => p.source === "store").reduce((s, p) => s + p.totalPrice, 0),
      partsExternal: parts.filter((p) => p.source === "external").reduce((s, p) => s + p.totalPrice, 0),
      history: historyRows.map((r) => ({
        id: asString(r.id),
        action: asString(r.action),
        userId: asString(r.user_id),
        userName: asStringOrNull(r.user_name),
        details: asStringOrNull(r.details),
        createdAt: asString(r.created_at),
      })),
    };
  });

export const createRequest = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: {
    vehicleId: string;
    problemDescription: string;
    priority: "urgent" | "normal";
    photoUrls?: string[];
  }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const me = await requireProfile(sql, context.userId);
    if (me.role === "viewer" || me.role === "mechanic") {
      throw new ApiError("You cannot create workshop requests", 403);
    }
    const problem = data.problemDescription.trim();
    if (!problem) throw new ApiError("Describe the problem");
    const vehicle = await sql.query<{ id: string; registration_no: string }>(
      `select id, registration_no from vehicles where id = $1`,
      [data.vehicleId],
    );
    if (!vehicle[0]) throw new ApiError("Vehicle not found");
    const id = newId("req");
    const photos = JSON.stringify((data.photoUrls ?? []).slice(0, 4));
    await sql.query(
      `insert into workshop_requests (id, vehicle_id, requested_by, problem_description, photo_urls, priority)
       values ($1,$2,$3,$4,$5,$6)`,
      [id, data.vehicleId, me.userId, problem, photos, data.priority],
    );
    await writeAudit(sql, me.userId, "create_request", "workshop_requests", id, vehicle[0].registration_no);
    const managers = await usersWithRoles(sql, ["admin", "manager"]);
    await notifyUsers(
      sql,
      managers.filter((u) => u !== me.userId),
      `${me.name} submitted ${data.priority === "urgent" ? "an urgent" : "a"} job for ${vehicle[0].registration_no}`,
      "request_created",
      id,
    );
    return { id };
  });

export const acceptRequest = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: {
    id: string;
    entryDate: string;
    tentativeDeliveryDate: string;
    assignedMechanic?: string | null;
  }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const me = await requireProfile(sql, context.userId);
    assertRole(me, ["admin", "manager"]);
    const current = await fetchRequest(sql, data.id);
    if (!current) throw new ApiError("Job not found", 404);
    if (current.status !== "pending") throw new ApiError("Only pending jobs can be accepted");
    const mechanic = data.assignedMechanic || null;
    const nextStatus: RequestStatus = mechanic ? "in_workshop" : "accepted";
    const mechanicStatus = mechanic ? "not_started" : current.mechanicStatus;
    await sql.query(
      `update workshop_requests
       set status = $2,
           entry_date = $3::date,
           tentative_delivery_date = $4::date,
           assigned_mechanic = $5::text,
           mechanic_status = $6,
           updated_at = now()
       where id = $1`,
      [data.id, nextStatus, data.entryDate, data.tentativeDeliveryDate, mechanic, mechanicStatus],
    );
    if (mechanic) {
      await sql.query(`update vehicles set status = 'in_workshop' where id = $1`, [current.vehicleId]);
    }
    await writeAudit(sql, me.userId, "accept_request", "workshop_requests", data.id, nextStatus);
    await notifyUsers(
      sql,
      [current.requestedBy, mechanic].filter((u): u is string => !!u && u !== me.userId),
      `Job ${current.registrationNo} was accepted. Entry ${data.entryDate}, tentative delivery ${data.tentativeDeliveryDate}.`,
      "request_accepted",
      data.id,
    );
    return { ok: true };
  });

export const rejectRequest = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: string; reason: string }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const me = await requireProfile(sql, context.userId);
    assertRole(me, ["admin", "manager"]);
    const current = await fetchRequest(sql, data.id);
    if (!current) throw new ApiError("Job not found", 404);
    if (current.status !== "pending") throw new ApiError("Only pending jobs can be rejected");
    const reason = data.reason.trim();
    if (!reason) throw new ApiError("A rejection reason is required");
    await sql.query(
      `update workshop_requests set status = 'rejected', rejection_reason = $2, updated_at = now() where id = $1`,
      [data.id, reason],
    );
    await writeAudit(sql, me.userId, "reject_request", "workshop_requests", data.id, reason);
    await notifyUsers(
      sql,
      [current.requestedBy],
      `Job ${current.registrationNo} was rejected: ${reason}`,
      "request_rejected",
      data.id,
    );
    return { ok: true };
  });

export const assignMechanic = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: string; mechanicId: string }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const me = await requireProfile(sql, context.userId);
    assertRole(me, ["admin", "manager"]);
    const current = await fetchRequest(sql, data.id);
    if (!current) throw new ApiError("Job not found", 404);
    if (!["accepted", "in_workshop"].includes(current.status)) {
      throw new ApiError("Assign a mechanic after the job is accepted");
    }
    await sql.query(
      `update workshop_requests set assigned_mechanic = $2, status = 'in_workshop',
       mechanic_status = 'not_started', updated_at = now() where id = $1`,
      [data.id, data.mechanicId],
    );
    await sql.query(`update vehicles set status = 'in_workshop' where id = $1`, [current.vehicleId]);
    await writeAudit(sql, me.userId, "assign_mechanic", "workshop_requests", data.id, data.mechanicId);
    await notifyUsers(
      sql,
      [data.mechanicId],
      `You were assigned to ${current.registrationNo}`,
      "mechanic_assigned",
      data.id,
    );
    return { ok: true };
  });

export const updateMechanicStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: string; mechanicStatus: MechanicStatus }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const me = await requireProfile(sql, context.userId);
    const current = await fetchRequest(sql, data.id);
    if (!current) throw new ApiError("Job not found", 404);
    const isAssignee = current.assignedMechanic === me.userId;
    if (!isAssignee && !canManageJobs(me.role)) {
      throw new ApiError("Only the assigned mechanic can update this status", 403);
    }
    if (current.status !== "in_workshop") throw new ApiError("Job is not in the workshop");
    await sql.query(
      `update workshop_requests set mechanic_status = $2, updated_at = now() where id = $1`,
      [data.id, data.mechanicStatus],
    );
    await writeAudit(sql, me.userId, "mechanic_status", "workshop_requests", data.id, data.mechanicStatus);
    return { ok: true };
  });

export const addWorkItem = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { requestId: string; description: string }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const me = await requireProfile(sql, context.userId);
    assertRole(me, ["admin", "manager"]);
    const description = data.description.trim();
    if (!description) throw new ApiError("Work description is required");
    const id = newId("wrk");
    await sql.query(
      `insert into job_work_items (id, request_id, description) values ($1,$2,$3)`,
      [id, data.requestId, description],
    );
    await sql.query(`update workshop_requests set updated_at = now() where id = $1`, [data.requestId]);
    await writeAudit(sql, me.userId, "add_work_item", "job_work_items", data.requestId, description);
    return { id };
  });

export const removeWorkItem = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: string; requestId: string }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const me = await requireProfile(sql, context.userId);
    assertRole(me, ["admin", "manager"]);
    await sql.query(`delete from job_work_items where id = $1 and request_id = $2`, [
      data.id,
      data.requestId,
    ]);
    return { ok: true };
  });

export const addPart = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: {
    requestId: string;
    name: string;
    source: "store" | "external";
    vendor?: string;
    unitPrice: number;
    qty: number;
    inventoryId?: string | null;
  }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const me = await requireProfile(sql, context.userId);
    assertRole(me, ["admin", "manager"]);
    const name = data.name.trim();
    if (!name) throw new ApiError("Part name is required");
    const qty = num(data.qty);
    const unit = num(data.unitPrice);
    if (qty <= 0) throw new ApiError("Quantity must be greater than zero");
    if (unit < 0) throw new ApiError("Price cannot be negative");
    if (data.source === "store" && data.inventoryId) {
      const inv = await sql.query<{ stock_qty: unknown; part_name: string }>(
        `select stock_qty, part_name from inventory where id = $1`,
        [data.inventoryId],
      );
      if (!inv[0]) throw new ApiError("Inventory item not found");
      if (num(inv[0].stock_qty) < qty) {
        throw new ApiError(`Not enough stock for ${inv[0].part_name}`);
      }
      await sql.query(`update inventory set stock_qty = stock_qty - $2 where id = $1`, [
        data.inventoryId,
        qty,
      ]);
    }
    const id = newId("prt");
    await sql.query(
      `insert into job_parts (id, request_id, name, source, vendor, unit_price, qty, total_price, inventory_id)
       values ($1,$2,$3,$4,$5::text,$6,$7,$8,$9::text)`,
      [id, data.requestId, name, data.source, data.vendor?.trim() || null, unit, qty, unit * qty, data.inventoryId ?? null],
    );
    const total = await recalcCost(sql, data.requestId);
    await sql.query(`update workshop_requests set updated_at = now() where id = $1`, [data.requestId]);
    await writeAudit(sql, me.userId, "add_part", "job_parts", data.requestId, `${name} x${qty}`);
    return { id, total };
  });

export const removePart = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: string; requestId: string }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const me = await requireProfile(sql, context.userId);
    assertRole(me, ["admin", "manager"]);
    const part = await sql.query<Row>(`select * from job_parts where id = $1 and request_id = $2`, [
      data.id,
      data.requestId,
    ]);
    if (part[0] && asString(part[0].source) === "store" && part[0].inventory_id) {
      await sql.query(`update inventory set stock_qty = stock_qty + $2 where id = $1`, [
        part[0].inventory_id,
        num(part[0].qty),
      ]);
    }
    await sql.query(`delete from job_parts where id = $1`, [data.id]);
    const total = await recalcCost(sql, data.requestId);
    return { ok: true, total };
  });

export const setLaborCost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { requestId: string; laborCost: number }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const me = await requireProfile(sql, context.userId);
    assertRole(me, ["admin", "manager"]);
    const labor = Math.max(0, num(data.laborCost));
    await sql.query(
      `insert into job_costs (request_id, labor_cost, total_cost) values ($1,$2,0)
       on conflict (request_id) do update set labor_cost = $2`,
      [data.requestId, labor],
    );
    const total = await recalcCost(sql, data.requestId);
    await writeAudit(sql, me.userId, "set_labor", "job_costs", data.requestId, String(labor));
    return { total, labor };
  });

export const completeWork = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: string }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const me = await requireProfile(sql, context.userId);
    assertRole(me, ["admin", "manager"]);
    const current = await fetchRequest(sql, data.id);
    if (!current) throw new ApiError("Job not found", 404);
    if (!["in_workshop", "accepted"].includes(current.status)) {
      throw new ApiError("Job must be in the workshop before it can be completed");
    }
    const total = await recalcCost(sql, data.id);
    await sql.query(
      `update workshop_requests set status = 'work_complete', mechanic_status = 'done', updated_at = now() where id = $1`,
      [data.id],
    );
    await writeAudit(sql, me.userId, "work_complete", "workshop_requests", data.id, String(total));
    await notifyUsers(
      sql,
      [current.requestedBy],
      `Work is complete on ${current.registrationNo}. Total cost ${Math.round(total)}. Please collect the vehicle.`,
      "work_complete",
      data.id,
    );
    return { total };
  });

export const confirmDelivery = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: string; rating?: number; feedback?: string }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const me = await requireProfile(sql, context.userId);
    const current = await fetchRequest(sql, data.id);
    if (!current) throw new ApiError("Job not found", 404);
    const ownerOrManager = current.requestedBy === me.userId || canManageJobs(me.role);
    if (!ownerOrManager) throw new ApiError("Only the requester can confirm pickup", 403);
    if (current.status !== "work_complete") throw new ApiError("Job is not ready for delivery");
    const rating =
      data.rating && data.rating >= 1 && data.rating <= 5 ? Math.round(data.rating) : null;
    await sql.query(
      `update workshop_requests set status = 'delivered', actual_delivery_date = current_date,
       rating = $2::int, feedback = $3::text, updated_at = now() where id = $1`,
      [data.id, rating, data.feedback?.trim() || null],
    );
    await sql.query(`update vehicles set status = 'active' where id = $1`, [current.vehicleId]);
    await writeAudit(sql, me.userId, "deliver_request", "workshop_requests", data.id, rating ? `rating ${rating}` : null);
    const managers = await usersWithRoles(sql, ["admin", "manager"]);
    await notifyUsers(
      sql,
      managers.filter((u) => u !== me.userId),
      `${current.registrationNo} was collected${rating ? ` · ${rating}/5` : ""}`,
      "delivered",
      data.id,
    );
    return { ok: true };
  });

export const requestParts = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { requestId: string; message: string }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const me = await requireProfile(sql, context.userId);
    const current = await fetchRequest(sql, data.requestId);
    if (!current) throw new ApiError("Job not found", 404);
    if (current.assignedMechanic !== me.userId && !canManageJobs(me.role)) {
      throw new ApiError("Only the assigned mechanic can request parts", 403);
    }
    const message = data.message.trim();
    if (!message) throw new ApiError("Describe the parts you need");
    const managers = await usersWithRoles(sql, ["admin", "manager"]);
    await notifyUsers(
      sql,
      managers,
      `${me.name} requested parts for ${current.registrationNo}: ${message}`,
      "parts_request",
      data.requestId,
    );
    await writeAudit(sql, me.userId, "request_parts", "workshop_requests", data.requestId, message);
    return { ok: true };
  });

export const listInventory = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await requireProfile(sql, context.userId);
    const rows = await sql.query<Row>(
      `select id, part_name, stock_qty, reorder_level, unit, unit_price from inventory order by part_name`,
    );
    return rows.map(
      (r): InventoryItem => ({
        id: asString(r.id),
        partName: asString(r.part_name),
        stockQty: num(r.stock_qty),
        reorderLevel: num(r.reorder_level),
        unit: asString(r.unit),
        unitPrice: num(r.unit_price),
        lowStock: num(r.stock_qty) <= num(r.reorder_level),
      }),
    );
  });

export const upsertInventory = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: {
    id?: string;
    partName: string;
    stockQty: number;
    reorderLevel: number;
    unit: string;
    unitPrice: number;
  }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const me = await requireProfile(sql, context.userId);
    assertRole(me, ["admin", "manager"]);
    const id = data.id || newId("inv");
    await sql.query(
      `insert into inventory (id, part_name, stock_qty, reorder_level, unit, unit_price)
       values ($1,$2,$3,$4,$5,$6)
       on conflict (id) do update set part_name = $2, stock_qty = $3, reorder_level = $4, unit = $5, unit_price = $6`,
      [
        id,
        data.partName.trim(),
        num(data.stockQty),
        num(data.reorderLevel),
        data.unit.trim() || "pcs",
        num(data.unitPrice),
      ],
    );
    await writeAudit(sql, me.userId, data.id ? "update_part" : "create_part", "inventory", id, data.partName);
    return { id };
  });

export const listNotifications = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await requireProfile(sql, context.userId);
    const rows = await sql.query<Row>(
      `select id, to_user_id, request_id, message, type, read, created_at::text
       from notifications where to_user_id = $1 order by created_at desc limit 40`,
      [context.userId],
    );
    return rows.map(
      (r): NotificationItem => ({
        id: asString(r.id),
        toUserId: asString(r.to_user_id),
        requestId: asStringOrNull(r.request_id),
        message: asString(r.message),
        type: asString(r.type),
        read: asBool(r.read),
        createdAt: asString(r.created_at),
      }),
    );
  });

export const markNotificationsRead = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await sql.query(`update notifications set read = true where to_user_id = $1`, [context.userId]);
    return { ok: true };
  });

export const listAudit = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const me = await requireProfile(sql, context.userId);
    assertRole(me, ["admin"]);
    const rows = await sql.query<Row>(
      `select a.id, a.user_id, p.name as user_name, a.action, a.target_collection, a.target_id, a.details, a.created_at::text
       from audit_log a left join profiles p on p.user_id = a.user_id
       order by a.created_at desc limit 200`,
    );
    return rows.map(
      (r): AuditEntry => ({
        id: asString(r.id),
        userId: asString(r.user_id),
        userName: asStringOrNull(r.user_name),
        action: asString(r.action),
        targetCollection: asString(r.target_collection),
        targetId: asStringOrNull(r.target_id),
        details: asStringOrNull(r.details),
        createdAt: asString(r.created_at),
      }),
    );
  });

export const dashboardData = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<DashboardData> => {
    const sql = await getSql();
    const me = await requireProfile(sql, context.userId);
    const requests = await fetchVisibleRequests(sql, me);
    const open = requests.filter((r) =>
      ["pending", "accepted", "in_workshop"].includes(r.status),
    );
    const inWorkshop = requests.filter((r) => r.status === "in_workshop");
    const now = new Date();
    const monthCost = requests
      .filter((r) => {
        if (r.status === "rejected") return false;
        const d = new Date(r.updatedAt);
        return (
          !Number.isNaN(d.getTime()) &&
          d.getFullYear() === now.getFullYear() &&
          d.getMonth() === now.getMonth()
        );
      })
      .reduce((s, r) => s + r.totalCost, 0);
    const delivered = requests.filter((r) => r.status === "delivered" && r.entryDate && r.actualDeliveryDate);
    const turnarounds = delivered
      .map((r) => {
        const a = new Date(`${r.entryDate}T00:00:00`).getTime();
        const b = new Date(`${r.actualDeliveryDate}T00:00:00`).getTime();
        return (b - a) / 86_400_000;
      })
      .filter((d) => Number.isFinite(d) && d >= 0);
    const avgTurnaroundDays =
      turnarounds.length === 0
        ? null
        : Math.round((turnarounds.reduce((s, d) => s + d, 0) / turnarounds.length) * 10) / 10;

    const statusBreakdown = (
      ["pending", "accepted", "rejected", "in_workshop", "work_complete", "delivered"] as RequestStatus[]
    ).map((status) => ({
      status,
      count: requests.filter((r) => r.status === status).length,
    }));

    const costTrendMap = new Map<string, number>();
    for (let i = 5; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      costTrendMap.set(key, 0);
    }
    for (const r of requests) {
      if (r.status === "rejected" || r.totalCost <= 0) continue;
      const d = new Date(r.updatedAt);
      if (Number.isNaN(d.getTime())) continue;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (costTrendMap.has(key)) costTrendMap.set(key, (costTrendMap.get(key) ?? 0) + r.totalCost);
    }
    const costTrend = [...costTrendMap.entries()].map(([month, cost]) => ({ month, cost }));

    const byVehicle = new Map<string, number>();
    for (const r of requests) {
      if (r.totalCost <= 0) continue;
      byVehicle.set(r.registrationNo, (byVehicle.get(r.registrationNo) ?? 0) + r.totalCost);
    }
    const topVehicles = [...byVehicle.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([registrationNo, cost]) => ({ registrationNo, cost }));

    const vehicles =
      me.role === "admin" || me.role === "manager" || me.role === "viewer"
        ? await sql.query<Row>(
            `select odometer_km, service_interval_km, last_service_km from vehicles`,
          )
        : [];
    const dueService = vehicles.filter((v) => {
      const o = num(v.odometer_km);
      const i = num(v.service_interval_km);
      const l = num(v.last_service_km);
      return i > 0 && o - l >= i;
    }).length;
    const lowStockRows = await sql.query<{ c: number }>(
      `select count(*)::int as c from inventory where stock_qty <= reorder_level`,
    );

    return {
      openRequests: open.length,
      inWorkshop: inWorkshop.length,
      monthCost,
      avgTurnaroundDays,
      pending: requests.filter((r) => r.status === "pending").length,
      urgentOpen: open.filter((r) => r.priority === "urgent").length,
      lowStock: canManageJobs(me.role) || me.role === "viewer" ? num(lowStockRows[0]?.c) : 0,
      dueService,
      statusBreakdown,
      costTrend,
      topVehicles,
      recent: requests.slice(0, 6),
    };
  });

export const reportData = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const me = await requireProfile(sql, context.userId);
    if (!canSeeAllRequests(me.role) && me.role !== "manager") {
      assertRole(me, ["admin", "manager", "viewer"]);
    }
    const requests = await fetchVisibleRequests(sql, me);
    return requests;
  });
