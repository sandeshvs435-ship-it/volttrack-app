import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Users,
  Plug,
  Bell,
  Shield,
  Mail,
  Save,
  User,
  Lock,
  Smartphone,
  Globe,
  Slack,
  Zap,
  Check,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';

const tabs = [
  { key: 'general', label: 'General', icon: SettingsIcon },
  { key: 'team', label: 'Team', icon: Users },
  { key: 'integrations', label: 'Integrations', icon: Plug },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'security', label: 'Security', icon: Shield },
];

const teamMembers = [
  { name: 'Arjun Sharma', email: 'arjun@volttrack.in', role: 'Admin', avatar: 'A' },
  { name: 'Priya Nair', email: 'priya@volttrack.in', role: 'Operator', avatar: 'P' },
  { name: 'Rajesh Kumar', email: 'rajesh@volttrack.in', role: 'Viewer', avatar: 'R' },
  { name: 'Sneha Patel', email: 'sneha@volttrack.in', role: 'Operator', avatar: 'S' },
];

const integrations = [
  { name: 'Slack', icon: Slack, connected: true, desc: 'Send alerts to Slack channels' },
  { name: 'Zapier', icon: Zap, connected: true, desc: 'Automate workflows with 5000+ apps' },
  { name: 'SMS Gateway', icon: Smartphone, connected: false, desc: 'Send critical alerts via SMS' },
  { name: 'Webhook API', icon: Globe, connected: true, desc: 'Push data to external endpoints' },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [notifSettings, setNotifSettings] = useState({
    criticalAlerts: true,
    warningAlerts: true,
    infoAlerts: false,
    dailyDigest: true,
    weeklyReport: true,
    lowSocThreshold: 25,
    highTempThreshold: 40,
  });

  const roleColors: Record<string, string> = {
    Admin: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20',
    Operator: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20',
    Viewer: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your account, team, and integrations" />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tab Sidebar */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-[#3B82F6]/20 to-[#3B82F6]/5 text-[#3B82F6] border border-[#3B82F6]/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <tab.icon className="w-4 h-4 flex-shrink-0" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === 'general' && (
              <motion.div
                key="general"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card p-6"
              >
                <h2 className="text-white font-bold text-lg mb-1">General Settings</h2>
                <p className="text-gray-500 text-sm mb-6">Configure your organization profile</p>

                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#22C55E] flex items-center justify-center text-white font-bold text-2xl">
                      V
                    </div>
                    <div>
                      <p className="text-white font-medium">VoltTrack Enterprise</p>
                      <p className="text-gray-500 text-xs">Fleet battery intelligence platform</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-xs font-medium mb-1.5 block">Organization Name</label>
                      <input
                        type="text"
                        defaultValue="VoltTrack Enterprise"
                        className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6]/30"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs font-medium mb-1.5 block">Domain</label>
                      <input
                        type="text"
                        defaultValue="volttrack.in"
                        className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6]/30"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs font-medium mb-1.5 block">Timezone</label>
                      <select className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6]/30">
                        <option>Asia/Kolkata (IST)</option>
                        <option>Asia/Dubai (GST)</option>
                        <option>Asia/Singapore (SGT)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs font-medium mb-1.5 block">Currency</label>
                      <select className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6]/30">
                        <option>INR (₹)</option>
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                      </select>
                    </div>
                  </div>

                  <button className="gradient-btn flex items-center gap-2 px-5 py-2.5 text-sm">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'team' && (
              <motion.div
                key="team"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card p-6"
              >
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-white font-bold text-lg">Team Members</h2>
                  <button className="gradient-btn flex items-center gap-2 px-4 py-2 text-sm">
                    <Users className="w-3.5 h-3.5" />
                    Invite Member
                  </button>
                </div>
                <p className="text-gray-500 text-sm mb-6">{teamMembers.length} members in your organization</p>

                <div className="space-y-3">
                  {teamMembers.map((member, i) => (
                    <motion.div
                      key={member.email}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-4 p-3 rounded-xl bg-[#0A0B0F] border border-white/5 hover:border-white/10 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#22C55E] flex items-center justify-center text-white font-bold">
                        {member.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium">{member.name}</p>
                        <p className="text-gray-500 text-xs">{member.email}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${roleColors[member.role]}`}>
                        {member.role}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'integrations' && (
              <motion.div
                key="integrations"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card p-6"
              >
                <h2 className="text-white font-bold text-lg mb-1">Integrations</h2>
                <p className="text-gray-500 text-sm mb-6">Connect VoltTrack with your favorite tools</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {integrations.map((int, i) => (
                    <motion.div
                      key={int.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-4 rounded-xl bg-[#0A0B0F] border border-white/5 hover:border-white/10 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center">
                          <int.icon className="w-5 h-5 text-[#3B82F6]" />
                        </div>
                        {int.connected && (
                          <span className="flex items-center gap-1 text-green-400 text-xs font-medium">
                            <Check className="w-3.5 h-3.5" />
                            Connected
                          </span>
                        )}
                      </div>
                      <p className="text-white text-sm font-medium">{int.name}</p>
                      <p className="text-gray-500 text-xs mt-1 mb-3">{int.desc}</p>
                      <button
                        className={`w-full py-2 rounded-lg text-xs font-medium transition-all ${
                          int.connected
                            ? 'bg-[#0A0B0F] border border-white/10 text-gray-400 hover:border-red-500/20 hover:text-red-400'
                            : 'gradient-btn'
                        }`}
                      >
                        {int.connected ? 'Disconnect' : 'Connect'}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card p-6"
              >
                <h2 className="text-white font-bold text-lg mb-1">Notification Preferences</h2>
                <p className="text-gray-500 text-sm mb-6">Control what alerts you receive and how</p>

                <div className="space-y-4">
                  {[
                    { key: 'criticalAlerts', label: 'Critical Alerts', desc: 'Immediate notification for critical battery issues', icon: Shield },
                    { key: 'warningAlerts', label: 'Warning Alerts', desc: 'Notifications for warnings like low SoC', icon: Bell },
                    { key: 'infoAlerts', label: 'Info Alerts', desc: 'General info like charging started/complete', icon: Mail },
                    { key: 'dailyDigest', label: 'Daily Digest', desc: 'Summary of fleet status every morning', icon: Globe },
                    { key: 'weeklyReport', label: 'Weekly Report', desc: 'Detailed analytics report every Monday', icon: Smartphone },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-[#0A0B0F] border border-white/5">
                      <div className="flex items-center gap-3">
                        <item.icon className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-white text-sm font-medium">{item.label}</p>
                          <p className="text-gray-500 text-xs">{item.desc}</p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setNotifSettings((prev) => ({
                            ...prev,
                            [item.key]: !prev[item.key as keyof typeof prev],
                          }))
                        }
                        className={`w-11 h-6 rounded-full transition-colors relative ${
                          notifSettings[item.key as keyof typeof notifSettings]
                            ? 'bg-[#3B82F6]'
                            : 'bg-gray-700'
                        }`}
                      >
                        <motion.span
                          layout
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className="absolute top-0.5 w-5 h-5 rounded-full bg-white"
                          style={{
                            left: notifSettings[item.key as keyof typeof notifSettings] ? '22px' : '2px',
                          }}
                        />
                      </button>
                    </div>
                  ))}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="text-gray-400 text-xs font-medium mb-1.5 block">Low SoC Threshold (%)</label>
                      <input
                        type="number"
                        value={notifSettings.lowSocThreshold}
                        onChange={(e) =>
                          setNotifSettings((prev) => ({ ...prev, lowSocThreshold: Number(e.target.value) }))
                        }
                        className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6]/30"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs font-medium mb-1.5 block">High Temp Threshold (°C)</label>
                      <input
                        type="number"
                        value={notifSettings.highTempThreshold}
                        onChange={(e) =>
                          setNotifSettings((prev) => ({ ...prev, highTempThreshold: Number(e.target.value) }))
                        }
                        className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6]/30"
                      />
                    </div>
                  </div>

                  <button className="gradient-btn flex items-center gap-2 px-5 py-2.5 text-sm">
                    <Save className="w-4 h-4" />
                    Save Preferences
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card p-6"
              >
                <h2 className="text-white font-bold text-lg mb-1">Security</h2>
                <p className="text-gray-500 text-sm mb-6">Manage your account security settings</p>

                <div className="space-y-5">
                  <div className="p-4 rounded-xl bg-[#0A0B0F] border border-white/5">
                    <div className="flex items-center gap-3 mb-3">
                      <User className="w-4 h-4 text-gray-400" />
                      <p className="text-white text-sm font-medium">Account Email</p>
                    </div>
                    <input
                      type="email"
                      defaultValue="admin@volttrack.in"
                      className="w-full bg-[#13151C] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6]/30"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-[#0A0B0F] border border-white/5">
                    <div className="flex items-center gap-3 mb-3">
                      <Lock className="w-4 h-4 text-gray-400" />
                      <p className="text-white text-sm font-medium">Change Password</p>
                    </div>
                    <div className="space-y-3">
                      <input
                        type="password"
                        placeholder="Current password"
                        className="w-full bg-[#13151C] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#3B82F6]/30"
                      />
                      <input
                        type="password"
                        placeholder="New password"
                        className="w-full bg-[#13151C] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#3B82F6]/30"
                      />
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full bg-[#13151C] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#3B82F6]/30"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0A0B0F] border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-white text-sm font-medium">Two-Factor Authentication</p>
                        <p className="text-gray-500 text-xs">Add an extra layer of security</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 text-xs font-medium hover:bg-[#22C55E]/20 transition-colors">
                      Enable 2FA
                    </button>
                  </div>

                  <button className="gradient-btn flex items-center gap-2 px-5 py-2.5 text-sm">
                    <Save className="w-4 h-4" />
                    Update Security
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
