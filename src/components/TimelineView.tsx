import { useMemo } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { useFilters } from '../hooks/useFilters';
import { Avatar } from './Avatar';

const PIXELS_PER_DAY = 6;

function clamp(date: Date, min: Date, max: Date) {
  if (date < min) return min;
  if (date > max) return max;
  return date;
}

export default function TimelineView() {
  const { tasks, users } = useTaskStore();
  const { filters } = useFilters();

  const filteredTasks = useMemo(() => tasks.filter((task) => {
    if (filters.status.length && !filters.status.includes(task.status)) return false;
    if (filters.priority.length && !filters.priority.includes(task.priority)) return false;
    if (filters.assignee.length && !filters.assignee.includes(task.assigneeId)) return false;
    if (filters.dateRange && task.dueDate) {
      if (task.dueDate < filters.dateRange.start || task.dueDate > filters.dateRange.end) return false;
    }
    return true;
  }), [tasks, filters]);

  const start = useMemo(() => {
    const dates = filteredTasks.flatMap((task) => [task.startDate, task.dueDate].filter(Boolean) as Date[]);
    if (dates.length === 0) return new Date();
    const min = new Date(Math.min(...dates.map((d) => d.getTime())));
    min.setDate(min.getDate() - 15);
    return min;
  }, [filteredTasks]);

  const end = useMemo(() => {
    const dates = filteredTasks.flatMap((task) => [task.startDate, task.dueDate].filter(Boolean) as Date[]);
    if (dates.length === 0) return new Date();
    const max = new Date(Math.max(...dates.map((d) => d.getTime())));
    max.setDate(max.getDate() + 15);
    return max;
  }, [filteredTasks]);

  const totalDays = Math.max(60, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  const totalWidth = totalDays * PIXELS_PER_DAY;
  const today = new Date();
  const todayOffset = ((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) * PIXELS_PER_DAY;

  if (filteredTasks.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <div className="text-4xl mb-4">📅</div>
        <div className="text-sm sm:text-base">No tasks in timeline.</div>
        <div className="text-xs text-gray-400 mt-2">Try adjusting your filters</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto p-2 sm:p-3">
      <div className="relative" style={{ width: totalWidth + 200, minHeight: filteredTasks.length * 60 + 120 }}>
        <div className="absolute inset-y-0" style={{ left: todayOffset, width: 2, background: 'red' }} />
        <div className="absolute top-2 left-4 text-xs text-red-600 font-medium">Today</div>

        {Array.from({ length: Math.ceil(totalDays / 30) }, (_, i) => {
          const markerDate = new Date(start.getTime());
          markerDate.setDate(start.getDate() + i * 30);
          const left = ((markerDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) * PIXELS_PER_DAY;
          return (
            <div key={i} className="absolute top-0 bottom-0" style={{ left, width: 1, background: '#d1d5db' }} />
          );
        })}

        {/* Month labels - hide on very small screens */}
        {Array.from({ length: Math.ceil(totalDays / 30) }, (_, i) => {
          const markerDate = new Date(start.getTime());
          markerDate.setDate(start.getDate() + i * 30);
          const left = ((markerDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) * PIXELS_PER_DAY;
          return (
            <div key={`label-${i}`} className="absolute top-0 hidden sm:block" style={{ left: left + 4 }}>
              <div className="text-xs text-gray-500">{markerDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
            </div>
          );
        })}

        {filteredTasks.map((task, idx) => {
          const taskStart = task.startDate ? clamp(task.startDate, start, end) : task.dueDate ? clamp(task.dueDate, start, end) : start;
          const taskEnd = task.dueDate ? clamp(task.dueDate, start, end) : taskStart;
          const left = ((taskStart.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) * PIXELS_PER_DAY;
          const width = task.startDate && task.dueDate ? Math.max(20, ((taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24)) * PIXELS_PER_DAY) : 20;
          const assignee = users.find((u) => u.id === task.assigneeId);
          const isOverdue = task.dueDate ? task.dueDate < new Date() : false;

          return (
            <div key={task.id} className="absolute left-0 right-0" style={{ top: idx * 60 + 40, height: 44 }}>
              <div className="absolute left-0 w-32 sm:w-40 text-xs truncate pr-2" style={{ top: 10 }}>
                <span className="font-medium">{task.title}</span>
              </div>

              <div
                className={`absolute rounded flex items-center gap-2 px-2 text-xs shadow-sm border ${isOverdue ? 'bg-red-300 text-red-900 border-red-400' : 'bg-blue-500 text-white border-blue-600'}`}
                style={{ left: left + 140, width: Math.max(width, 120), minWidth: 120 }}
              >
                <span className="truncate flex-1">{task.title}</span>
                {assignee && <Avatar user={assignee} />}
                {isOverdue && <span className="text-red-700 font-bold">!</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
