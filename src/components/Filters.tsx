import { useTaskStore } from '../store/useTaskStore';
import { useFilters } from '../hooks/useFilters';

const statuses = ['To Do', 'In Progress', 'In Review', 'Done'];
const priorities = ['Low', 'Medium', 'High', 'Critical'];

export default function Filters() {
  const { users } = useTaskStore();
  const { filters, updateFilters } = useFilters();

  const setStatus = (status: string, checked: boolean) => {
    const next = checked
      ? [...filters.status, status as typeof filters.status[number]]
      : filters.status.filter((item) => item !== status);
    updateFilters({ ...filters, status: next });
  };

  const setPriority = (priority: string, checked: boolean) => {
    const next = checked
      ? [...filters.priority, priority as typeof filters.priority[number]]
      : filters.priority.filter((item) => item !== priority);
    updateFilters({ ...filters, priority: next });
  };

  const setAssignee = (assignee: string, checked: boolean) => {
    const next = checked ? [...filters.assignee, assignee] : filters.assignee.filter((item) => item !== assignee);
    updateFilters({ ...filters, assignee: next });
  };

  const setDateRange = (key: 'start' | 'end', value: string) => {
    const date = value ? new Date(value) : undefined;
    const current = filters.dateRange || { start: new Date(), end: new Date() };
    const next = key === 'start' ? { start: date || current.start, end: current.end } : { start: current.start, end: date || current.end };

    if (!next.start || !next.end) {
      updateFilters({ ...filters, dateRange: undefined });
    } else {
      updateFilters({ ...filters, dateRange: next });
    }
  };

  const clear = () => updateFilters({ status: [], priority: [], assignee: [] });

  const hasFilters = filters.status.length || filters.priority.length || filters.assignee.length || !!filters.dateRange;

  const activeFilters = [
    ...(filters.status.length ? [`Status: ${filters.status.join(', ')}`] : []),
    ...(filters.priority.length ? [`Priority: ${filters.priority.join(', ')}`] : []),
    ...(filters.assignee.length ? [`Assignee: ${filters.assignee.map((id) => users.find((u) => u.id === id)?.name || id).join(', ')}`] : []),
    ...(filters.dateRange ? [`Date: ${filters.dateRange.start.toLocaleDateString()} - ${filters.dateRange.end.toLocaleDateString()}`] : []),
  ];

  return (
    <div>
      {hasFilters && (
        <div className="mb-2 p-2 bg-sky-50 border border-sky-200 rounded text-xs text-sky-700">
          Active filters: {activeFilters.length ? activeFilters.join(' | ') : 'None'}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-200 mt-2">
      <div>
        <p className="text-xs font-semibold">Status</p>
        {statuses.map((status) => (
          <label key={status} className="block text-xs mt-1">
            <input type="checkbox" checked={filters.status.includes(status as any)} onChange={(e) => setStatus(status, e.target.checked)} />
            <span className="ml-1">{status}</span>
          </label>
        ))}
      </div>

      <div>
        <p className="text-xs font-semibold">Priority</p>
        {priorities.map((priority) => (
          <label key={priority} className="block text-xs mt-1">
            <input type="checkbox" checked={filters.priority.includes(priority as any)} onChange={(e) => setPriority(priority, e.target.checked)} />
            <span className="ml-1">{priority}</span>
          </label>
        ))}
      </div>

      <div>
        <p className="text-xs font-semibold">Assignee</p>
        {users.map((user) => (
          <label key={user.id} className="block text-xs mt-1">
            <input type="checkbox" checked={filters.assignee.includes(user.id)} onChange={(e) => setAssignee(user.id, e.target.checked)} />
            <span className="ml-1">{user.name}</span>
          </label>
        ))}
      </div>

      <div>
        <p className="text-xs font-semibold">Date Range</p>
        <input type="date" className="w-full text-xs border p-1 rounded" onChange={(e) => setDateRange('start', e.target.value)} />
        <input type="date" className="w-full text-xs border p-1 rounded mt-1" onChange={(e) => setDateRange('end', e.target.value)} />
        {hasFilters && (
          <button className="text-xs mt-2 text-blue-600" onClick={clear}>
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
