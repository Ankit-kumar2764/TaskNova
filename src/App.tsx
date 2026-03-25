import { useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { useTaskStore } from './store/useTaskStore';
import { useCollaboration } from './hooks/useCollaboration';
import { useAuth } from './context/AuthContext';
import Filters from './components/Filters';
import KanbanBoard from './components/KanbanBoard';
import ListView from './components/ListView';
import TimelineView from './components/TimelineView';
import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute';

function Dashboard() {
  const { initializeData, viewingUsers } = useTaskStore();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  useCollaboration();

  const viewerCount = new Set(viewingUsers.map((v) => v.userId)).size;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-800 text-white p-2 sm:p-3 sm:sticky sm:top-0 z-20 shadow-lg">
        <div className="container mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="flex gap-2 sm:gap-3 text-xs sm:text-sm flex-wrap">
              <Link to="/dashboard" className="hover:text-slate-300">Kanban</Link>
              <Link to="/dashboard/list" className="hover:text-slate-300">List</Link>
              <Link to="/dashboard/timeline" className="hover:text-slate-300">Timeline</Link>
            </div>
            <div className="text-xs text-slate-300">{viewerCount} people viewing</div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs sm:text-sm text-slate-300">Welcome, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="px-2 sm:px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs sm:text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="container mx-auto mt-2 sm:mt-3">
          <Filters />
        </div>
      </header>

      <main className="container mx-auto pb-6 px-2 sm:px-4 pt-4 sm:pt-0 min-h-[calc(100vh-100px)] sm:min-h-[calc(100vh-140px)]">
        <Routes>
          <Route path="/" element={<KanbanBoard />} />
          <Route path="/list" element={<ListView />} />
          <Route path="/timeline" element={<TimelineView />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;