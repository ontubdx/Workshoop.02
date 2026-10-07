-- Workshop Management System schema + company fleet/inventory seed.
-- Per-user rows use TEXT user ids (Better Auth). Role lives in profiles.

create table if not exists profiles (
  user_id     text primary key,
  name        text not null,
  email       text,
  phone       text,
  role        text not null check (role in ('admin','manager','mechanic','vehicle_user','viewer')),
  department  text,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists vehicles (
  id                  text primary key,
  registration_no     text not null unique,
  type                text not null,
  brand               text,
  model               text,
  department          text,
  assigned_driver     text,
  status              text not null default 'active',
  odometer_km         integer,
  service_interval_km integer,
  last_service_km     integer,
  last_service_at     date,
  imported_from_csv   boolean not null default false,
  created_at          timestamptz not null default now()
);

create table if not exists workshop_requests (
  id                      text primary key,
  vehicle_id              text not null references vehicles(id),
  requested_by            text not null,
  problem_description     text not null,
  photo_urls              text,
  priority                text not null default 'normal' check (priority in ('urgent','normal')),
  status                  text not null default 'pending'
                            check (status in ('pending','accepted','rejected','in_workshop','work_complete','delivered')),
  entry_date              date,
  tentative_delivery_date date,
  actual_delivery_date    date,
  assigned_mechanic       text,
  mechanic_status         text default 'not_started'
                            check (mechanic_status in ('not_started','in_progress','done')),
  rejection_reason        text,
  rating                  integer check (rating is null or (rating >= 1 and rating <= 5)),
  feedback                text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists workshop_requests_status_idx on workshop_requests (status);
create index if not exists workshop_requests_requested_by_idx on workshop_requests (requested_by);
create index if not exists workshop_requests_mechanic_idx on workshop_requests (assigned_mechanic);
create index if not exists workshop_requests_vehicle_idx on workshop_requests (vehicle_id);

create table if not exists job_work_items (
  id          text primary key,
  request_id  text not null references workshop_requests(id) on delete cascade,
  description text not null,
  created_at  timestamptz not null default now()
);

create table if not exists job_parts (
  id          text primary key,
  request_id  text not null references workshop_requests(id) on delete cascade,
  name        text not null,
  source      text not null check (source in ('store','external')),
  vendor      text,
  unit_price  numeric not null default 0,
  qty         numeric not null default 1,
  total_price numeric not null default 0,
  inventory_id text,
  created_at  timestamptz not null default now()
);

create table if not exists job_costs (
  request_id  text primary key references workshop_requests(id) on delete cascade,
  labor_cost  numeric not null default 0,
  total_cost  numeric not null default 0,
  updated_at  timestamptz not null default now()
);

create table if not exists notifications (
  id          text primary key,
  to_user_id  text not null,
  request_id  text,
  message     text not null,
  type        text not null,
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists notifications_user_idx on notifications (to_user_id, read);

create table if not exists audit_log (
  id                 text primary key,
  user_id            text not null,
  action             text not null,
  target_collection  text not null,
  target_id          text,
  details            text,
  created_at         timestamptz not null default now()
);

create index if not exists audit_log_created_idx on audit_log (created_at desc);

create table if not exists inventory (
  id            text primary key,
  part_name     text not null,
  stock_qty     numeric not null default 0,
  reorder_level numeric not null default 0,
  unit          text not null default 'pcs',
  unit_price    numeric not null default 0
);

create table if not exists bootstrap_state (
  key   text primary key,
  value text not null
);

insert into vehicles (
  id, registration_no, type, brand, model, department, assigned_driver,
  status, odometer_km, service_interval_km, last_service_km, last_service_at
) values
  ('veh_01', 'DHAKA-GA-14-2291', 'Van', 'Toyota', 'Hiace', 'Hatchery', 'Karim Uddin', 'active', 128400, 5000, 124100, '2026-07-12'),
  ('veh_02', 'DHAKA-THA-11-8834', 'Truck', 'Tata', 'LPT 1613', 'Feed Mill', 'Shahidul Islam', 'active', 214800, 8000, 208200, '2026-06-03'),
  ('veh_03', 'GAZIPUR-GA-12-4412', 'Pickup', 'Mitsubishi', 'L200', 'Broiler Farm', 'Rafiqul Hasan', 'active', 89200, 5000, 84100, '2026-05-18'),
  ('veh_04', 'SAVAR-GA-15-1028', 'Van', 'Toyota', 'Hiace', 'Layer Farm', 'Nasir Ahmed', 'active', 156300, 5000, 155900, '2026-08-21'),
  ('veh_05', 'DHAKA-KHA-13-5567', 'Motorcycle', 'Honda', 'CB150', 'Transport', 'Jewel Mia', 'active', 41200, 3000, 39000, '2026-07-02'),
  ('veh_06', 'NARAYANGANJ-GA-16-7743', 'Truck', 'Isuzu', 'NPR', 'Hatchery', 'Abdul Latif', 'active', 187500, 8000, 179000, '2026-04-14'),
  ('veh_07', 'DHAKA-GA-18-3309', 'Car', 'Toyota', 'Axio', 'Admin', 'Farhana Akter', 'active', 64300, 5000, 61200, '2026-08-01'),
  ('veh_08', 'TANGAIL-THA-10-2190', 'Truck', 'Ashok Leyland', '1616', 'Feed Mill', 'Mizanur Rahman', 'active', 301200, 8000, 292000, '2026-03-22'),
  ('veh_09', 'DHAKA-GA-19-6612', 'Van', 'Suzuki', 'Carry', 'Layer Farm', 'Shakil Hossain', 'active', 52800, 5000, 48100, '2026-06-29'),
  ('veh_10', 'MYMENSINGH-GA-11-4480', 'Pickup', 'Mahindra', 'Bolero', 'Broiler Farm', 'Tuhin Sarkar', 'active', 110400, 5000, 109800, '2026-08-30'),
  ('veh_11', 'DHAKA-THA-17-9901', 'Truck', 'Tata', 'LPT 1109', 'Feed Mill', 'Jahangir Alam', 'active', 176900, 8000, 168400, '2026-05-09'),
  ('veh_12', 'GAZIPUR-GA-20-1144', 'Van', 'Toyota', 'Hiace', 'Hatchery', 'Rina Begum', 'active', 73400, 5000, 68200, '2026-07-19')
on conflict (id) do nothing;

insert into inventory (id, part_name, stock_qty, reorder_level, unit, unit_price) values
  ('inv_01', 'Engine oil 15W-40', 48, 12, 'L', 420),
  ('inv_02', 'Air filter (Hiace)', 9, 4, 'pcs', 1850),
  ('inv_03', 'Brake pad set (front)', 6, 3, 'set', 4200),
  ('inv_04', 'Clutch plate', 4, 2, 'pcs', 7800),
  ('inv_05', 'Battery 12V 70Ah', 5, 2, 'pcs', 12500),
  ('inv_06', 'Tyre 7.50-16', 8, 4, 'pcs', 14500),
  ('inv_07', 'Spark plug', 24, 8, 'pcs', 320),
  ('inv_08', 'Coolant', 30, 10, 'L', 280),
  ('inv_09', 'Alternator belt', 7, 3, 'pcs', 950),
  ('inv_10', 'Fuel filter', 11, 4, 'pcs', 1100),
  ('inv_11', 'Wheel bearing', 6, 2, 'pcs', 2400),
  ('inv_12', 'Headlight bulb H4', 16, 6, 'pcs', 450),
  ('inv_13', 'Hydraulic hose', 5, 2, 'm', 680),
  ('inv_14', 'Radiator (NPR)', 2, 1, 'pcs', 18500),
  ('inv_15', 'Brake fluid DOT-4', 14, 4, 'L', 390),
  ('inv_16', 'AC compressor gas R134a', 3, 2, 'can', 2200)
on conflict (id) do nothing;
