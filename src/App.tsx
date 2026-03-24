import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useTaskStore } from './store/useTaskStore';
import { useCollaboration } from './hooks/useCollaboration';
import Filters from './components/Filters';
import KanbanBoard from './components/KanbanBoard';
import ListView from './components/ListView';
import TimelineView from './components/TimelineView';

function App() {
  const { initializeData, viewingUsers } = useTaskStore();

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  useCollaboration();

  const viewerCount = new Set(viewingUsers.map((v) => v.userId)).size;

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <header className="bg-slate-800 text-white p-3 sticky top-0 z-20">
          <div className="container mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-3 text-sm">
              <Link to="/kanban" className="hover:text-slate-300">Kanban</Link>
              <Link to="/list" className="hover:text-slate-300">List</Link>
              <Link to="/timeline" className="hover:text-slate-300">Timeline</Link>
            </div>
            <div className="text-xs">{viewerCount} people viewing</div>
          </div>
          <div className="container mx-auto mt-3">
            <Filters />
          </div>
        </header>

        <main className="container mx-auto pb-6">
          <Routes>
            <Route path="/kanban" element={<KanbanBoard />} />
            <Route path="/list" element={<ListView />} />
            <Route path="/timeline" element={<TimelineView />} />
            <Route path="/" element={<KanbanBoard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;