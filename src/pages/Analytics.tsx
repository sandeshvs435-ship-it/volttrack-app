import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingDown, Activity, Calendar, Zap } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { supabase } from '@/lib/supabase';
import type { Vehicle, SocHistoryPoint, DegradationPoint } from '@/lib/types';

const tooltipStyle = {
  backgroundColor: '#13151C',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '0.75rem',
  color: 'white',
};

const vehicleColors = [
  '#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6',
  '#06B6D4', '#EC4899', '#F97316', '#84CC16', '#14B8A6',
];

export default function Analytics() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [socData, setSocData] = useState<Record<string, SocHistoryPoint[]>>({});
  const [degradationData, setDegradationData] = useState<Record<string, DegradationPoint[]>>({});
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: vehiclesData } = await supabase.from('vehicles').select('*');
      const vehicleList = (vehiclesData as Vehicle[]) || [];
      setVehicles(vehicleList);

      const topVehicles = vehicleList.slice(0, 5);
      setSelectedVehicles(topVehicles.map((v) => v.id));

      const socMap: Record<string, SocHistoryPoint[]> = {};
      const degMap: Record<string, DegradationPoint[]> = {};

      for (const v of vehicleList) {
        const { data: soc } = await supabase
          .from('soc_history')
          .select('*')
          .eq('vehicle_id', v.id)
          .order('timestamp', { ascending: true });
        socMap[v.id] = (soc as SocHistoryPoint[]) || [];

        const { data: deg } = await supabase
          .from('degradation_history')
          .select('*')
          .eq('vehicle_id', v.id)
          .order('id', { ascending: true });
        degMap[v.id] = (deg as DegradationPoint[]) || [];
      }

      setSocData(socMap);
      setDegradationData(degMap);
      setLoading(false);
    })();
  }, []);

  // Build chart data for multi-vehicle SoC
  const socChartData = useMemo(() => {
    if (selectedVehicles.length === 0) return [];
    const maxPoints = Math.max(...selectedVehicles.map((id) => socData[id]?.length || 0));
    if (maxPoints === 0) return [];

    const chart: Array<Record<string, number | string>> = [];
    for (let i = 0; i < maxPoints; i++) {
      const point: Record<string, number | string> = {};
      const firstVehicle = socData[selectedVehicles[0]];
      if (firstVehicle && firstVehicle[i]) {
        const d = new Date(firstVehicle[i].timestamp);
        point.time = `${d.getHours()}:00`;
      }
      selectedVehicles.forEach((id) => {
        const data = socData[id];
        if (data && data[i]) {
          point[id] = Math.round(data[i].soc * 10) / 10;
        }
      });
      chart.push(point);
    }
    return chart;
  }, [socData, selectedVehicles]);

  // Build degradation chart data
  const degradationChartData = useMemo(() => {
    if (selectedVehicles.length === 0) return [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month) => {
      const point: Record<string, number | string> = { month };
      selectedVehicles.forEach((id) => {
        const data = degradationData[id];
        const entry = data?.find((d) => d.month === month);
        if (entry) point[id] = Math.round(entry.health * 10) / 10;
      });
      return point;
    });
  }, [degradationData, selectedVehicles]);

  // Build charge heatmap (7 days x 24 hours)
  const heatmapData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day) => ({
      day,
      hours: Array.from({ length: 24 }, (_, h) => {
        // Simulate charging intensity — higher during night hours and early morning
        const baseIntensity = (h >= 22 || h <= 6) ? 0.8 : h >= 14 && h <= 17 ? 0.5 : 0.3;
        return Math.min(1, baseIntensity + Math.random() * 0.2);
      }),
    }));
  }, []);

  const getHeatmapColor = (intensity: number): string => {
    if (intensity < 0.2) return 'rgba(59, 130, 246, 0.05)';
    if (intensity < 0.4) return 'rgba(59, 130, 246, 0.15)';
    if (intensity < 0.6) return 'rgba(59, 130, 246, 0.3)';
    if (intensity < 0.8) return 'rgba(34, 197, 94, 0.5)';
    return 'rgba(34, 197, 94, 0.8)';
  };

  const toggleVehicle = (id: string) => {
    setSelectedVehicles((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
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
      <PageHeader title="Analytics" subtitle="Deep battery insights across your fleet" />

      {/* Vehicle selector */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 mb-6"
      >
        <p className="text-gray-400 text-xs font-medium mb-3">Select vehicles to compare ({selectedVehicles.length} selected)</p>
        <div className="flex flex-wrap gap-2">
          {vehicles.map((v, i) => {
            const selected = selectedVehicles.includes(v.id);
            const color = vehicleColors[i % vehicleColors.length];
            return (
              <button
                key={v.id}
                onClick={() => toggleVehicle(v.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  selected
                    ? 'border'
                    : 'bg-[#0A0B0F] text-gray-500 border border-white/5'
                }`}
                style={selected ? { backgroundColor: `${color}15`, color, borderColor: `${color}30` } : {}}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selected ? color : '#374151' }} />
                {v.name}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* SoC Time Series */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-5 mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-[#3B82F6]" />
          <h2 className="text-white font-bold text-lg">Multi-Vehicle SoC Time Series</h2>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={socChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="time" stroke="#6B7280" fontSize={11} />
            <YAxis stroke="#6B7280" fontSize={11} domain={[0, 100]} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend
              wrapperStyle={{ fontSize: 11 }}
              formatter={(value) => {
                const v = vehicles.find((veh) => veh.id === value);
                return v ? v.name : value;
              }}
            />
            {selectedVehicles.map((id, i) => {
              const color = vehicleColors[vehicles.findIndex((v) => v.id === id) % vehicleColors.length];
              return (
                <Line
                  key={id}
                  type="monotone"
                  dataKey={id}
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Degradation Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-5 mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="w-5 h-5 text-[#EF4444]" />
          <h2 className="text-white font-bold text-lg">Battery Degradation Over Time</h2>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={degradationChartData}>
            <defs>
              {selectedVehicles.map((id, i) => {
                const color = vehicleColors[vehicles.findIndex((v) => v.id === id) % vehicleColors.length];
                return (
                  <linearGradient key={id} id={`deg-${id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                );
              })}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" stroke="#6B7280" fontSize={11} />
            <YAxis stroke="#6B7280" fontSize={11} domain={[70, 100]} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend
              wrapperStyle={{ fontSize: 11 }}
              formatter={(value) => {
                const v = vehicles.find((veh) => veh.id === value);
                return v ? v.name : value;
              }}
            />
            {selectedVehicles.map((id) => {
              const color = vehicleColors[vehicles.findIndex((v) => v.id === id) % vehicleColors.length];
              return (
                <Area
                  key={id}
                  type="monotone"
                  dataKey={id}
                  stroke={color}
                  strokeWidth={2}
                  fill={`url(#deg-${id})`}
                />
              );
            })}
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Charge Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-[#22C55E]" />
          <h2 className="text-white font-bold text-lg">Charging Pattern Heatmap</h2>
          <span className="text-gray-500 text-xs ml-2">(Last 7 days)</span>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Hour labels */}
            <div className="flex gap-1 ml-12 mb-1">
              {Array.from({ length: 24 }, (_, h) => (
                <div key={h} className="flex-1 text-center text-gray-600 text-[9px]">
                  {h % 3 === 0 ? `${h}` : ''}
                </div>
              ))}
            </div>
            {/* Heatmap rows */}
            {heatmapData.map((row) => (
              <div key={row.day} className="flex items-center gap-1 mb-1">
                <div className="w-10 text-gray-400 text-xs font-medium">{row.day}</div>
                <div className="flex gap-1 flex-1">
                  {row.hours.map((intensity, h) => (
                    <motion.div
                      key={h}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: h * 0.005 }}
                      className="flex-1 aspect-square rounded-sm min-w-[16px]"
                      style={{ backgroundColor: getHeatmapColor(intensity) }}
                      title={`${row.day} ${h}:00 — Intensity: ${(intensity * 100).toFixed(0)}%`}
                    />
                  ))}
                </div>
              </div>
            ))}
            {/* Legend */}
            <div className="flex items-center gap-2 mt-3 ml-12">
              <span className="text-gray-600 text-xs">Less</span>
              {[0.1, 0.3, 0.5, 0.7, 0.9].map((i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-sm"
                  style={{ backgroundColor: getHeatmapColor(i) }}
                />
              ))}
              <span className="text-gray-600 text-xs">More</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
