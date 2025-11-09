import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDemoData } from '../contexts/DemoDataContext';

const tabs = ['Overview', 'Participants', 'Teams'] as const;

const HackathonDetailPage = () => {
  const { id } = useParams();
  const { getHackathon, hackathons, teams } = useDemoData();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('Overview');
  const [skillFilter, setSkillFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const hackathon = getHackathon(id ?? '');
  const participants = useMemo(() => {
    if (!hackathon) return [];
    return hackathon.participants
      .map((participantId) => hackathons.flatMap((h) => h.participants).includes(participantId))
      ? hackathon.participants
      : [];
  }, [hackathon, hackathons]);

  if (!hackathon) {
    return <p className="text-sm text-darkBlue/60">Hackathon not found.</p>;
  }

  const relatedTeams = teams.filter((team) => team.hackathonId === hackathon.id);
  const filteredTeams = relatedTeams.filter((team) => {
    if (statusFilter === 'open') return team.isOpen && team.memberIds.length < team.maxMembers;
    if (statusFilter === 'invite') return !team.isOpen;
    if (statusFilter === 'full') return team.memberIds.length >= team.maxMembers;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl border border-darkBlue/10 bg-white/80 shadow-lg shadow-mistBlue/10">
        <div className="h-48 w-full overflow-hidden">
          <img src={hackathon.bannerUrl} alt={hackathon.name} className="h-full w-full object-cover" />
        </div>
        <div className="space-y-4 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-darkBlue/60">
            <span className="rounded-full bg-softGray px-3 py-1 text-darkBlue">{hackathon.organizer}</span>
            <div className="flex items-center gap-3">
              <span>{dayjs(hackathon.startDate).format('MMM D')} - {dayjs(hackathon.endDate).format('MMM D')}</span>
              <span>Deadline {dayjs(hackathon.registrationDeadline).format('MMM D')}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-darkBlue">{hackathon.name}</h1>
              <p className="text-sm text-darkBlue/70">Team size {hackathon.minTeamSize}-{hackathon.maxTeamSize}</p>
            </div>
            <button
              className="rounded-xl bg-mistBlueDark px-5 py-2 text-sm font-semibold text-white"
              onClick={() => window.open(hackathon.externalLink, '_blank')}
            >
              View official page
            </button>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-darkBlue/70">
            {hackathon.requiredSkills.map((skill) => (
              <span key={skill} className="rounded-full bg-softGray px-3 py-1">{skill}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 rounded-full bg-white/70 p-1 shadow-md shadow-mistBlue/20">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeTab === tab ? 'bg-mistBlue text-darkBlue shadow' : 'text-darkBlue/60'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        {activeTab !== 'Overview' && (
          <input
            value={skillFilter}
            onChange={(event) => setSkillFilter(event.target.value)}
            placeholder="Filter by skill"
            className="w-full max-w-xs rounded-full border border-darkBlue/20 bg-white/60 px-4 py-2 text-sm"
          />
        )}
      </div>

      {activeTab === 'Overview' && (
        <section className="space-y-4 rounded-3xl border border-darkBlue/10 bg-white/80 p-6 shadow-lg shadow-mistBlue/10">
          <h3 className="text-lg font-semibold text-darkBlue">What to expect</h3>
          <p className="text-sm text-darkBlue/70">{hackathon.description}</p>
          <ul className="grid gap-3 text-sm text-darkBlue/70 sm:grid-cols-2">
            <li>• Participating VIT teams: {relatedTeams.length}</li>
            <li>• Registered builders: {hackathon.participants.length}</li>
            <li>• Required skills: {hackathon.requiredSkills.join(', ')}</li>
            <li>• Status: {hackathon.status}</li>
          </ul>
        </section>
      )}

      {activeTab === 'Participants' && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-sm text-darkBlue/60">
            <span>Showing {participants.length} participants</span>
            {user && (
              <span className="rounded-full bg-mistBlue/60 px-3 py-1 text-xs text-darkBlue">
                {hackathon.participants.includes(user.id) ? 'You are participating' : 'You have not joined yet'}
              </span>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {participants.map((participantId) => (
              <div key={participantId} className="rounded-2xl border border-darkBlue/10 bg-white/80 p-4 shadow">
                <p className="text-sm font-semibold text-darkBlue">Profile #{participantId.slice(0, 4)}</p>
                <p className="mt-2 text-xs text-darkBlue/60">Skills matched with requirements</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-darkBlue/70">
                  {hackathon.requiredSkills
                    .filter((skill) => skill.toLowerCase().includes(skillFilter.toLowerCase()))
                    .map((skill) => (
                      <span key={skill} className="rounded-full bg-softGray px-3 py-1">
                        {skill}
                      </span>
                    ))}
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-mistBlueDark">
                  <button className="font-medium">Invite to team</button>
                  <span>·</span>
                  <button className="font-medium">View profile</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'Teams' && (
        <section className="space-y-5">
          <div className="flex flex-wrap items-center gap-3 text-sm text-darkBlue/60">
            <span>Showing {filteredTeams.length} teams</span>
            <div className="flex items-center gap-2 rounded-full bg-white/70 p-1">
              {[
                { key: 'all', label: 'All' },
                { key: 'open', label: 'Open' },
                { key: 'full', label: 'Full' },
                { key: 'invite', label: 'Invite only' }
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => setStatusFilter(option.key)}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    statusFilter === option.key ? 'bg-mistBlue text-darkBlue shadow' : 'text-darkBlue/60'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredTeams.map((team) => (
              <div key={team.id} className="rounded-2xl border border-darkBlue/10 bg-white/80 p-4 shadow">
                <h4 className="text-lg font-semibold text-darkBlue">{team.name}</h4>
                <p className="text-sm text-darkBlue/60">Leader: {team.leaderId}</p>
                <p className="mt-2 text-xs text-darkBlue/60">{team.memberIds.length}/{team.maxMembers} members</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-darkBlue/70">
                  {team.requiredSkills.map((skill) => (
                    <span key={skill} className="rounded-full bg-softGray px-3 py-1">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-mistBlueDark">
                  {team.isOpen ? (
                    <button className="font-medium">Apply</button>
                  ) : (
                    <span className="rounded-full bg-softGray px-3 py-1 text-darkBlue/70">Invite only</span>
                  )}
                  <span>·</span>
                  <button className="font-medium">View team</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default HackathonDetailPage;
