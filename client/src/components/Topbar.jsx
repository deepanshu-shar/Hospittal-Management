import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Topbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSignOut = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="text-lg font-semibold text-slate-700">PDV MANAGEMENT</div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <div className="text-sm font-semibold text-slate-800">{user?.name || 'Administrator'}</div>
          <div className="text-xs text-slate-500">{user?.role || 'Admin'}</div>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-primary hover:bg-primary hover:text-white"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
};

export default Topbar;
