import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';

const metricsConfig = [
  { key: 'patients', label: 'Patients', accent: 'bg-primary/10 text-primary' },
  { key: 'doctors', label: 'Doctors', accent: 'bg-emerald-100 text-emerald-600' },
  { key: 'appointments', label: 'Appointments', accent: 'bg-indigo-100 text-indigo-600' },
  { key: 'billing', label: 'Invoices', accent: 'bg-amber-100 text-amber-600' }
];

const DashboardPage = () => {
  const [summary, setSummary] = useState({ patients: 0, doctors: 0, appointments: 0, billing: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
  const { data } = await apiClient.get('/v1/dashboard/summary');
        setSummary(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return <div className="text-sm text-slate-500">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Overview of critical hospital indicators.</p>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricsConfig.map((metric) => (
          <article key={metric.key} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{metric.label}</div>
            <div className="mt-3 flex items-baseline space-x-2">
              <div className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${metric.accent}`}>
                {summary[metric.key] ?? 0}
              </div>
              <span className="text-xs text-slate-400">Records</span>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default DashboardPage;
