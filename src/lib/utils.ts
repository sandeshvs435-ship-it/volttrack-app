export const formatINR = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatINRShort = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatTime = (iso: string): string => {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);

  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

export const getSocColor = (soc: number): string => {
  if (soc < 25) return '#EF4444';
  if (soc < 50) return '#F59E0B';
  return '#22C55E';
};

export const getHealthColor = (health: number): string => {
  if (health < 80) return '#EF4444';
  if (health < 90) return '#F59E0B';
  return '#22C55E';
};

export const getTempColor = (temp: number): string => {
  if (temp >= 40) return '#EF4444';
  if (temp >= 35) return '#F59E0B';
  return '#3B82F6';
};
