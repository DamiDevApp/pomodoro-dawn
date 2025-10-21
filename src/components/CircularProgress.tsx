import { motion } from 'framer-motion';

type CircularProgressProps = {
  progress: number;
  size?: number;
  strokeWidth?: number;
  timeLabel?: string;
};

export default function CircularProgress({
  progress,
  size = 220,
  strokeWidth = 12,
  timeLabel,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <svg width={size} height={size + 20} viewBox={`0 0 ${size} ${size}`}>
      {/* Base circle */}
      <circle
        stroke='var(--color-surface)'
        fill='transparent'
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      {/* Progress arc */}
      <motion.circle
        stroke='var(--color-primary)'
        fill='transparent'
        strokeWidth={strokeWidth}
        strokeLinecap='round'
        r={radius}
        cx={size / 2}
        cy={size / 2}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />
      {/* Timer text */}
      {timeLabel && (
        <motion.text
          x='50%'
          y='50%'
          textAnchor='middle'
          dominantBaseline='middle'
          fontSize={size * 0.2}
          fontWeight='bold'
          letterSpacing={2}
          fill='var(--color-text)'
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {timeLabel}
        </motion.text>
      )}
    </svg>
  );
}
