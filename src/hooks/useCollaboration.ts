import { useEffect } from 'react';
import { useTaskStore } from '../store/useTaskStore';

export const useCollaboration = () => {
  const { users, tasks, updateViewingUsers } = useTaskStore();

  useEffect(() => {
    if (users.length === 0 || tasks.length === 0) return;

    const intervalId = setInterval(() => {
      const fresh = users.map((user) => ({
        userId: user.id,
        taskId: tasks[Math.floor(Math.random() * tasks.length)].id,
      }));
      updateViewingUsers(fresh);
    }, 2100 + Math.random() * 2900);

    return () => clearInterval(intervalId);
  }, [users, tasks, updateViewingUsers]);
};
