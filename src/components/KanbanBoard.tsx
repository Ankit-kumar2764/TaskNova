import { useMemo } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import TaskCard from './TaskCard';
import { useFilters } from '../hooks/useFilters';
import { useDragDrop } from '../hooks/useDragDrop';

const statuses = ['To Do', 'In Progress', 'In Review', 'Done'];

export default function KanbanBoard() {
  const { tasks, users, viewingUsers, updateTask } = useTaskStore();
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

  const { handlePointerDown, handlePointerUp, draggedId } = useDragDrop((taskId, targetStatus) => {
    updateTask(taskId, { status: targetStatus as any });
  });

  const taskViewById = (taskId: string) => viewingUsers.filter((v) => v.taskId === taskId).map((v) => v.userId);

  return (
    <div className="flex gap-2 sm:gap-3 p-2 sm:p-3 overflow-x-auto h-full pb-4">
      {statuses.map((status) => {
        const branch = filteredTasks.filter((task) => task.status === status);
        return (
          <div key={status} className="min-w-[280px] sm:min-w-[300px] bg-gray-100 rounded-lg p-2 sm:p-3 border border-gray-200 flex-shrink-0" data-drop-zone={status}>
            <h2 className="text-sm sm:text-base font-bold mb-2 text-gray-800">{status} ({branch.length})</h2>
            <div className="space-y-2 max-h-[calc(100vh-200px)] sm:max-h-[calc(100vh-250px)] overflow-y-auto">
              {branch.length === 0 ? (
                <div className="text-center p-4 sm:p-6 text-gray-500 bg-white rounded border-2 border-dashed border-gray-300">
                  <div className="text-2xl sm:text-3xl mb-2">📝</div>
                  <div className="text-sm sm:text-base">No tasks here</div>
                </div>
              ) : (
                branch.map((task) => (
                  <div
                    key={task.id}
                    className={`cursor-pointer transition-all duration-200 ${draggedId === task.id ? 'opacity-50 scale-95' : 'hover:scale-105'}`}
                    onPointerDown={(e) => handlePointerDown(e as any, task.id)}
                    onPointerUp={(e) => handlePointerUp(e as any)}
                  >
                    <TaskCard task={task} users={users} viewingUserIds={taskViewById(task.id)} />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
