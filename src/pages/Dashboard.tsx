import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Truck,
  BatteryCharging,
  AlertTriangle,
  IndianRupee,
  TrendingUp,
  Activity,
  Thermometer,
  Zap as ZapIcon,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import FleetMap from '@/components/FleetMap';
import { supabase } from '@/lib/supabase';
import type { Vehicle, Alert } from '@/lib/types';
import { formatINR, formatTime, getSocColor } from '@/lib/utils';

const tooltipStyle = {
  backgroundColor: '#13151C',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '0.75rem',
  color: 'white',
};

export default function Dashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [socHistory, setSocHistory] = useState<{ hour: string; avg_soc: number }[]>([]);
  const [statusData, setStatusData] = useState<{ name: string; value: number }[]>([]);
  const [mrr, setMrr] = useState(0);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const dateLabel = today.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const hour = today.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    (async () => {
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
      const [{ data: vehiclesData }, { data: alertsData }, { data: socData }, { data: invoiceData }] = await Promise.all([
        supabase.from('vehicles').select('*'),
        supabase.from('alerts').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('soc_history').select('timestamp, soc'),
        supabase.from('invoices').select('amount, status, created_at').gte('created_at', monthStart),
      ]);

      if (invoiceData) {
        const total = (invoiceData as { amount: number; status: string }[])
          .filter((r) => r.status === 'paid')
          .reduce((sum, r) => sum + Number(r.amount || 0), 0);
        setMrr(total);
      }

      if (vehiclesData) setVehicles(vehiclesData as Vehicle[]);
      if (alertsData) setAlerts(alertsData as Alert[]);

      if (socData && socData.length > 0) {
        // Group by hour and compute average
        const grouped: Record<string, { total: number; count: number }> = {};
        socData.forEach((row) => {
          const d = new Date(row.timestamp);
          const key = `${d.getHours()}:00`;
          if (!grouped[key]) grouped[key] = { total: 0, count: 0 };
          grouped[key].total += row.soc;
          grouped[key].count += 1;
        });
        const chartData = Object.entries(grouped)
          .map(([hour, val]) => ({ hour, avg_soc: val.total / val.count }))
          .slice(-12);
        setSocHistory(chartData);
      }

      if (vehiclesData) {
        const statusCounts: Record<string, number> = {};
        vehiclesData.forEach((v) => {
          statusCounts[v.status] = (statusCounts[v.status] || 0) + 1;
        });
        setStatusData(Object.entries(statusCounts).map(([name, value]) => ({ name, value })));
      }

      setLoading(false);
    })();
  }, []);

  const avgSoc = vehicles.length > 0 ? vehicles.reduce((a, v) => a + v.soc, 0) / vehicles.length : 0;
  const activeAlerts = alerts.filter((a) => !a.resolved).length;

  const kpis = [
    {
      label: 'Total Vehicles',
      value: vehicles.length.toString(),
      sub: 'across 3 cities',
      icon: Truck,
      color: '#3B82F6',
      gradient: 'from-[#3B82F6]/20 to-[#3B82F6]/5',
    },
    {
      label: 'Average SoC',
      value: `${avgSoc.toFixed(1)}%`,
      sub: 'fleet-wide charge',
      icon: BatteryCharging,
      color: '#22C55E',
      gradient: 'from-[#22C55E]/20 to-[#22C55E]/5',
    },
    {
      label: 'Active Alerts',
      value: activeAlerts.toString(),
      sub: `${alerts.filter((a) => a.severity === 'critical' && !a.resolved).length} critical`,
      icon: AlertTriangle,
      color: '#EF4444',
      gradient: 'from-[#EF4444]/20 to-[#EF4444]/5',
    },
    {
      label: 'Monthly Revenue',
      value: formatINR(mrr),
      sub: mrr > 0 ? 'MRR this month' : 'no paid invoices this month',
      icon: IndianRupee,
      color: '#F59E0B',
      gradient: 'from-[#F59E0B]/20 to-[#F59E0B]/5',
    },
  ];

  const severityColors: Record<string, string> = {
    critical: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
  };

  const statusColors: Record<string, string> = {
    charging: '#3B82F6',
    idle: '#6B7280',
    driving: '#22C55E',
    alert: '#EF4444',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-3 border-[#3B82F6]/30 border-t-[#3B82F6] rounded-full"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">{greeting}, Fleet Manager</h1>
        <p className="text-gray-500 text-sm mt-1">{dateLabel} · Real-time fleet battery intelligence</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="glass-card glass-card-hover p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${kpi.gradient} flex items-center justify-center`}>
                <kpi.icon className="w-6 h-6" style={{ color: kpi.color }} />
              </div>
              <TrendingUp className="w-4 h-4 text-gray-600" />
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-white">{kpi.value}</p>
            <p className="text-gray-400 text-sm mt-1">{kpi.label}</p>
            <p className="text-gray-600 text-xs mt-0.5">{kpi.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Map + Alert Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="lg:col-span-2 glass-card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-white font-bold text-lg">Fleet Map</h2>
              <p className="text-gray-500 text-xs">Live vehicle locations across India</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-gray-400">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" /> Healthy
              </span>
              <span className="flex items-center gap-1.5 text-gray-400">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" /> Low
              </span>
              <span className="flex items-center gap-1.5 text-gray-400">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" /> Critical
              </span>
            </div>
          </div>
          <FleetMap vehicles={vehicles} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="glass-card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-lg">Live Alert Feed</h2>
            <span className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium">
              {activeAlerts} active
            </span>
          </div>
          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
            {alerts.map((alert, i) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-3 rounded-xl border ${
                  alert.severity === 'critical'
                    ? 'border-red-500/20 bg-red-500/5'
                    : alert.severity === 'warning'
                    ? 'border-amber-500/20 bg-amber-500/5'
                    : 'border-blue-500/20 bg-blue-500/5'
                } ${!alert.resolved && alert.severity === 'critical' ? 'animate-pulse' : ''}`}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: severityColors[alert.severity] }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium leading-snug">{alert.message}</p>
                    <p className="text-gray-500 text-xs mt-1">{formatTime(alert.created_at)}</p>
                  </div>
                  {alert.resolved && (
                    <span className="text-green-400 text-xs font-medium flex-shrink-0">Resolved</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="lg:col-span-2 glass-card p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-[#3B82F6]" />
            <h2 className="text-white font-bold text-lg">Fleet SoC Trend (Last 12 Hours)</h2>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={socHistory}>
              <defs>
                <linearGradient id="socGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" stroke="#6B7280" fontSize={11} />
              <YAxis stroke="#6B7280" fontSize={11} domain={[0, 100]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                type="monotone"
                dataKey="avg_soc"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="url(#socGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <ZapIcon className="w-5 h-5 text-[#22C55E]" />
            <h2 className="text-white font-bold text-lg">Vehicle Status</h2>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {statusData.map((entry) => (
                  <Cell key={entry.name} fill={statusColors[entry.name] || '#6B7280'} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {statusData.map((s) => (
              <span key={s.name} className="flex items-center gap-1.5 text-gray-400 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: statusColors[s.name] }} />
                {s.name} ({s.value})
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Temperature & Health Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Thermometer className="w-5 h-5 text-[#EF4444]" />
            <h2 className="text-white font-bold text-lg">Battery Temperature by Vehicle</h2>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={vehicles.slice(0, 10).map((v) => ({ name: v.plate, temp: v.temperature }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#6B7280" fontSize={9} angle={-30} textAnchor="end" height={50} />
              <YAxis stroke="#6B7280" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="temp" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <BatteryCharging className="w-5 h-5 text-[#22C55E]" />
            <h2 className="text-white font-bold text-lg">Battery Health by Vehicle</h2>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={vehicles.slice(0, 10).map((v) => ({ name: v.plate, health: v.health }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#6B7280" fontSize={9} angle={-30} textAnchor="end" height={50} />
              <YAxis stroke="#6B7280" fontSize={11} domain={[70, 100]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="health" fill="#22C55E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
