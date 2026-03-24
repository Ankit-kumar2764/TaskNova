import { User } from '../types';

export const Avatar = ({ user }: { user: User }) => (
  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
    {user.avatar}
  </div>
);
