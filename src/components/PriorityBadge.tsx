export const PriorityBadge = ({ priority }: { priority: string }) => {
  const icons: Record<string, string> = {
    Low: '✅',
    Medium: '🟡',
    High: '⚠️',
    Critical: '🔥',
  };

  const colors: Record<string, string> = {
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-orange-100 text-orange-800',
    Critical: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 ${colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
      <span>{icons[priority as keyof typeof icons] || '❓'}</span>
      <span>{priority}</span>
    </span>
  );
};
