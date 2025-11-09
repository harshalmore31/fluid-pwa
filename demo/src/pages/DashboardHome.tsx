import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDemoData } from '../contexts/DemoDataContext';

const DashboardHome = () => {
  const { user } = useAuth();
  const { hackathons, activity, recommendations } = useDemoData();
  const navigate = useNavigate();

  const upcomingHackathons = hackathons.filter((hackathon) => hackathon.status !== 'completed').slice(0, 5);

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <section className="rounded-3xl border border-darkBlue/10 bg-white/80 p-6 shadow-lg shadow-mistBlue/10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-darkBlue">Upcoming Hackathons</h3>
            <button
              onClick={() => navigate('/dashboard/hackathons')}
              className="text-sm font-medium text-mistBlueDark hover:underline"
            >
              View all
            </button>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {upcomingHackathons.map((hackathon) => (
              <div
                key={hackathon.id}
                className="relative overflow-hidden rounded-2xl border border-darkBlue/10 bg-gradient-to-br from-white to-softGray/60 p-4"
              >
                <div className="flex items-center justify-between text-xs text-darkBlue/60">
                  <span>{hackathon.organizer}</span>
                  <span>{dayjs(hackathon.startDate).format('MMM D')} - {dayjs(hackathon.endDate).format('MMM D')}</span>
                </div>
                <h4 className="mt-3 text-lg font-semibold text-darkBlue">{hackathon.name}</h4>
                <p className="mt-2 text-sm text-darkBlue/70">Team size {hackathon.minTeamSize}-{hackathon.maxTeamSize}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-darkBlue/70">
                  {hackathon.requiredSkills.map((skill) => (
                    <span key={skill} className="rounded-full bg-softGray px-3 py-1">{skill}</span>
                  ))}
                </div>
                <button
                  onClick={() => navigate(`/dashboard/hackathons/${hackathon.id}`)}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-mistBlueDark"
                >
                  View details →
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <button
            onClick={() => navigate('/dashboard/teams')}
            className="rounded-3xl bg-gradient-to-br from-mistBlueDark to-darkBlue p-6 text-left text-white shadow-lg shadow-darkBlue/30"
          >
            <p className="text-sm uppercase tracking-wide text-white/70">Quick action</p>
            <h3 className="mt-2 text-2xl font-semibold">Create a Team</h3>
            <p className="mt-3 text-sm text-white/80">Lead the next winning squad. Add roles, required skills & invite members.</p>
          </button>
          <button
            onClick={() => navigate('/dashboard/find-teammates')}
            className="rounded-3xl border border-darkBlue/10 bg-white/80 p-6 text-left text-darkBlue shadow-lg shadow-mistBlue/10"
          >
            <p className="text-sm uppercase tracking-wide text-darkBlue/50">Quick action</p>
            <h3 className="mt-2 text-2xl font-semibold">Find Teammates</h3>
            <p className="mt-3 text-sm text-darkBlue/70">Discover people with complementary skills and matching performance.</p>
          </button>
        </section>

        <section className="rounded-3xl border border-darkBlue/10 bg-white/80 p-6 shadow-lg shadow-mistBlue/10">
          <h3 className="text-lg font-semibold text-darkBlue">Activity Feed</h3>
          <ul className="mt-4 space-y-4">
            {activity.map((item) => (
              <li key={item.id} className="rounded-2xl border border-darkBlue/10 bg-softGray/60 p-4">
                <p className="text-sm font-medium text-darkBlue">{item.message}</p>
                <p className="text-xs text-darkBlue/60">{dayjs(item.timestamp).fromNow()}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-darkBlue/10 bg-white/80 p-6 shadow-lg shadow-mistBlue/10">
          <h3 className="text-lg font-semibold text-darkBlue">Recommended for you</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {recommendations.forUser.map((candidate) => (
              <div key={candidate.id} className="rounded-2xl border border-darkBlue/10 bg-softGray/60 p-4">
                <div className="flex items-center justify-between text-xs text-darkBlue/60">
                  <span className="font-semibold text-darkBlue">{candidate.name}</span>
                  <span className="rounded-full bg-white px-3 py-1 text-[11px] font-medium text-darkBlue">{candidate.badge}</span>
                </div>
                <p className="mt-2 text-sm text-darkBlue/70">{candidate.skills.join(', ')}</p>
                <p className="mt-2 text-xs text-darkBlue/60">{candidate.matchReason}</p>
                <button className="mt-3 text-sm font-medium text-mistBlueDark">Connect</button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <aside className="space-y-6">
        <div className="rounded-3xl border border-darkBlue/10 bg-white/90 p-6 text-center shadow-lg shadow-mistBlue/10">
          <img
            src={user?.profilePicture}
            alt={user?.name}
            className="mx-auto h-24 w-24 rounded-full object-cover"
          />
          <h3 className="mt-4 text-xl font-semibold text-darkBlue">{user?.name || 'Complete profile'}</h3>
          <p className="text-sm text-darkBlue/60">{user?.branch} · Year {user?.year}</p>
          <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-mistBlue px-4 py-1 text-sm font-medium text-darkBlue">
            {user?.badge} · {user?.performanceScore} pts
          </span>
          <div className="mt-5 grid grid-cols-3 gap-3 text-xs text-darkBlue/70">
            <div>
              <p className="text-lg font-semibold text-darkBlue">{user?.totalHackathons ?? 0}</p>
              <p>Hackathons</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-darkBlue">{user?.connections.length ?? 0}</p>
              <p>Connections</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-darkBlue">{user?.skills.length ?? 0}</p>
              <p>Skills</p>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-darkBlue/10 bg-white/90 p-6 shadow-lg shadow-mistBlue/10">
          <h3 className="text-lg font-semibold text-darkBlue">Team insights</h3>
          <ul className="mt-4 space-y-4 text-sm text-darkBlue/70">
            <li>Pixel Pioneers is 2/4 members · Looking for Firebase specialist</li>
            <li>Data Mavericks shared SIH finals notes · 12 views</li>
            <li>3 teammates endorsed your React skills last week</li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default DashboardHome;
