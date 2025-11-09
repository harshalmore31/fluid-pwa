import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDemoData } from '../contexts/DemoDataContext';

const tabOptions = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' }
] as const;

const HackathonsPage = () => {
  const { hackathons, markParticipating } = useDemoData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<(typeof tabOptions)[number]['key']>('upcoming');
  const [skillFilter, setSkillFilter] = useState('');

  const filteredHackathons = useMemo(() => {
    return hackathons
      .filter((hackathon) => hackathon.status === activeTab)
      .filter((hackathon) =>
        skillFilter ? hackathon.requiredSkills.some((skill) => skill.toLowerCase().includes(skillFilter.toLowerCase())) : true
      );
  }, [hackathons, activeTab, skillFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 rounded-full bg-white/70 p-1 shadow-md shadow-mistBlue/20">
          {tabOptions.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeTab === tab.key ? 'bg-mistBlue text-darkBlue shadow' : 'text-darkBlue/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <input
          value={skillFilter}
          onChange={(event) => setSkillFilter(event.target.value)}
          placeholder="Filter by skill"
          className="w-full max-w-xs rounded-full border border-darkBlue/20 bg-white/60 px-4 py-2 text-sm"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredHackathons.map((hackathon) => (
          <article key={hackathon.id} className="rounded-3xl border border-darkBlue/10 bg-white/80 shadow-lg shadow-mistBlue/10">
            <div className="h-40 overflow-hidden rounded-t-3xl">
              <img src={hackathon.bannerUrl} alt={hackathon.name} className="h-full w-full object-cover" />
            </div>
            <div className="space-y-4 p-6">
              <div className="flex items-center justify-between text-xs text-darkBlue/60">
                <span>{hackathon.organizer}</span>
                <span>{dayjs(hackathon.startDate).format('MMM D')} - {dayjs(hackathon.endDate).format('MMM D')}</span>
              </div>
              <h3 className="text-xl font-semibold text-darkBlue">{hackathon.name}</h3>
              <p className="text-sm text-darkBlue/70">Team size {hackathon.minTeamSize}-{hackathon.maxTeamSize}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                {hackathon.requiredSkills.map((skill) => (
                  <span key={skill} className="rounded-full bg-softGray px-3 py-1 text-darkBlue/70">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-darkBlue/60">
                <span>{hackathon.participants.length} VIT builders</span>
                <span>Deadline {dayjs(hackathon.registrationDeadline).fromNow()}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(`/dashboard/hackathons/${hackathon.id}`)}
                  className="flex-1 rounded-xl bg-mistBlueDark px-4 py-2 text-sm font-semibold text-white"
                >
                  View details
                </button>
                <button
                  onClick={() => user && markParticipating(hackathon.id, user.id, !hackathon.participants.includes(user.id))}
                  className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                    user && hackathon.participants.includes(user.id)
                      ? 'bg-success/10 text-success'
                      : 'bg-softGray text-darkBlue'
                  }`}
                >
                  {user && hackathon.participants.includes(user.id) ? 'Participating' : "I'm in"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default HackathonsPage;
