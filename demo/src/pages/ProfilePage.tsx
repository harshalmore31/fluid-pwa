import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { mockUsers, performanceHistory } from '../data/mockData';

const ProfilePage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const profile = useMemo(() => {
    if (id) {
      return mockUsers.find((candidate) => candidate.id === id) ?? null;
    }
    return user;
  }, [id, user]);

  if (!profile) {
    return <p className="text-sm text-darkBlue/60">Profile not found.</p>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="rounded-3xl border border-darkBlue/10 bg-white/80 p-6 text-center shadow">
        <img src={profile.profilePicture} alt={profile.name} className="mx-auto h-28 w-28 rounded-full object-cover" />
        <h2 className="mt-4 text-xl font-semibold text-darkBlue">{profile.name}</h2>
        <p className="text-sm text-darkBlue/60">{profile.branch} · Year {profile.year}</p>
        <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-mistBlue px-4 py-1 text-sm font-medium text-darkBlue">
          {profile.badge} · {profile.performanceScore} pts
        </span>
        <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-darkBlue/70">
          {profile.skills.map((skill) => (
            <span key={skill} className="rounded-full bg-softGray px-3 py-1">
              {skill}
            </span>
          ))}
        </div>
        <div className="mt-6 space-y-2 text-sm text-mistBlueDark">
          {profile.github && (
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
          )}
          {profile.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn ↗
            </a>
          )}
          {profile.portfolio && (
            <a href={profile.portfolio} target="_blank" rel="noreferrer">
              Portfolio ↗
            </a>
          )}
        </div>
        <button className="mt-6 w-full rounded-xl bg-mistBlueDark px-4 py-2 text-sm font-semibold text-white">
          {profile.id === user?.id ? 'Edit profile' : 'Connect'}
        </button>
      </aside>

      <section className="space-y-6">
        <div className="rounded-3xl border border-darkBlue/10 bg-white/80 p-6 shadow">
          <h3 className="text-lg font-semibold text-darkBlue">About</h3>
          <p className="mt-2 text-sm text-darkBlue/70">{profile.bio}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-darkBlue/10 bg-white/80 p-4 text-center">
            <p className="text-xs uppercase tracking-wide text-darkBlue/60">Hackathons</p>
            <p className="mt-2 text-2xl font-semibold text-darkBlue">{profile.totalHackathons}</p>
          </div>
          <div className="rounded-2xl border border-darkBlue/10 bg-white/80 p-4 text-center">
            <p className="text-xs uppercase tracking-wide text-darkBlue/60">Connections</p>
            <p className="mt-2 text-2xl font-semibold text-darkBlue">{profile.connections.length}</p>
          </div>
          <div className="rounded-2xl border border-darkBlue/10 bg-white/80 p-4 text-center">
            <p className="text-xs uppercase tracking-wide text-darkBlue/60">Best result</p>
            <p className="mt-2 text-2xl font-semibold text-darkBlue">Finalist 🏆</p>
          </div>
        </div>

        <div className="rounded-3xl border border-darkBlue/10 bg-white/80 p-6 shadow">
          <h3 className="text-lg font-semibold text-darkBlue">Hackathon history</h3>
          <ul className="mt-4 space-y-4 text-sm text-darkBlue/70">
            {performanceHistory.map((entry) => (
              <li key={entry.hackathon} className="rounded-2xl bg-softGray/60 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-darkBlue">{entry.hackathon}</span>
                  <span className="text-xs text-darkBlue/60">{entry.round}</span>
                </div>
                <p className="mt-1 text-xs text-darkBlue/60">Team {entry.team} · {entry.points} pts · {entry.date}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
