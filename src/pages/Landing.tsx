import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Zap, ArrowRight, Battery, Bell, BarChart3, MapPin, Thermometer, TrendingDown,
  AlertTriangle, EyeOff, FileSpreadsheet, Check, ChevronDown, ChevronUp,
  Mail, Phone, MapPin as LocationPin,
} from 'lucide-react';

const WHATSAPP_URL = 'https://wa.me/919999999999?text=Hi%2C%20I%20want%20a%20VoltTrack%20demo';

function AnimatedCounter({ target, suffix = '', prefix = '', duration = 1500 }: { target: number; suffix?: string; prefix?: string; duration?: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(1, elapsed / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);

  return <span ref={ref}>{prefix}{value.toLocaleString('en-IN')}{suffix}</span>;
}

function Particles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 8 + Math.random() * 10,
    size: 1 + Math.random() * 3,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: '110vh', opacity: 0 }}
          animate={{ y: '-10vh', opacity: [0, 0.6, 0.6, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
          className="absolute rounded-full bg-[#3B82F6]"
          style={{ left: `${p.left}%`, width: p.size, height: p.size, filter: 'blur(1px)' }}
        />
      ))}
    </div>
  );
}

function VoltLogo({ className = '', animated = false }: { className?: string; animated?: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.div
        animate={animated ? { scale: [1, 1.1, 1], filter: ['drop-shadow(0 0 8px #3B82F6)', 'drop-shadow(0 0 16px #22C55E)', 'drop-shadow(0 0 8px #3B82F6)'] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#22C55E] flex items-center justify-center"
      >
        <Zap className="w-5 h-5 text-white" fill="white" />
      </motion.div>
      <div className="leading-tight">
        <div className="text-white font-bold text-lg">VoltTrack</div>
        <div className="text-gray-500 text-[10px] uppercase tracking-widest -mt-1">Enterprise</div>
      </div>
    </div>
  );
}

function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className="max-w-5xl mx-auto mt-12 glass-card p-6 relative overflow-hidden"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="w-3 h-3 rounded-full bg-red-500/60" />
        <span className="w-3 h-3 rounded-full bg-amber-500/60" />
        <span className="w-3 h-3 rounded-full bg-green-500/60" />
        <span className="ml-3 text-gray-500 text-xs font-mono">volttrack.in/dashboard</span>
      </div>
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Vehicles', v: '20', c: '#3B82F6' },
          { label: 'Avg SoC', v: '61%', c: '#22C55E' },
          { label: 'Alerts', v: '9', c: '#EF4444' },
          { label: 'MRR', v: '₹1.2L', c: '#F59E0B' },
        ].map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.1 }}
            className="p-3 rounded-xl bg-[#0A0B0F] border border-white/5"
          >
            <p className="text-xs text-gray-500">{k.label}</p>
            <p className="text-lg font-bold" style={{ color: k.c }}>{k.v}</p>
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 h-32 rounded-xl bg-gradient-to-br from-[#3B82F6]/10 to-transparent border border-white/5 flex items-end p-3">
          <svg viewBox="0 0 200 60" className="w-full h-full">
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.2, duration: 1.5 }}
              d="M 0 40 Q 30 20, 50 30 T 100 25 T 150 15 T 200 20"
              stroke="#3B82F6"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>
        <div className="h-32 rounded-xl bg-gradient-to-br from-[#22C55E]/10 to-transparent border border-white/5 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full border-4 border-[#22C55E]/30 border-t-[#22C55E] border-r-[#F59E0B]" />
        </div>
      </div>
    </motion.div>
  );
}

interface FAQItem { q: string; a: string }
function FAQ({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card overflow-hidden"
    >
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left">
        <span className="text-white font-medium text-sm">{item.q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        className="overflow-hidden"
      >
        <p className="text-gray-400 text-sm px-5 pb-5">{item.a}</p>
      </motion.div>
    </motion.div>
  );
}

export default function Landing() {
  const problems = [
    { icon: AlertTriangle, title: 'Unexpected Breakdowns', desc: '₹15,000 per incident average — plus lost revenue.' },
    { icon: EyeOff, title: 'Zero Visibility', desc: 'You find out AFTER the vehicle stops on the road.' },
    { icon: FileSpreadsheet, title: 'Manual Tracking', desc: 'Spreadsheets and phone calls don\'t scale past 10 vehicles.' },
  ];

  const features = [
    { icon: Battery, title: 'Real-time Monitoring', desc: 'See every vehicle\'s battery % live, updated every 30 seconds.' },
    { icon: Bell, title: 'Predictive Alerts', desc: 'Get warned 2 hours before a breakdown happens.' },
    { icon: BarChart3, title: 'Deep Analytics', desc: '30-day trends, degradation curves, and actionable insights.' },
    { icon: MapPin, title: 'GPS Fleet Map', desc: 'See where every vehicle is right now, across all cities.' },
    { icon: Thermometer, title: 'Temperature Tracking', desc: 'Catch overheating before it damages your battery pack.' },
    { icon: TrendingDown, title: 'Cost Reduction', desc: 'Reduce maintenance costs by 40% within 3 months.' },
  ];

  const plans = [
    { name: 'Starter', price: 2999, popular: false, features: ['Up to 10 vehicles', 'Basic analytics', 'Email alerts', 'Mobile dashboard', '30-day history'], cta: 'Start Free Trial' },
    { name: 'Growth', price: 9999, popular: true, features: ['Up to 50 vehicles', 'Full analytics + charts', 'SMS + Email + WhatsApp alerts', 'Advanced battery analytics', 'API access', '90-day history', 'Priority support'], cta: 'Start Free Trial' },
    { name: 'Enterprise', price: 24999, popular: false, features: ['Unlimited vehicles', 'White-label option', 'Dedicated account manager', 'Custom integrations', '1-year history', 'SLA guarantee', 'On-site training'], cta: 'Contact Sales' },
  ];

  const testimonials = [
    { quote: 'VoltTrack saved us ₹3.2 lakhs in just 4 months. We caught 12 battery issues before they became breakdowns.', name: 'Rajesh Kumar', role: 'Fleet Manager, BluDart Express Logistics' },
    { quote: 'Our downtime reduced by 78% after deploying VoltTrack across our 30-vehicle Mumbai delivery fleet.', name: 'Priya Sharma', role: 'Operations Head, Porter Urban Logistics' },
    { quote: 'The real-time alerts are incredible. We got notified about a battery temperature issue at 2 AM and prevented a complete failure.', name: 'Amit Patel', role: 'Director, Rapido Commercial Fleet' },
  ];

  const faqs: FAQItem[] = [
    { q: 'How long does setup take?', a: 'Less than 2 hours for most fleets. Our team handles OBD device installation and dashboard onboarding.' },
    { q: 'Does it work with all EVs?', a: 'Yes — Tata Nexon EV, MG ZS EV, Ather, BYD, Mahindra and all OBD2-compatible vehicles.' },
    { q: 'Is there a free trial?', a: 'Yes — 30 days free, no credit card required. Try every feature risk-free.' },
    { q: 'What if I have questions?', a: '24/7 WhatsApp support at +91 99999 99999 and a dedicated account manager on Growth and Enterprise plans.' },
    { q: 'Can I cancel anytime?', a: 'Yes — no lock-in contracts. Cancel with one click and export all your data.' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0B0F] text-white">
      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-[#0A0B0F]/70 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <VoltLogo animated />
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Customers</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-gray-400 hover:text-white text-sm">Sign in</Link>
            <Link to="/dashboard" className="gradient-btn px-4 py-2 text-sm">Live Demo</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <Particles />
        <div className="absolute inset-0 bg-gradient-to-b from-[#3B82F6]/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] text-xs font-medium mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
            Trusted by 50+ fleet operators across India
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            Know Your Battery.<br />
            <span className="bg-gradient-to-r from-[#3B82F6] to-[#22C55E] bg-clip-text text-transparent">
              Save Your Fleet.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10"
          >
            India's #1 EV Fleet Battery Intelligence Platform. Monitor every vehicle in real-time,
            prevent breakdowns before they happen, and save ₹2,00,000+ per year.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/dashboard" className="gradient-btn px-7 py-3.5 text-base flex items-center gap-2 group">
              See Live Demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="px-7 py-3.5 rounded-xl border border-white/10 hover:border-white/20 text-white text-base font-medium transition-all">
              Book Free Demo
            </a>
          </motion.div>

          <DashboardPreview />

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-12 inline-flex flex-col items-center text-gray-600 text-xs"
          >
            <span>Scroll to explore</span>
            <ChevronDown className="w-4 h-4 mt-1" />
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 px-6 border-y border-white/5 bg-[#0D0E14]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: 500, suffix: '+', label: 'Vehicles Monitored' },
            { value: 50, suffix: '+', label: 'Fleet Operators' },
            { value: 2, prefix: '₹', suffix: ' Cr+', label: 'Saved by Customers' },
            { value: 99, suffix: '.9%', label: 'Uptime SLA' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#22C55E] bg-clip-text text-transparent">
                <AnimatedCounter target={s.value} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <p className="text-gray-500 text-sm mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-center mb-4 max-w-3xl mx-auto"
          >
            EV Battery Failures Cost Indian Fleets <span className="text-red-400">Lakhs Every Year</span>
          </motion.h2>
          <p className="text-gray-500 text-center mb-16 max-w-xl mx-auto">The old way of managing fleets doesn't work with electric vehicles.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {problems.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
                  <p.icon className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{p.title}</h3>
                <p className="text-gray-400 text-sm">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION / FEATURES */}
      <section id="features" className="py-24 px-6 bg-[#0D0E14]">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-center mb-4"
          >
            VoltTrack Gives You <span className="bg-gradient-to-r from-[#3B82F6] to-[#22C55E] bg-clip-text text-transparent">Complete Battery Intelligence</span>
          </motion.h2>
          <p className="text-gray-500 text-center mb-16 max-w-xl mx-auto">Everything you need to run a healthy, profitable EV fleet.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card glass-card-hover p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3B82F6]/20 to-[#22C55E]/10 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-[#3B82F6]" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Connect Your Fleet', desc: 'Install our OBD device or connect via Smartcar API. Takes under 2 hours.' },
              { step: '02', title: 'Monitor Dashboard', desc: 'Real-time data on any device. Web, tablet, or mobile — always in sync.' },
              { step: '03', title: 'Prevent Breakdowns', desc: 'AI-powered alerts warn you before problems happen. Save money.' },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card p-6 relative"
              >
                <div className="text-5xl font-bold bg-gradient-to-br from-[#3B82F6] to-[#22C55E] bg-clip-text text-transparent mb-4">{s.step}</div>
                <h3 className="text-white font-bold text-xl mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-6 bg-[#0D0E14]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">Simple, transparent pricing</h2>
          <p className="text-gray-500 text-center mb-16">Choose the plan that fits your fleet. Cancel anytime.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card p-6 relative ${plan.popular ? 'border-2 border-[#22C55E]/40 shadow-[0_0_40px_-10px_rgba(34,197,94,0.4)]' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#3B82F6] to-[#22C55E]">
                    MOST POPULAR
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-[#3B82F6]" fill="#3B82F6" />
                  <h3 className="text-white font-bold text-xl">{plan.name}</h3>
                </div>
                <div className="flex items-baseline gap-1 mb-6 mt-4">
                  <span className="text-4xl font-bold text-white">₹{plan.price.toLocaleString('en-IN')}</span>
                  <span className="text-gray-500 text-sm">/month</span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#22C55E]" />
                      <span className="text-gray-300 text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block text-center w-full py-3 rounded-xl text-sm font-medium transition-all ${
                    plan.popular ? 'gradient-btn' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                  }`}
                >
                  {plan.cta}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">Loved by fleet operators</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6"
              >
                <div className="text-[#3B82F6] text-3xl leading-none mb-3">"</div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">{t.quote}</p>
                <div className="pt-4 border-t border-white/5">
                  <p className="text-white font-medium text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 bg-[#0D0E14]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">Frequently asked questions</h2>
          <div className="space-y-3">
            {faqs.map((item) => <FAQ key={item.q} item={item} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto glass-card p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/10 via-transparent to-[#22C55E]/10 pointer-events-none" />
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Ready to Protect Your Fleet?</h2>
            <p className="text-gray-400 mb-8">Join 50+ fleet operators across India already saving lakhs every month.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="gradient-btn px-7 py-3.5 text-base">
                Book Free Demo
              </a>
              <Link to="/dashboard" className="text-gray-300 hover:text-white text-sm inline-flex items-center gap-2">
                Or try the live demo <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <VoltLogo />
            <p className="text-gray-500 text-xs mt-4">India's leading EV fleet battery intelligence platform.</p>
          </div>
          <div>
            <p className="text-white font-medium text-sm mb-3">Contact</p>
            <div className="space-y-2 text-gray-500 text-xs">
              <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> contact@volttrack.in</p>
              <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> +91 99999 99999</p>
              <p className="flex items-center gap-2"><LocationPin className="w-3.5 h-3.5" /> Bangalore, Karnataka, India</p>
            </div>
          </div>
          <div>
            <p className="text-white font-medium text-sm mb-3">Company</p>
            <div className="space-y-2 text-gray-500 text-xs">
              <p>Privacy Policy</p>
              <p>Terms of Service</p>
              <p>Contact</p>
            </div>
          </div>
          <div>
            <p className="text-white font-medium text-sm mb-3">Product</p>
            <div className="space-y-2 text-gray-500 text-xs">
              <a href="#features" className="block hover:text-white">Features</a>
              <a href="#pricing" className="block hover:text-white">Pricing</a>
              <Link to="/dashboard" className="block hover:text-white">Live Demo</Link>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-white/5 text-center text-gray-600 text-xs">
          © 2026 VoltTrack Technologies Pvt Ltd. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
