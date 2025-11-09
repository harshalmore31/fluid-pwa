import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useAuth } from '../contexts/AuthContext';
import { useDemoData } from '../contexts/DemoDataContext';

const MyTeamsPage = () => {
  const { teams, hackathons, createTeam } = useDemoData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    hackathonId: hackathons[0]?.id ?? '',
    name: '',
    description: '',
    requiredSkills: ''
  });

  const userTeams = useMemo(() => teams.filter((team) => team.memberIds.includes(user?.id ?? '')), [teams, user]);

  const handleCreateTeam = () => {
    if (!user) return;
    const requiredSkills = formData.requiredSkills.split(',').map((skill) => skill.trim()).filter(Boolean);
    const team = createTeam(
      {
        hackathonId: formData.hackathonId,
        name: formData.name || 'Untitled Team',
        description: formData.description,
        requiredSkills
      },
      user
    );
    setShowModal(false);
    navigate(`/dashboard/teams/${team.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-darkBlue">My teams</h2>
        <button
          onClick={() => setShowModal(true)}
          className="rounded-xl bg-mistBlueDark px-4 py-2 text-sm font-semibold text-white shadow"
        >
          + Create team
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {userTeams.map((team) => {
          const hackathon = hackathons.find((h) => h.id === team.hackathonId);
          return (
            <div key={team.id} className="rounded-3xl border border-darkBlue/10 bg-white/80 p-6 shadow">
              <div className="flex items-center justify-between text-xs text-darkBlue/60">
                <span>{hackathon?.name}</span>
                <span>{team.memberIds.length}/{team.maxMembers} members</span>
              </div>
              <h3 className="mt-3 text-xl font-semibold text-darkBlue">{team.name}</h3>
              <p className="text-sm text-darkBlue/70">{team.description}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-darkBlue/70">
                {team.requiredSkills.map((skill) => (
                  <span key={skill} className="rounded-full bg-softGray px-3 py-1">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3 text-sm text-mistBlueDark">
                <button onClick={() => navigate(`/dashboard/teams/${team.id}`)} className="font-medium">
                  Open dashboard
                </button>
                <span>·</span>
                <button className="font-medium">Share invite</button>
              </div>
              <div className="mt-4 rounded-2xl bg-softGray/70 p-4 text-xs text-darkBlue/60">
                <p>Last update {dayjs(team.chat.at(-1)?.createdAt).fromNow()}</p>
                <p>{team.pendingApplications.length} pending applications</p>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-darkBlue/30 p-6">
          <div className="w-full max-w-lg rounded-3xl border border-darkBlue/10 bg-white/90 p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-darkBlue">Create team</h3>
              <button onClick={() => setShowModal(false)} className="text-darkBlue/60">
                ✖
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-darkBlue">Hackathon</label>
                <select
                  value={formData.hackathonId}
                  onChange={(event) => setFormData((prev) => ({ ...prev, hackathonId: event.target.value }))}
                  className="mt-2 w-full rounded-xl border border-darkBlue/20 px-4 py-2"
                >
                  {hackathons.map((hackathon) => (
                    <option key={hackathon.id} value={hackathon.id}>
                      {hackathon.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-darkBlue">Team name</label>
                <input
                  value={formData.name}
                  onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                  className="mt-2 w-full rounded-xl border border-darkBlue/20 px-4 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-darkBlue">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
                  className="mt-2 w-full rounded-xl border border-darkBlue/20 px-4 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-darkBlue">Required skills (comma separated)</label>
                <input
                  value={formData.requiredSkills}
                  onChange={(event) => setFormData((prev) => ({ ...prev, requiredSkills: event.target.value }))}
                  className="mt-2 w-full rounded-xl border border-darkBlue/20 px-4 py-2"
                />
              </div>
              <button
                onClick={handleCreateTeam}
                className="w-full rounded-xl bg-mistBlueDark px-5 py-3 text-sm font-semibold text-white"
              >
                Create team
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTeamsPage;
