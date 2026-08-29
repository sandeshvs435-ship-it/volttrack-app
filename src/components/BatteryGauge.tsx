import { motion } from 'framer-motion';
import { getSocColor } from '@/lib/utils';

interface BatteryGaugeProps {
  soc: number;
  size?: number;
  label?: boolean;
}

export default function BatteryGauge({ soc, size = 56, label = false }: BatteryGaugeProps) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (soc / 100) * circumference;
  const color = getSocColor(soc);

  return (
    <div className="flex items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="4"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-sm">{Math.round(soc)}%</span>
        </div>
      </div>
      {label && (
        <span className="text-gray-400 text-xs">SoC</span>
      )}
    </div>
  );
}
