import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  IndianRupee,
  Check,
  TrendingUp,
  Download,
  CreditCard,
  Zap,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import PageHeader from '@/components/PageHeader';
import { supabase } from '@/lib/supabase';
import type { Invoice } from '@/lib/types';
import { formatINR, formatINRShort } from '@/lib/utils';

const tooltipStyle = {
  backgroundColor: '#13151C',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '0.75rem',
  color: 'white',
};

const plans = [
  {
    name: 'Starter',
    price: 2999,
    description: 'For small fleets getting started',
    features: [
      'Up to 5 vehicles',
      'Real-time SoC monitoring',
      'Basic alert system',
      'Email notifications',
      '7-day data history',
    ],
    color: '#3B82F6',
    popular: false,
  },
  {
    name: 'Business',
    price: 9999,
    description: 'For growing fleet operations',
    features: [
      'Up to 20 vehicles',
      'Advanced analytics & charts',
      'Priority alert system',
      'SMS + Email notifications',
      '90-day data history',
      'API access',
      'Custom dashboards',
    ],
    color: '#22C55E',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 24999,
    description: 'For large-scale fleet management',
    features: [
      'Unlimited vehicles',
      'Full analytics suite',
      '24/7 priority support',
      'Custom integrations',
      'Unlimited data history',
      'Dedicated account manager',
      'SLA guarantee',
      'On-premise deployment',
    ],
    color: '#F59E0B',
    popular: false,
  },
];

export default function Billing() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('invoices').select('*').order('date', { ascending: false });
      setInvoices((data as Invoice[]) || []);
      setLoading(false);
    })();
  }, []);

  const mrr = useMemo(() => {
    const paid = invoices.filter((i) => i.status === 'paid');
    return paid.reduce((a, i) => a + i.amount, 0);
  }, [invoices]);

  const totalRevenue = mrr * 12;
  const pendingAmount = invoices
    .filter((i) => i.status === 'pending' || i.status === 'overdue')
    .reduce((a, i) => a + i.amount, 0);

  // MRR trend (mock 6-month data)
  const mrrTrend = [
    { month: 'Mar', mrr: 89000 },
    { month: 'Apr', mrr: 95000 },
    { month: 'May', mrr: 102000 },
    { month: 'Jun', mrr: 110000 },
    { month: 'Jul', mrr: 118000 },
    { month: 'Aug', mrr: 124500 },
  ];

  const statusConfig: Record<string, { color: string; bg: string; border: string }> = {
    paid: { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
    pending: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    overdue: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
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
      <PageHeader title="Billing" subtitle="Manage your subscription, invoices, and revenue" />

      {/* MRR Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {[
          {
            label: 'Monthly Recurring Revenue',
            value: formatINR(mrr),
            sub: 'current MRR',
            icon: IndianRupee,
            color: '#22C55E',
            gradient: 'from-[#22C55E]/20 to-[#22C55E]/5',
          },
          {
            label: 'Annual Run Rate',
            value: formatINR(totalRevenue),
            sub: 'projected yearly',
            icon: TrendingUp,
            color: '#3B82F6',
            gradient: 'from-[#3B82F6]/20 to-[#3B82F6]/5',
          },
          {
            label: 'Pending Payments',
            value: formatINR(pendingAmount),
            sub: `${invoices.filter((i) => i.status === 'pending' || i.status === 'overdue').length} invoices`,
            icon: CreditCard,
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

      {/* MRR Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-5 mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-[#22C55E]" />
          <h2 className="text-white font-bold text-lg">MRR Growth Trend</h2>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={mrrTrend}>
            <defs>
              <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22C55E" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" stroke="#6B7280" fontSize={11} />
            <YAxis stroke="#6B7280" fontSize={11} tickFormatter={(v) => formatINR(v)} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatINR(Number(v))} />
            <Area type="monotone" dataKey="mrr" stroke="#22C55E" strokeWidth={2} fill="url(#mrrGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className={`glass-card p-6 relative ${
              plan.popular ? 'border-2' : ''
            }`}
            style={plan.popular ? { borderColor: `${plan.color}40` } : {}}
          >
            {plan.popular && (
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: plan.color }}
              >
                MOST POPULAR
              </div>
            )}
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5" style={{ color: plan.color }} fill={plan.color} />
              <h3 className="text-white font-bold text-lg">{plan.name}</h3>
            </div>
            <p className="text-gray-500 text-xs mb-4">{plan.description}</p>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-bold text-white">{formatINRShort(plan.price)}</span>
              <span className="text-gray-500 text-sm">/month</span>
            </div>
            <ul className="space-y-2.5 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: plan.color }} />
                  <span className="text-gray-400 text-sm">{f}</span>
                </li>
              ))}
            </ul>
            <button
              className={`w-full py-3 rounded-xl text-sm font-medium transition-all ${
                plan.popular
                  ? 'gradient-btn'
                  : 'bg-[#0A0B0F] border border-white/10 text-white hover:border-white/20'
              }`}
            >
              {plan.name === 'Business' ? 'Current Plan' : `Upgrade to ${plan.name}`}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Invoices Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-card overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-white/5">
          <h2 className="text-white font-bold text-lg">Recent Invoices</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Company</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Plan</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Amount</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Date</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Status</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, i) => (
                <motion.tr
                  key={inv.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <span className="text-white text-sm font-medium">{inv.company}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-gray-400 text-sm">{inv.plan}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-white text-sm font-medium">{formatINRShort(inv.amount)}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-gray-400 text-sm">
                      {new Date(inv.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border capitalize ${statusConfig[inv.status].color} ${statusConfig[inv.status].bg} ${statusConfig[inv.status].border}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1.5 text-xs">
                      <Download className="w-3.5 h-3.5" />
                      PDF
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
