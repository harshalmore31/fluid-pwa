import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useAuth } from '../contexts/AuthContext';
import { useDemoData } from '../contexts/DemoDataContext';

const AdminPanelPage = () => {
  const { user } = useAuth();
  const { hackathons } = useDemoData();
  const [activeTab, setActiveTab] = useState<'hackathons' | 'users'>('hackathons');

  const stats = useMemo(() => ({
    totalHackathons: hackathons.length,
    activeTeams: 6,
    totalUsers: 142
  }), [hackathons.length]);

  if (!user?.isAdmin) {
    return <p className="text-sm text-darkBlue/60">You need admin access to view this page.</p>;
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-darkBlue/10 bg-white/80 p-6 text-center shadow">
          <p className="text-xs uppercase tracking-wide text-darkBlue/60">Total users</p>
          <p className="mt-3 text-3xl font-semibold text-darkBlue">{stats.totalUsers}</p>
        </div>
        <div className="rounded-3xl border border-darkBlue/10 bg-white/80 p-6 text-center shadow">
          <p className="text-xs uppercase tracking-wide text-darkBlue/60">Active teams</p>
          <p className="mt-3 text-3xl font-semibold text-darkBlue">{stats.activeTeams}</p>
        </div>
        <div className="rounded-3xl border border-darkBlue/10 bg-white/80 p-6 text-center shadow">
          <p className="text-xs uppercase tracking-wide text-darkBlue/60">Hackathons posted</p>
          <p className="mt-3 text-3xl font-semibold text-darkBlue">{stats.totalHackathons}</p>
        </div>
      </section>

      <div className="flex items-center gap-3 rounded-full bg-white/80 p-1 shadow">
        <button
          onClick={() => setActiveTab('hackathons')}
          className={`rounded-full px-4 py-2 text-sm font-medium ${activeTab === 'hackathons' ? 'bg-mistBlue text-darkBlue shadow' : 'text-darkBlue/60'}`}
        >
          Manage hackathons
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`rounded-full px-4 py-2 text-sm font-medium ${activeTab === 'users' ? 'bg-mistBlue text-darkBlue shadow' : 'text-darkBlue/60'}`}
        >
          Users
        </button>
      </div>

      {activeTab === 'hackathons' && (
        <section className="space-y-4 rounded-3xl border border-darkBlue/10 bg-white/80 p-6 shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-darkBlue">Hackathons</h3>
            <button className="rounded-xl bg-mistBlueDark px-4 py-2 text-sm font-semibold text-white">+ Add hackathon</button>
          </div>
          <table className="min-w-full text-left text-sm text-darkBlue/70">
            <thead className="text-xs uppercase tracking-wide text-darkBlue/50">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Dates</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Team size</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hackathons.map((hackathon) => (
                <tr key={hackathon.id} className="border-t border-darkBlue/10">
                  <td className="px-4 py-2 font-medium text-darkBlue">{hackathon.name}</td>
                  <td className="px-4 py-2">{dayjs(hackathon.startDate).format('MMM D')} - {dayjs(hackathon.endDate).format('MMM D')}</td>
                  <td className="px-4 py-2 capitalize">{hackathon.status}</td>
                  <td className="px-4 py-2">{hackathon.minTeamSize}-{hackathon.maxTeamSize}</td>
                  <td className="px-4 py-2 text-sm text-mistBlueDark">
                    <button className="mr-3">Edit</button>
                    <button className="text-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {activeTab === 'users' && (
        <section className="rounded-3xl border border-darkBlue/10 bg-white/80 p-6 shadow">
          <h3 className="text-lg font-semibold text-darkBlue">Users</h3>
          <p className="mt-2 text-sm text-darkBlue/70">Search, review, and moderate profiles as needed.</p>
          <div className="mt-4 rounded-2xl border border-darkBlue/10 bg-softGray/60 p-6 text-sm text-darkBlue/70">
            <p>Moderation tools coming soon.</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminPanelPage;
