# Workshop Management System

Internal web app for the Automobile & Transport Department of a poultry & hatchery company. Tracks every vehicle that enters the workshop — from the problem report through job card, parts, labour, and signed delivery.

Bengali and English labels are available via the **বাং / EN** toggle. The first visit defaults to Bengali.

## Roles

| Role | Access |
| --- | --- |
| Admin | Users, fleet CSV import, all jobs, costs, reports, audit log |
| Workshop Manager | Accept / reject jobs, assign mechanics, log work & parts, complete jobs |
| Mechanic | Assigned jobs only; progress + parts requests |
| Vehicle User | Submit requests, track own vehicles, confirm pickup + rating |
| Web Viewer | Read-only dashboards and reports |

The **first account to sign in becomes Admin**. Later accounts start as Vehicle User until an admin assigns a role under **Users & roles**.

## Sign-in

Google, X, or email/password. Use the live app's sign-in screen — there are no shared demo passwords.

## Data

Company fleet and parts-store rows are seeded automatically. Sample jobs are created the first time an admin profile is established so the dashboard is not empty.

## Job flow

`Pending → Accepted → In Workshop → Work Complete → Delivered` (or `Rejected` from Pending). Every change is written to the audit log.
