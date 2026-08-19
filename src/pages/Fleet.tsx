import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, ArrowUpDown, X, MapPin, Thermometer, Zap, Battery } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import BatteryGauge from '@/components/BatteryGauge';
import { supabase } from '@/lib/supabase';
import type { Vehicle } from '@/lib/types';
import { getHealthColor, getTempColor } from '@/lib/utils';

type SortKey = 'name' | 'plate' | 'soc' | 'health' | 'temperature' | 'status';
type SortDir = 'asc' | 'desc';

const vehicleModels = ['Tata Nexon EV', 'MG ZS EV', 'Ather 450X'];
const cities = [
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Delhi', lat: 28.7041, lng: 77.1025 },
];
const platePrefixes = ['KA01', 'KA02', 'MH01', 'MH02', 'DL01', 'DL02'];

export default function Fleet() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Form state
  const [form, setForm] = useState({
    name: '',
    model: 'Tata Nexon EV',
    plate: '',
    location_name: 'Bangalore',
    soc: 80,
    health: 95,
    temperature: 28,
    voltage: 396,
    status: 'idle' as Vehicle['status'],
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    const { data } = await supabase.from('vehicles').select('*').order('name');
    setVehicles((data as Vehicle[]) || []);
    setLoading(false);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filtered = useMemo(() => {
    let result = vehicles;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (v) => v.name.toLowerCase().includes(q) || v.plate.toLowerCase().includes(q)
      );
    }
    if (filterStatus !== 'all') {
      result = result.filter((v) => v.status === filterStatus);
    }
    result = [...result].sort((a, b) => {
      let cmp = 0;
      if (typeof a[sortKey] === 'number' && typeof b[sortKey] === 'number') {
        cmp = (a[sortKey] as number) - (b[sortKey] as number);
      } else {
        cmp = String(a[sortKey]).localeCompare(String(b[sortKey]));
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [vehicles, search, sortKey, sortDir, filterStatus]);

  const handleAddVehicle = async () => {
    const city = cities.find((c) => c.name === form.location_name) || cities[0];
    const newVehicle = {
      ...form,
      lat: city.lat + (Math.random() - 0.5) * 0.1,
      lng: city.lng + (Math.random() - 0.5) * 0.1,
    };
    await supabase.from('vehicles').insert(newVehicle);
    setShowModal(false);
    setForm({
      name: '',
      model: 'Tata Nexon EV',
      plate: '',
      location_name: 'Bangalore',
      soc: 80,
      health: 95,
      temperature: 28,
      voltage: 396,
      status: 'idle',
    });
    fetchVehicles();
  };

  const generateRandomPlate = () => {
    const prefix = platePrefixes[Math.floor(Math.random() * platePrefixes.length)];
    const chars = 'ABCDEFGH';
    const mid = chars[Math.floor(Math.random() * chars.length)] + chars[Math.floor(Math.random() * chars.length)];
    const num = Math.floor(1000 + Math.random() * 9000);
    setForm({ ...form, plate: `${prefix}${mid}${num}` });
  };

  const statusColors: Record<string, string> = {
    charging: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    idle: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    driving: 'bg-green-500/10 text-green-400 border-green-500/20',
    alert: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <div>
      <PageHeader
        title="Fleet Management"
        subtitle={`${vehicles.length} vehicles across Bangalore, Mumbai & Delhi`}
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="gradient-btn flex items-center gap-2 px-5 py-2.5 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Vehicle
          </button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or plate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#13151C] border border-white/5 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#3B82F6]/30 transition-colors"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {['all', 'charging', 'idle', 'driving', 'alert'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2.5 rounded-xl text-xs font-medium capitalize transition-all whitespace-nowrap ${
                filterStatus === s
                  ? 'bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30'
                  : 'bg-[#13151C] text-gray-400 border border-white/5 hover:border-white/10'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {[
                  { key: 'name' as SortKey, label: 'Vehicle' },
                  { key: 'plate' as SortKey, label: 'Plate' },
                  { key: 'soc' as SortKey, label: 'SoC' },
                  { key: 'health' as SortKey, label: 'Health' },
                  { key: 'temperature' as SortKey, label: 'Temp' },
                  { key: 'status' as SortKey, label: 'Status' },
                ].map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="text-left px-5 py-4 text-xs font-medium text-gray-400 cursor-pointer hover:text-white transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      {col.label}
                      <ArrowUpDown
                        className={`w-3 h-3 ${sortKey === col.key ? 'text-[#3B82F6]' : 'text-gray-600'}`}
                      />
                    </span>
                  </th>
                ))}
                <th className="text-left px-5 py-4 text-xs font-medium text-gray-400">Location</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v, i) => (
                <motion.tr
                  key={v.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center flex-shrink-0">
                        <Battery className="w-4 h-4 text-[#3B82F6]" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{v.name}</p>
                        <p className="text-gray-600 text-xs">{v.model}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-gray-300 text-sm font-mono">{v.plate}</span>
                  </td>
                  <td className="px-5 py-4">
                    <BatteryGauge soc={v.soc} size={44} />
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium" style={{ color: getHealthColor(v.health) }}>
                      {Math.round(v.health)}%
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium" style={{ color: getTempColor(v.temperature) }}>
                      {v.temperature.toFixed(1)}°C
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border capitalize ${statusColors[v.status]}`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1.5 text-gray-400 text-xs">
                      <MapPin className="w-3.5 h-3.5" />
                      {v.location_name}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-gray-500 text-sm">No vehicles found matching your filters.</p>
          </div>
        )}
      </motion.div>

      {/* Add Vehicle Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/60 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 max-h-[90vh] overflow-y-auto"
            >
              <div className="glass-card p-6 m-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Add New Vehicle</h2>
                  <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-xs font-medium mb-1.5 block">Vehicle Name</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Tata Nexon EV #08"
                        className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#3B82F6]/30"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs font-medium mb-1.5 block">Model</label>
                      <select
                        value={form.model}
                        onChange={(e) => setForm({ ...form, model: e.target.value })}
                        className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6]/30"
                      >
                        {vehicleModels.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-xs font-medium mb-1.5 block">License Plate</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={form.plate}
                          onChange={(e) => setForm({ ...form, plate: e.target.value.toUpperCase() })}
                          placeholder="KA01AB1234"
                          className="flex-1 bg-[#0A0B0F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder:text-gray-600 focus:outline-none focus:border-[#3B82F6]/30"
                        />
                        <button
                          onClick={generateRandomPlate}
                          className="px-3 rounded-xl bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 text-xs font-medium hover:bg-[#3B82F6]/20 transition-colors"
                        >
                          Auto
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs font-medium mb-1.5 block">Location</label>
                      <select
                        value={form.location_name}
                        onChange={(e) => setForm({ ...form, location_name: e.target.value })}
                        className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6]/30"
                      >
                        {cities.map((c) => (
                          <option key={c.name} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-gray-400 text-xs font-medium mb-1.5 block">SoC (%)</label>
                      <input
                        type="number"
                        value={form.soc}
                        onChange={(e) => setForm({ ...form, soc: Number(e.target.value) })}
                        min={0}
                        max={100}
                        className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6]/30"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs font-medium mb-1.5 block">Health (%)</label>
                      <input
                        type="number"
                        value={form.health}
                        onChange={(e) => setForm({ ...form, health: Number(e.target.value) })}
                        min={0}
                        max={100}
                        className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6]/30"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs font-medium mb-1.5 block">Temp (°C)</label>
                      <input
                        type="number"
                        value={form.temperature}
                        onChange={(e) => setForm({ ...form, temperature: Number(e.target.value) })}
                        className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6]/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-400 text-xs font-medium mb-1.5 block">Status</label>
                    <div className="flex gap-2">
                      {(['idle', 'charging', 'driving', 'alert'] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => setForm({ ...form, status: s })}
                          className={`flex-1 px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
                            form.status === s
                              ? 'bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30'
                              : 'bg-[#0A0B0F] text-gray-400 border border-white/10'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 rounded-xl bg-[#0A0B0F] border border-white/10 text-gray-400 text-sm font-medium hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddVehicle}
                    disabled={!form.name || !form.plate}
                    className="flex-1 gradient-btn py-3 text-sm disabled:opacity-50"
                  >
                    Add Vehicle
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
