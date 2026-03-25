import { useMemo } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { useFilters } from '../hooks/useFilters';
import { useListRendering } from '../hooks/useListRendering';
import { Avatar } from './Avatar';
import { PriorityBadge } from './PriorityBadge';

const priorityWeight = { Low: 1, Medium: 2, High: 3, Critical: 4 };

export default function ListView() {
  const { tasks, users, sort, setSort, updateTask } = useTaskStore();
  const { filters } = useFilters();

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filters.status.length && !filters.status.includes(task.status)) return false;
      if (filters.priority.length && !filters.priority.includes(task.priority)) return false;
      if (filters.assignee.length && !filters.assignee.includes(task.assigneeId)) return false;
      if (filters.dateRange && task.dueDate) {
        if (task.dueDate < filters.dateRange.start || task.dueDate > filters.dateRange.end) return false;
      }
      return true;
    });
  }, [tasks, filters]);

  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      let diff = 0;
      if (sort.sortBy === 'title') {
        diff = a.title.localeCompare(b.title);
      } else if (sort.sortBy === 'priority') {
        diff = priorityWeight[a.priority] - priorityWeight[b.priority];
      } else {
        diff = (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0);
      }
      return sort.sortOrder === 'asc' ? diff : -diff;
    });
  }, [filteredTasks, sort]);

  const { visibleItems, containerRef, totalHeight, offsetY } = useListRendering(sortedTasks, 70, 600);

  const setSortKey = (key: 'title' | 'priority' | 'dueDate') => {
    setSort({
      sortBy: key,
      sortOrder: sort.sortBy === key && sort.sortOrder === 'asc' ? 'desc' : 'asc',
    });
  };

  return (
    <div className="p-2 sm:p-3 h-full">
      {/* Mobile: Stack vertically, Desktop: Grid */}
      <div className="hidden sm:grid sm:grid-cols-5 sm:gap-2 text-xs font-semibold mb-2">
        <button onClick={() => setSortKey('title')} className="text-left">Title {sort.sortBy === 'title' ? (sort.sortOrder === 'asc' ? '↑' : '↓') : ''}</button>
        <button onClick={() => setSortKey('priority')}>Priority {sort.sortBy === 'priority' ? (sort.sortOrder === 'asc' ? '↑' : '↓') : ''}</button>
        <span>Assignee</span>
        <button onClick={() => setSortKey('dueDate')}>Due Date {sort.sortBy === 'dueDate' ? (sort.sortOrder === 'asc' ? '↑' : '↓') : ''}</button>
        <span>Status</span>
      </div>

      {/* Mobile sort buttons */}
      <div className="flex gap-2 mb-3 sm:hidden">
        <button onClick={() => setSortKey('title')} className="px-3 py-1 bg-gray-100 rounded text-xs">
          Title {sort.sortBy === 'title' ? (sort.sortOrder === 'asc' ? '↑' : '↓') : ''}
        </button>
        <button onClick={() => setSortKey('priority')} className="px-3 py-1 bg-gray-100 rounded text-xs">
          Priority {sort.sortBy === 'priority' ? (sort.sortOrder === 'asc' ? '↑' : '↓') : ''}
        </button>
        <button onClick={() => setSortKey('dueDate')} className="px-3 py-1 bg-gray-100 rounded text-xs">
          Due Date {sort.sortBy === 'dueDate' ? (sort.sortOrder === 'asc' ? '↑' : '↓') : ''}
        </button>
      </div>

      {sortedTasks.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <div className="text-4xl mb-4">📋</div>
          <div>No tasks to display. Adjust filters or clear them to see tasks.</div>
        </div>
      ) : (
        <div ref={containerRef} className="overflow-y-auto h-[calc(100vh-200px)] sm:h-[calc(100vh-240px)] border border-gray-200 rounded">
          <div style={{ height: totalHeight, position: 'relative' }}>
            {visibleItems.map((task, index) => {
              const assignee = users.find((u) => u.id === task.assigneeId);
              const top = offsetY + index * 70;
              const isOverdue = task.dueDate ? task.dueDate < new Date() : false;

              return (
                <div
                  key={task.id}
                  className={`p-3 border-b ${isOverdue ? 'bg-red-50' : 'bg-white'} hover:bg-gray-50 transition-colors`}
                  style={{ position: 'absolute', width: '100%', top, height: 70, boxSizing: 'border-box' }}
                >
                  {/* Desktop: Grid layout */}
                  <div className="hidden sm:grid sm:grid-cols-5 sm:gap-2 sm:items-center h-full">
                    <div className="truncate font-medium">{task.title}</div>
                    <div><PriorityBadge priority={task.priority} /></div>
                    <div className="flex items-center gap-2">
                      {assignee && <Avatar user={assignee} />}
                      <span className="text-xs truncate">{assignee?.name}</span>
                    </div>
                    <div className={`text-xs ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-700'}`}>
                      {task.dueDate?.toLocaleDateString() ?? 'N/A'}
                    </div>
                    <div>
                      <select
                        className="text-xs border rounded px-2 py-1 bg-white"
                        value={task.status}
                        onChange={(e) => updateTask(task.id, { status: e.target.value as any })}
                      >
                        <option>To Do</option>
                        <option>In Progress</option>
                        <option>In Review</option>
                        <option>Done</option>
                      </select>
                    </div>
                  </div>

                  {/* Mobile: Card layout */}
                  <div className="sm:hidden space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium text-sm flex-1 mr-2 break-words">{task.title}</h3>
                      <PriorityBadge priority={task.priority} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {assignee && <Avatar user={assignee} />}
                        <span className="text-xs text-gray-600">{assignee?.name}</span>
                      </div>
                      <div className={`text-xs ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                        {task.dueDate?.toLocaleDateString() ?? 'No due date'}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <select
                        className="text-xs border rounded px-2 py-1 bg-white"
                        value={task.status}
                        onChange={(e) => updateTask(task.id, { status: e.target.value as any })}
                      >
                        <option>To Do</option>
                        <option>In Progress</option>
                        <option>In Review</option>
                        <option>Done</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
