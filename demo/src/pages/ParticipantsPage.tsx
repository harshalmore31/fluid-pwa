import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDemoData } from '../contexts/DemoDataContext';

const ParticipantsPage = () => {
  const { hackathons } = useDemoData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedHackathon, setSelectedHackathon] = useState('all');
  const [onlyLooking, setOnlyLooking] = useState(false);
  const [search, setSearch] = useState('');

  const participants = useMemo(() => {
    return hackathons
      .filter((hackathon) => (selectedHackathon === 'all' ? true : hackathon.id === selectedHackathon))
      .flatMap((hackathon) => hackathon.participants.map((participantId) => ({ hackathon, participantId })));
  }, [hackathons, selectedHackathon]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <select
          value={selectedHackathon}
          onChange={(event) => setSelectedHackathon(event.target.value)}
          className="rounded-full border border-darkBlue/20 bg-white/70 px-4 py-2 text-sm"
        >
          <option value="all">All hackathons</option>
          {hackathons.map((hackathon) => (
            <option key={hackathon.id} value={hackathon.id}>
              {hackathon.name}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-darkBlue/70">
          <input type="checkbox" checked={onlyLooking} onChange={(event) => setOnlyLooking(event.target.checked)} />
          Only show looking for team
        </label>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by skill or branch"
          className="w-full max-w-sm rounded-full border border-darkBlue/20 bg-white/60 px-4 py-2 text-sm"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {participants.map(({ hackathon, participantId }) => (
          <div key={`${hackathon.id}-${participantId}`} className="rounded-2xl border border-darkBlue/10 bg-white/80 p-5 shadow">
            <div className="flex items-center justify-between text-xs text-darkBlue/60">
              <span>{hackathon.name}</span>
              <span>{hackathon.status}</span>
            </div>
            <h3 className="mt-3 text-lg font-semibold text-darkBlue">Profile #{participantId.slice(0, 4)}</h3>
            <p className="text-sm text-darkBlue/70">Performance score: {(participantId.charCodeAt(0) * 3) % 220}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-darkBlue/70">
              {hackathon.requiredSkills.map((skill) => (
                <span key={skill} className="rounded-full bg-softGray px-3 py-1">
                  {skill}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3 text-sm text-mistBlueDark">
              <button className="font-medium">View profile</button>
              <span>·</span>
              <button className="font-medium">Invite</button>
            </div>
          </div>
        ))}
      </div>

      {user && (
        <div className="rounded-3xl border border-darkBlue/10 bg-white/80 p-6 shadow">
          <h3 className="text-lg font-semibold text-darkBlue">Boost your profile visibility</h3>
          <p className="mt-2 text-sm text-darkBlue/70">
            Toggle your “Looking for team” status and update skills to get recommended to leaders instantly.
          </p>
          <button
            onClick={() => navigate('/dashboard/profile')}
            className="mt-4 rounded-xl bg-mistBlueDark px-5 py-2 text-sm font-semibold text-white"
          >
            Update profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ParticipantsPage;
