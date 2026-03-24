import { Task, User, Priority, Status } from '../types';

const usedPriorities: Priority[] = ['Low', 'Medium', 'High', 'Critical'];
const usedStatuses: Status[] = ['To Do', 'In Progress', 'In Review', 'Done'];

export const users: User[] = [
  { id: '1', name: 'Ankit Kumar', avatar: 'AK' },
  { id: '2', name: 'Priya Sharma', avatar: 'PS' },
  { id: '3', name: 'Rajesh Patel', avatar: 'RP' },
  { id: '4', name: 'Neha Singh', avatar: 'NS' },
  { id: '5', name: 'Arjun Verma', avatar: 'AV' },
  { id: '6', name: 'Pooja Gupta', avatar: 'PG' },
];

const adjectives = ['New', 'Improved', 'Critical', 'Minor', 'Major', 'Urgent', 'Quick', 'Refactor'];
const nouns = ['Feature', 'Bug', 'Task', 'Issue', 'Update', 'Story', 'Sprint', 'Deployment'];

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateTasks(count: number): Task[] {
  const tasks: Task[] = [];
  const now = new Date();
  for (let i = 0; i < count; i += 1) {
    const assignee = users[randomBetween(0, users.length - 1)];
    const priority = usedPriorities[randomBetween(0, usedPriorities.length - 1)];
    const status = usedStatuses[randomBetween(0, usedStatuses.length - 1)];

    const startOffset = randomBetween(-30, 90); // around now
    const dueOffset = startOffset + randomBetween(1, 30);

    const startDate = Math.random() > 0.35 ? new Date(now.getTime() + startOffset * 24 * 60 * 60 * 1000) : undefined;
    const dueDate = new Date(now.getTime() + dueOffset * 24 * 60 * 60 * 1000);

    // Force some overdue and due today cases
    if (i % 30 === 0) {
      dueDate.setDate(now.getDate() - randomBetween(1, 15));
    }
    if (i % 25 === 0) {
      dueDate.setDate(now.getDate());
    }

    tasks.push({
      id: `task-${i + 1}`,
      title: `${adjectives[randomBetween(0, adjectives.length - 1)]} ${nouns[randomBetween(0, nouns.length - 1)]} ${i + 1}`,
      assigneeId: assignee.id,
      priority,
      status,
      startDate,
      dueDate,
      createdAt: new Date(now.getTime() - randomBetween(0, 180) * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    });
  }

  return tasks;
}
