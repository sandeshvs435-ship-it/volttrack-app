export interface Vehicle {
  id: string;
  name: string;
  plate: string;
  soc: number;
  health: number;
  temperature: number;
  voltage: number;
  status: 'charging' | 'idle' | 'driving' | 'alert';
  location_name: string;
  lat: number;
  lng: number;
  model: string;
  created_at: string;
}

export interface Alert {
  id: string;
  vehicle_id: string | null;
  severity: 'critical' | 'warning' | 'info';
  type: string;
  message: string;
  resolved: boolean;
  created_at: string;
}

export interface Contract {
  id: string;
  company: string;
  value: number;
  vehicles: number;
  status: 'active' | 'pending' | 'expired';
  start_date: string;
  end_date: string;
}

export interface Invoice {
  id: string;
  company: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  date: string;
  plan: string;
}

export interface SocHistoryPoint {
  id: string;
  vehicle_id: string;
  timestamp: string;
  soc: number;
}

export interface DegradationPoint {
  id: string;
  vehicle_id: string;
  month: string;
  health: number;
}
