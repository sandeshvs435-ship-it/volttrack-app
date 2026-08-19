import type { Vehicle, Alert, Contract, Invoice, SocHistoryPoint, DegradationPoint } from './types';

const STORAGE_KEY = 'volttrack_data_v1';

interface DatabaseShape {
  vehicles: Vehicle[];
  alerts: Alert[];
  contracts: Contract[];
  invoices: Invoice[];
  soc_history: SocHistoryPoint[];
  degradation_history: DegradationPoint[];
}

function genId(): string {
  return Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
}

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3600000).toISOString();
}

function daysAgo(d: number): string {
  return new Date(Date.now() - d * 86400000).toISOString();
}

function dateOffset(days: number): string {
  return new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
}

function seedVehicles(): Vehicle[] {
  const cities = [
    { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { name: 'Delhi', lat: 28.7041, lng: 77.1025 },
  ];
  const models = ['Tata Nexon EV', 'MG ZS EV', 'Ather 450X'];
  const plates = [
    'KA01AB1234', 'KA02CD5678', 'MH01EF9012', 'MH02GH3456',
    'DL01IJ7890', 'DL02KL2345', 'KA03MN6789', 'MH03OP0123',
    'DL04QR4567', 'KA05ST8901', 'MH06UV2345', 'DL07WX6789',
  ];
  const statuses: Vehicle['status'][] = ['charging', 'idle', 'driving', 'alert'];
  const vehicles: Vehicle[] = [];

  for (let i = 0; i < 12; i++) {
    const city = cities[i % 3];
    const model = models[i % 3];
    const soc = Math.round((30 + Math.random() * 65) * 10) / 10;
    const health = Math.round((78 + Math.random() * 20) * 10) / 10;
    const temp = Math.round((24 + Math.random() * 18) * 10) / 10;
    const voltage = Math.round(370 + Math.random() * 40);
    let status = statuses[Math.floor(Math.random() * statuses.length)];
    if (soc < 25 || temp >= 40) status = 'alert';

    vehicles.push({
      id: genId(),
      name: `${model} #${String(i + 1).padStart(2, '0')}`,
      plate: plates[i],
      soc,
      health,
      temperature: temp,
      voltage,
      status,
      location_name: city.name,
      lat: city.lat + (Math.random() - 0.5) * 0.1,
      lng: city.lng + (Math.random() - 0.5) * 0.1,
      model,
      created_at: daysAgo(i * 5),
    });
  }
  return vehicles;
}

function seedAlerts(vehicles: Vehicle[]): Alert[] {
  const alerts: Alert[] = [];
  const templates: Array<Omit<Alert, 'id' | 'vehicle_id' | 'resolved' | 'created_at'>> = [
    { severity: 'critical', type: 'overheating', message: 'Battery temperature exceeded safe threshold' },
    { severity: 'critical', type: 'low_soc', message: 'State of charge critically low — immediate charging required' },
    { severity: 'warning', type: 'low_soc', message: 'SoC below 30% — schedule charging soon' },
    { severity: 'warning', type: 'degradation', message: 'Battery health degradation rate increasing' },
    { severity: 'warning', type: 'high_temp', message: 'Battery temperature above optimal range' },
    { severity: 'info', type: 'charging_complete', message: 'Vehicle fully charged and ready for dispatch' },
    { severity: 'info', type: 'charging_started', message: 'Charging session started at depot' },
    { severity: 'info', type: 'maintenance', message: 'Scheduled maintenance window approaching' },
  ];

  for (let i = 0; i < 18; i++) {
    const t = templates[i % templates.length];
    const v = vehicles[i % vehicles.length];
    alerts.push({
      id: genId(),
      vehicle_id: v.id,
      severity: t.severity,
      type: t.type,
      message: `${v.name} (${v.plate}): ${t.message}`,
      resolved: i >= 12,
      created_at: hoursAgo(i * 2 + Math.floor(Math.random() * 3)),
    });
  }
  return alerts;
}

function seedContracts(): Contract[] {
  return [
    { id: genId(), company: 'BluSmart Mobility', value: 4500000, vehicles: 120, status: 'active', start_date: dateOffset(-180), end_date: dateOffset(185) },
    { id: genId(), company: 'Lithium Urban Tech', value: 3200000, vehicles: 85, status: 'active', start_date: dateOffset(-90), end_date: dateOffset(275) },
    { id: genId(), company: 'Sun Mobility', value: 2800000, vehicles: 70, status: 'pending', start_date: dateOffset(15), end_date: dateOffset(380) },
    { id: genId(), company: 'Ola Electric Fleet', value: 5900000, vehicles: 150, status: 'active', start_date: dateOffset(-60), end_date: dateOffset(305) },
    { id: genId(), company: 'Mahindra Electric', value: 2100000, vehicles: 55, status: 'expired', start_date: dateOffset(-400), end_date: dateOffset(-35) },
    { id: genId(), company: 'Tata Motors Fleet', value: 3800000, vehicles: 95, status: 'pending', start_date: dateOffset(30), end_date: dateOffset(395) },
  ];
}

function seedInvoices(): Invoice[] {
  return [
    { id: genId(), company: 'BluSmart Mobility', amount: 99900, status: 'paid', date: dateOffset(-2), plan: 'Business' },
    { id: genId(), company: 'Lithium Urban Tech', amount: 74900, status: 'paid', date: dateOffset(-5), plan: 'Business' },
    { id: genId(), company: 'Sun Mobility', amount: 249900, status: 'pending', date: dateOffset(-1), plan: 'Enterprise' },
    { id: genId(), company: 'Ola Electric Fleet', amount: 124900, status: 'paid', date: dateOffset(-8), plan: 'Enterprise' },
    { id: genId(), company: 'Mahindra Electric', amount: 49900, status: 'overdue', date: dateOffset(-35), plan: 'Starter' },
    { id: genId(), company: 'Tata Motors Fleet', amount: 99900, status: 'pending', date: dateOffset(0), plan: 'Business' },
    { id: genId(), company: 'BluSmart Mobility', amount: 99900, status: 'paid', date: dateOffset(-32), plan: 'Business' },
    { id: genId(), company: 'Lithium Urban Tech', amount: 74900, status: 'paid', date: dateOffset(-35), plan: 'Business' },
  ];
}

function seedSocHistory(vehicles: Vehicle[]): SocHistoryPoint[] {
  const points: SocHistoryPoint[] = [];
  vehicles.forEach((v) => {
    let soc = v.soc;
    for (let h = 23; h >= 0; h--) {
      soc += (Math.random() - 0.5) * 8;
      soc = Math.max(10, Math.min(95, soc));
      points.push({
        id: genId(),
        vehicle_id: v.id,
        timestamp: new Date(Date.now() - h * 3600000).toISOString(),
        soc: Math.round(soc * 10) / 10,
      });
    }
  });
  return points;
}

function seedDegradation(vehicles: Vehicle[]): DegradationPoint[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const points: DegradationPoint[] = [];
  vehicles.forEach((v) => {
    let health = 100;
    months.forEach((month, idx) => {
      health -= 0.3 + Math.random() * 0.4;
      points.push({
        id: genId(),
        vehicle_id: v.id,
        month,
        health: Math.round((idx === months.length - 1 ? v.health : health) * 10) / 10,
      });
    });
  });
  return points;
}

function seedDatabase(): DatabaseShape {
  const vehicles = seedVehicles();
  return {
    vehicles,
    alerts: seedAlerts(vehicles),
    contracts: seedContracts(),
    invoices: seedInvoices(),
    soc_history: seedSocHistory(vehicles),
    degradation_history: seedDegradation(vehicles),
  };
}

function load(): DatabaseShape {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as DatabaseShape;
  } catch {
    // fall through to seed
  }
  const seeded = seedDatabase();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}

function save(db: DatabaseShape): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export function getTable<K extends keyof DatabaseShape>(name: K): DatabaseShape[K] {
  const db = load();
  return db[name];
}

export function insertRow<K extends keyof DatabaseShape>(
  name: K,
  row: DatabaseShape[K][number]
): DatabaseShape[K][number] {
  const db = load();
  (db[name] as unknown[]).unshift(row);
  save(db);
  return row;
}

export function updateRow<K extends keyof DatabaseShape>(
  name: K,
  id: string,
  patch: Partial<DatabaseShape[K][number]>
): void {
  const db = load();
  const list = db[name] as Array<{ id: string }>;
  const idx = list.findIndex((r) => r.id === id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...patch };
    save(db);
  }
}

export { genId };
