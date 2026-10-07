# AI Prompt — Vehicle Workshop Management System (Firebase Web App)

Copy everything below this line and give it to your AI coding tool (Claude Code, Lovable, v0, Cursor, etc.) as the build prompt.

---

## Project Brief

Build a **professional, production-ready web application** called **"Workshop Management System"** for the Automobile & Transport Department of a poultry & hatchery company. The system manages the full lifecycle of company vehicles going to the internal workshop for repair/maintenance — from the employee's problem report to the manager's job completion.

Build it as a **responsive single-page web app** using:
- **Frontend:** React (Vite) + Tailwind CSS
- **Backend/DB:** Firebase (Authentication, Firestore, Storage, Cloud Functions if needed for notifications)
- **Hosting:** Firebase Hosting

Use this exact Firebase config:

```js
const firebaseConfig = {
  apiKey: "AIzaSyAoXL6_zivmrP9CBD3zC-hvUc5w2PBA8hw",
  authDomain: "workshop-management-syst-1d4bf.firebaseapp.com",
  projectId: "workshop-management-syst-1d4bf",
  storageBucket: "workshop-management-syst-1d4bf.firebasestorage.app",
  messagingSenderId: "927393947158",
  appId: "1:927393947158:web:d77cc7e7d0ce26eed05f37",
  measurementId: "G-WKFNRE8LL2"
};
```

---

## 1. User Roles & Permissions (Firestore-backed RBAC)

| Role | Access |
|---|---|
| **Admin** | Full access. Manage users & roles (assign/change/revoke). Bulk-upload vehicle data via CSV. View all requests, all costs, all reports. System settings. |
| **Workshop Manager** | View incoming requests, Accept/Reject them, set Entry Date & Tentative Delivery Date, enter work done, parts used, costs, mark "Work Complete", assign mechanics. |
| **Mechanic** | View only jobs assigned to them, update job status (Not Started / In Progress / Done), request parts from manager. |
| **Vehicle User (Employee)** | Submit a new workshop request with problem description + optional photo, track their own vehicle's status, view their vehicle's service history, leave feedback/rating after delivery. |
| **Web Viewer** | Read-only access to dashboards and reports. No create/edit rights anywhere. |

Roles must be enforced **both** in the UI (hide/disable actions) **and** in Firestore Security Rules (server-side enforcement — never trust the client alone).

---

## 2. Core Workflow (state machine)

```
Pending → Accepted → In Workshop → Work Complete → Delivered
                 ↘ Rejected
```

1. **Pending** — Vehicle User submits a request (vehicle, problem description, photo, priority).
2. **Accepted** — Manager accepts, sets Entry Date + Tentative Delivery Date. (Or Rejected, with a reason.)
3. **In Workshop** — Manager assigns a mechanic; mechanic updates progress; manager logs work items, parts (from store / purchased externally, with prices), and labor cost.
4. **Work Complete** — Manager presses "Work Complete"; total cost auto-calculated; Vehicle User notified.
5. **Delivered** — Vehicle User confirms pickup; can leave a rating/feedback.

Every status change must be timestamped and logged in an audit trail.

---

## 3. Firestore Data Model

```
users/{uid}
  - name, email, phone, role (admin|manager|mechanic|vehicle_user|viewer), department, active (bool), createdAt

vehicles/{vehicleId}
  - registrationNo, type, brand, model, department, assignedDriver, status, importedFromCSV (bool), createdAt

workshopRequests/{requestId}
  - vehicleId, requestedBy (uid), problemDescription, photoUrls[], priority (urgent|normal)
  - status (pending|accepted|rejected|in_workshop|work_complete|delivered)
  - entryDate, tentativeDeliveryDate, actualDeliveryDate
  - assignedMechanic (uid), rejectionReason
  - createdAt, updatedAt

jobDetails/{requestId}   // subcollection or linked doc
  - workItems: [{ description }]
  - parts: [{ name, source: "store"|"external", vendor, unitPrice, qty, totalPrice }]
  - laborCost
  - totalCost (auto-calculated)

notifications/{notificationId}
  - toUserId, requestId, message, type, read (bool), createdAt

auditLog/{logId}
  - userId, action, targetCollection, targetId, timestamp, details

inventory/{partId}   // optional but recommended
  - partName, stockQty, reorderLevel, unit
```

---

## 4. Required Pages / Screens

- **Login / Auth** — Firebase Authentication (email/password); role fetched from `users` collection after login.
- **Dashboard** (role-aware) — KPI cards (open requests, vehicles in workshop, this month's total cost, avg. turnaround time), charts (cost trend, top-cost vehicles).
- **New Request** (Vehicle User) — form with vehicle picker, problem description, photo upload, priority.
- **My Requests** (Vehicle User) — status tracker, history, feedback form after delivery.
- **All Requests** (Manager/Admin) — table with filters (status, date, vehicle), accept/reject actions.
- **Job Detail / Job Card** (Manager) — entry date, delivery date, work items, parts log, cost entry, complete button, printable job card view.
- **Mechanic View** — assigned jobs list, status updater.
- **Vehicles** (Admin) — CSV bulk import, vehicle list, per-vehicle service history and maintenance reminders (based on km/time interval, if odometer data available).
- **Inventory** (optional) — parts stock, low-stock alerts.
- **Users & Roles** (Admin) — add/edit users, assign roles, activate/deactivate.
- **Reports** — exportable (CSV/PDF) monthly/yearly cost and activity reports.
- **Audit Log** (Admin) — searchable activity history.

---

## 5. Non-functional Requirements

- **Fully responsive** — must work well on mobile (drivers/mechanics will use phones).
- **Professional UI** — clean, modern, corporate look; consistent color theme; Bengali + English label support is a plus (labels can be in English, but be ready to add Bengali toggle later).
- **Firestore Security Rules** — write explicit rules so each role can only read/write what it's permitted to, based on `request.auth.uid` and the user's role document.
- **Image upload** — use Firebase Storage for problem-report photos.
- **Notifications** — in-app notification bell at minimum; email notification via Cloud Function is a bonus if feasible.
- **CSV import** — client-side CSV parser (e.g. PapaParse) writing batched documents to `vehicles`.
- **Error handling & loading states** everywhere; no silent failures.
- **Seed script or admin bootstrap** — a way to create the very first Admin user.

---

## 6. Deliverables Expected

1. Complete, working source code (not snippets) — ready to `npm install && npm run dev`.
2. Firestore Security Rules file.
3. Firebase Hosting deployment config.
4. A short setup/README explaining how to deploy and how to create the first Admin account.

---

*Build this as a complete, professional, deployable application — not a prototype. Prioritize correct role-based access control and a clean, trustworthy job-card/cost-tracking flow, since this system will be used to track real company money spent on vehicle repairs.*
