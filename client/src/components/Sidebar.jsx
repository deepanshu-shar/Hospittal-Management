import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Patients', to: '/patients' },
  { label: 'Doctors', to: '/doctors' },
  { label: 'Appointments', to: '/appointments' },
  { label: 'Billing', to: '/billing' },
  { label: 'Departments', to: '/departments' }
];

const Sidebar = () => (
  <aside className="hidden w-64 flex-col bg-white shadow-lg lg:flex">
    <div className="px-6 py-6 text-2xl font-bold text-primary">PDV Admin</div>
    <nav className="flex-1 px-4 pb-6">
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `block rounded-md px-4 py-3 text-sm font-medium transition hover:bg-primary/10 hover:text-primary ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-slate-600'
                }`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  </aside>
);

export default Sidebar;
