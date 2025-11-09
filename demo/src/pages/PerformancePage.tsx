import dayjs from 'dayjs';
import { useAuth } from '../contexts/AuthContext';
import { useDemoData } from '../contexts/DemoDataContext';

const PerformancePage = () => {
  const { user } = useAuth();
  const { performance } = useDemoData();

  if (!user) return null;

  const winRate = user.totalHackathons ? Math.round((performance.filter((item) => item.round === 'Winner').length / user.totalHackathons) * 100) : 0;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-darkBlue/10 bg-white/80 p-6 shadow">
          <p className="text-xs uppercase tracking-wide text-darkBlue/60">Total Hackathons</p>
          <p className="mt-3 text-3xl font-semibold text-darkBlue">{user.totalHackathons}</p>
        </div>
        <div className="rounded-3xl border border-darkBlue/10 bg-white/80 p-6 shadow">
          <p className="text-xs uppercase tracking-wide text-darkBlue/60">Current Performance Score</p>
          <p className="mt-3 text-3xl font-semibold text-darkBlue">{user.performanceScore}</p>
        </div>
        <div className="rounded-3xl border border-darkBlue/10 bg-white/80 p-6 shadow">
          <p className="text-xs uppercase tracking-wide text-darkBlue/60">Win rate</p>
          <p className="mt-3 text-3xl font-semibold text-darkBlue">{winRate}%</p>
        </div>
      </section>

      <section className="rounded-3xl border border-darkBlue/10 bg-white/80 p-6 shadow">
        <h3 className="text-lg font-semibold text-darkBlue">Badge progression</h3>
        <p className="mt-2 text-sm text-darkBlue/70">
          You are currently an <span className="font-semibold text-darkBlue">{user.badge}</span> builder. Earn {Math.max(0, 200 - user.performanceScore)} more points to reach the next milestone.
        </p>
        <div className="mt-4 grid gap-3 text-sm text-darkBlue/70 md:grid-cols-4">
          <div className={`rounded-2xl border px-4 py-3 ${user.performanceScore < 50 ? 'border-mistBlueDark bg-mistBlue/40' : 'border-darkBlue/10 bg-softGray'}`}>
            Beginner <span className="text-xs text-darkBlue/50">&lt;50</span>
          </div>
          <div className={`rounded-2xl border px-4 py-3 ${user.performanceScore >= 50 && user.performanceScore < 100 ? 'border-mistBlueDark bg-mistBlue/40' : 'border-darkBlue/10 bg-softGray'}`}>
            Intermediate <span className="text-xs text-darkBlue/50">50-100</span>
          </div>
          <div className={`rounded-2xl border px-4 py-3 ${user.performanceScore >= 100 && user.performanceScore < 200 ? 'border-mistBlueDark bg-mistBlue/40' : 'border-darkBlue/10 bg-softGray'}`}>
            Advanced <span className="text-xs text-darkBlue/50">100-200</span>
          </div>
          <div className={`rounded-2xl border px-4 py-3 ${user.performanceScore >= 200 ? 'border-mistBlueDark bg-mistBlue/40' : 'border-darkBlue/10 bg-softGray'}`}>
            Expert <span className="text-xs text-darkBlue/50">200+</span>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-darkBlue/10 bg-white/80 p-6 shadow">
        <h3 className="text-lg font-semibold text-darkBlue">Hackathon history</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-darkBlue/70">
            <thead className="text-xs uppercase tracking-wide text-darkBlue/50">
              <tr>
                <th className="px-4 py-2">Hackathon</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Team</th>
                <th className="px-4 py-2">Round reached</th>
                <th className="px-4 py-2">Points</th>
              </tr>
            </thead>
            <tbody>
              {performance.map((entry) => (
                <tr key={entry.hackathon} className="border-t border-darkBlue/10">
                  <td className="px-4 py-2 font-medium text-darkBlue">{entry.hackathon}</td>
                  <td className="px-4 py-2">{dayjs(entry.date).format('MMM D, YYYY')}</td>
                  <td className="px-4 py-2">{entry.team}</td>
                  <td className="px-4 py-2">{entry.round}</td>
                  <td className="px-4 py-2">{entry.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default PerformancePage;
