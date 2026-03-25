import { Task, User } from '../types';
import { Avatar } from './Avatar';
import { PriorityBadge } from './PriorityBadge';

interface TaskCardProps {
  task: Task;
  users: User[];
  viewingUserIds: string[];
}

export default function TaskCard({ task, users, viewingUserIds }: TaskCardProps) {
  const assignee = users.find((u) => u.id === task.assigneeId);
  const now = new Date();
  const overdueDays = task.dueDate ? Math.ceil((now.getTime() - task.dueDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const dueText = task.dueDate
    ? task.dueDate.toLocaleDateString()
    : 'No due date';

  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition duration-150 min-h-[120px] sm:min-h-[100px]">
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm sm:text-base flex-1 leading-tight break-words">{task.title}</h3>
          <PriorityBadge priority={task.priority} />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {assignee ? <Avatar user={assignee} /> : null}
            <span className="text-xs sm:text-sm text-gray-500 truncate">{assignee?.name ?? 'Unassigned'}</span>
          </div>
          <span className={`text-xs sm:text-sm whitespace-nowrap ${task.dueDate && task.dueDate < now ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
            {task.dueDate && overdueDays === 0 && 'Due Today'}
            {task.dueDate && overdueDays > 0 && `${overdueDays}d overdue`}
            {task.dueDate && overdueDays < 1 && task.dueDate >= now ? dueText : ''}
            {!task.dueDate && 'No due date'}
          </span>
        </div>

        {viewingUserIds.length > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-gray-500 mr-1">👁️</span>
            {viewingUserIds.slice(0, 3).map((id) => {
              const user = users.find((u) => u.id === id);
              return user ? <Avatar key={id} user={user} /> : null;
            })}
            {viewingUserIds.length > 3 && <span className="text-xs text-gray-500">+{viewingUserIds.length - 3}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
