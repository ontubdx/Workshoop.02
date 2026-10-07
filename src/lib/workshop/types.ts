export const ROLES = [
  "admin",
  "manager",
  "mechanic",
  "vehicle_user",
  "viewer",
] as const;

export type Role = (typeof ROLES)[number];

export const STATUSES = [
  "pending",
  "accepted",
  "rejected",
  "in_workshop",
  "work_complete",
  "delivered",
] as const;

export type RequestStatus = (typeof STATUSES)[number];

export const MECHANIC_STATUSES = ["not_started", "in_progress", "done"] as const;
export type MechanicStatus = (typeof MECHANIC_STATUSES)[number];

export type Profile = {
  userId: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: Role;
  department: string | null;
  active: boolean;
  createdAt: string;
};

export type Vehicle = {
  id: string;
  registrationNo: string;
  type: string;
  brand: string | null;
  model: string | null;
  department: string | null;
  assignedDriver: string | null;
  status: string;
  odometerKm: number | null;
  serviceIntervalKm: number | null;
  lastServiceKm: number | null;
  lastServiceAt: string | null;
  importedFromCsv: boolean;
  createdAt: string;
  dueForService: boolean;
};

export type WorkItem = {
  id: string;
  requestId: string;
  description: string;
  createdAt: string;
};

export type JobPart = {
  id: string;
  requestId: string;
  name: string;
  source: "store" | "external";
  vendor: string | null;
  unitPrice: number;
  qty: number;
  totalPrice: number;
  inventoryId: string | null;
  createdAt: string;
};

export type WorkshopRequest = {
  id: string;
  vehicleId: string;
  registrationNo: string;
  vehicleLabel: string;
  department: string | null;
  requestedBy: string;
  requesterName: string;
  problemDescription: string;
  photoUrls: string[];
  priority: "urgent" | "normal";
  status: RequestStatus;
  entryDate: string | null;
  tentativeDeliveryDate: string | null;
  actualDeliveryDate: string | null;
  assignedMechanic: string | null;
  assignedMechanicName: string | null;
  mechanicStatus: MechanicStatus;
  rejectionReason: string | null;
  rating: number | null;
  feedback: string | null;
  laborCost: number;
  totalCost: number;
  createdAt: string;
  updatedAt: string;
};

export type RequestDetail = WorkshopRequest & {
  workItems: WorkItem[];
  parts: JobPart[];
  partsStore: number;
  partsExternal: number;
  history: Array<{
    id: string;
    action: string;
    userId: string;
    userName: string | null;
    details: string | null;
    createdAt: string;
  }>;
};

export type InventoryItem = {
  id: string;
  partName: string;
  stockQty: number;
  reorderLevel: number;
  unit: string;
  unitPrice: number;
  lowStock: boolean;
};

export type NotificationItem = {
  id: string;
  toUserId: string;
  requestId: string | null;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
};

export type AuditEntry = {
  id: string;
  userId: string;
  userName: string | null;
  action: string;
  targetCollection: string;
  targetId: string | null;
  details: string | null;
  createdAt: string;
};

export type DashboardData = {
  openRequests: number;
  inWorkshop: number;
  monthCost: number;
  avgTurnaroundDays: number | null;
  pending: number;
  urgentOpen: number;
  lowStock: number;
  dueService: number;
  statusBreakdown: Array<{ status: RequestStatus; count: number }>;
  costTrend: Array<{ month: string; cost: number }>;
  topVehicles: Array<{ registrationNo: string; cost: number }>;
  recent: WorkshopRequest[];
};

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  manager: "Workshop Manager",
  mechanic: "Mechanic",
  vehicle_user: "Vehicle User",
  viewer: "Web Viewer",
};

export const STATUS_LABELS: Record<RequestStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
  in_workshop: "In Workshop",
  work_complete: "Work Complete",
  delivered: "Delivered",
};

export const MECHANIC_STATUS_LABELS: Record<MechanicStatus, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  done: "Done",
};

export function canManageJobs(role: Role): boolean {
  return role === "admin" || role === "manager";
}

export function canSeeAllRequests(role: Role): boolean {
  return role === "admin" || role === "manager" || role === "viewer";
}

export function canMutate(role: Role): boolean {
  return role !== "viewer";
}

export function canAdmin(role: Role): boolean {
  return role === "admin";
}
