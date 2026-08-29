import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  TrendingUp,
  Truck,
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { supabase } from '@/lib/supabase';
import type { Contract } from '@/lib/types';
import { formatINR } from '@/lib/utils';

const statusConfig: Record<string, { color: string; bg: string; border: string; icon: typeof CheckCircle2; label: string }> = {
  active: { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: CheckCircle2, label: 'Active' },
  pending: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Clock, label: 'Pending' },
  expired: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: XCircle, label: 'Expired' },
};

export default function Contracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('contracts').select('*').order('value', { ascending: false });
      setContracts((data as Contract[]) || []);
      setLoading(false);
    })();
  }, []);

  const stats = useMemo(() => {
    const totalValue = contracts.reduce((a, c) => a + c.value, 0);
    const totalVehicles = contracts.reduce((a, c) => a + c.vehicles, 0);
    const activeCount = contracts.filter((c) => c.status === 'active').length;
    const pendingCount = contracts.filter((c) => c.status === 'pending').length;
    return { totalValue, totalVehicles, activeCount, pendingCount };
  }, [contracts]);

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
      <PageHeader title="Contracts" subtitle="Manage enterprise agreements with Indian fleet operators" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: 'Total Contract Value',
            value: formatINR(stats.totalValue),
            sub: 'across all contracts',
            icon: TrendingUp,
            color: '#22C55E',
            gradient: 'from-[#22C55E]/20 to-[#22C55E]/5',
          },
          {
            label: 'Vehicles Covered',
            value: stats.totalVehicles.toString(),
            sub: 'under contract',
            icon: Truck,
            color: '#3B82F6',
            gradient: 'from-[#3B82F6]/20 to-[#3B82F6]/5',
          },
          {
            label: 'Active Contracts',
            value: stats.activeCount.toString(),
            sub: 'currently running',
            icon: CheckCircle2,
            color: '#22C55E',
            gradient: 'from-[#22C55E]/20 to-[#22C55E]/5',
          },
          {
            label: 'Pending',
            value: stats.pendingCount.toString(),
            sub: 'awaiting signature',
            icon: Clock,
            color: '#F59E0B',
            gradient: 'from-[#F59E0B]/20 to-[#F59E0B]/5',
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card glass-card-hover p-5"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3`}>
              <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
            <p className="text-gray-600 text-xs mt-0.5">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Contract Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {contracts.map((contract, i) => {
          const config = statusConfig[contract.status];
          const progress = (() => {
            const start = new Date(contract.start_date).getTime();
            const end = new Date(contract.end_date).getTime();
            const now = Date.now();
            return Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
          })();

          return (
            <motion.div
              key={contract.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card glass-card-hover p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-[#3B82F6]" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base">{contract.company}</h3>
                    <p className="text-gray-500 text-xs">{contract.vehicles} vehicles covered</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 ${config.color} ${config.bg} ${config.border}`}>
                  <config.icon className="w-3.5 h-3.5" />
                  {config.label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-600 text-xs">Contract Value</p>
                  <p className="text-white font-bold text-xl">{formatINR(contract.value)}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">Duration</p>
                  <p className="text-white font-medium text-sm mt-1">
                    {new Date(contract.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {' → '}
                    {new Date(contract.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-gray-500 text-xs">Contract Progress</span>
                  <span className="text-gray-400 text-xs font-medium">{progress.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-[#0A0B0F] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ delay: i * 0.1 + 0.3, duration: 0.8 }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${config.color.includes('green') ? '#22C55E' : config.color.includes('amber') ? '#F59E0B' : '#EF4444'}, ${config.color.includes('green') ? '#3B82F6' : config.color.includes('amber') ? '#22C55E' : '#F59E0B'})` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0A0B0F] border border-white/10 text-gray-300 text-xs font-medium hover:border-white/20 transition-colors">
                  <FileText className="w-3.5 h-3.5" />
                  View Contract
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 text-xs font-medium hover:bg-[#3B82F6]/20 transition-colors">
                  <Calendar className="w-3.5 h-3.5" />
                  Renew
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
