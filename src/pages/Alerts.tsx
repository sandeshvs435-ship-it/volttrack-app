import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Filter,
  Bell,
  X,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { supabase } from '@/lib/supabase';
import type { Alert, Vehicle } from '@/lib/types';
import { formatTime } from '@/lib/utils';

const severityConfig = {
  critical: {
    icon: AlertCircle,
    color: '#EF4444',
    bg: 'bg-red-500/5',
    border: 'border-red-500/20',
    text: 'text-red-400',
    badge: 'bg-red-500',
  },
  warning: {
    icon: AlertTriangle,
    color: '#F59E0B',
    bg: 'bg-amber-500/5',
    border: 'border-amber-500/20',
    text: 'text-amber-400',
    badge: 'bg-amber-500',
  },
  info: {
    icon: Info,
    color: '#3B82F6',
    bg: 'bg-blue-500/5',
    border: 'border-blue-500/20',
    text: 'text-blue-400',
    badge: 'bg-blue-500',
  },
};

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [vehicles, setVehicles] = useState<Record<string, Vehicle>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [showUnresolvedOnly, setShowUnresolvedOnly] = useState(false);

  useEffect(() => {
    (async () => {
      const [{ data: alertsData }, { data: vehiclesData }] = await Promise.all([
        supabase.from('alerts').select('*').order('created_at', { ascending: false }),
        supabase.from('vehicles').select('*'),
      ]);

      setAlerts((alertsData as Alert[]) || []);
      const vehicleMap: Record<string, Vehicle> = {};
      (vehiclesData as Vehicle[])?.forEach((v) => {
        vehicleMap[v.id] = v;
      });
      setVehicles(vehicleMap);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    let result = alerts;
    if (filter !== 'all') {
      result = result.filter((a) => a.severity === filter);
    }
    if (showUnresolvedOnly) {
      result = result.filter((a) => !a.resolved);
    }
    return result;
  }, [alerts, filter, showUnresolvedOnly]);

  const stats = useMemo(() => {
    return {
      critical: alerts.filter((a) => a.severity === 'critical' && !a.resolved).length,
      warning: alerts.filter((a) => a.severity === 'warning' && !a.resolved).length,
      info: alerts.filter((a) => a.severity === 'info' && !a.resolved).length,
      resolved: alerts.filter((a) => a.resolved).length,
    };
  }, [alerts]);

  const handleResolve = async (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, resolved: true } : a)));
    await supabase.from('alerts').update({ resolved: true }).eq('id', id);
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
      <PageHeader
        title="Alerts"
        subtitle={`${stats.critical + stats.warning + stats.info} active alerts requiring attention`}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {([
          { label: 'Critical', value: stats.critical, config: severityConfig.critical, bg: severityConfig.critical.bg, border: severityConfig.critical.border, pulse: true },
          { label: 'Warnings', value: stats.warning, config: severityConfig.warning, bg: severityConfig.warning.bg, border: severityConfig.warning.border, pulse: false },
          { label: 'Info', value: stats.info, config: severityConfig.info, bg: severityConfig.info.bg, border: severityConfig.info.border, pulse: false },
          { label: 'Resolved', value: stats.resolved, config: { ...severityConfig.info, color: '#22C55E', text: 'text-green-400' }, bg: 'bg-green-500/5', border: 'border-green-500/20', pulse: false },
        ] as const).map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-card p-4 ${stat.bg} border ${stat.border}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className={`text-xs ${stat.config.text} mt-0.5`}>{stat.label}</p>
              </div>
              <div className="relative">
                <stat.config.icon className="w-8 h-8" style={{ color: stat.config.color }} />
                {stat.pulse && stat.value > 0 && (
                  <motion.span
                    animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: stat.config.color }}
                  />
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-2 overflow-x-auto">
          {['all', 'critical', 'warning', 'info'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2.5 rounded-xl text-xs font-medium capitalize transition-all whitespace-nowrap ${
                filter === s
                  ? 'bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30'
                  : 'bg-[#13151C] text-gray-400 border border-white/5 hover:border-white/10'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowUnresolvedOnly(!showUnresolvedOnly)}
          className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
            showUnresolvedOnly
              ? 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30'
              : 'bg-[#13151C] text-gray-400 border border-white/5'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          Unresolved Only
        </button>
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((alert, i) => {
            const config = severityConfig[alert.severity];
            const vehicle = alert.vehicle_id ? vehicles[alert.vehicle_id] : null;

            return (
              <motion.div
                key={alert.id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`glass-card p-4 border ${config.border} ${config.bg} ${
                  !alert.resolved && alert.severity === 'critical' ? 'ring-1 ring-red-500/20' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${config.color}15` }}
                    >
                      <config.icon className="w-5 h-5" style={{ color: config.color }} />
                    </div>
                    {!alert.resolved && alert.severity === 'critical' && (
                      <motion.span
                        animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 rounded-xl"
                        style={{ backgroundColor: config.color }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium uppercase tracking-wide ${config.text}`}>
                        {alert.severity}
                      </span>
                      <span className="text-gray-600 text-xs">·</span>
                      <span className="text-gray-500 text-xs capitalize">{alert.type.replace(/_/g, ' ')}</span>
                      {vehicle && (
                        <>
                          <span className="text-gray-600 text-xs">·</span>
                          <span className="text-gray-400 text-xs font-mono">{vehicle.plate}</span>
                        </>
                      )}
                    </div>
                    <p className="text-white text-sm">{alert.message}</p>
                    <p className="text-gray-600 text-xs mt-1">{formatTime(alert.created_at)}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0">
                    {alert.resolved ? (
                      <span className="flex items-center gap-1.5 text-green-400 text-xs font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Resolved
                      </span>
                    ) : (
                      <button
                        onClick={() => handleResolve(alert.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 text-xs font-medium hover:bg-[#22C55E]/20 transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="glass-card py-16 text-center">
          <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No alerts matching your filters.</p>
        </div>
      )}
    </div>
  );
}
