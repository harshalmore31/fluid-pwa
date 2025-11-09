import dayjs from 'dayjs';
import { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDemoData } from '../contexts/DemoDataContext';

const TeamDashboardPage = () => {
  const { id } = useParams();
  const { getTeam, hackathons, reviewApplication, postMessage } = useDemoData();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const team = getTeam(id ?? '');

  if (!team) {
    return <p className="text-sm text-darkBlue/60">Team not found.</p>;
  }

  const hackathon = hackathons.find((h) => h.id === team.hackathonId);
  const isLeader = user?.id === team.leaderId;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;
    postMessage(team.id, user, message);
    setMessage('');
  };

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-darkBlue/10 bg-white/80 p-6 shadow">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-darkBlue/60">{hackathon?.name}</p>
            <h1 className="text-2xl font-semibold text-darkBlue">{team.name}</h1>
            <p className="text-sm text-darkBlue/70">{team.description}</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-darkBlue/60">
            <span className="rounded-full bg-softGray px-3 py-1">{team.memberIds.length}/{team.maxMembers} members</span>
            <span className={`rounded-full px-3 py-1 ${team.isOpen ? 'bg-success/20 text-success' : 'bg-darkBlue/10 text-darkBlue'}`}>
              {team.isOpen ? 'Open for applications' : 'Invite only'}
            </span>
          </div>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-darkBlue/10 bg-white/80 p-6 shadow">
            <h2 className="text-lg font-semibold text-darkBlue">Members</h2>
            <ul className="mt-4 space-y-4">
              {team.memberIds.map((memberId) => (
                <li key={memberId} className="flex items-center justify-between rounded-2xl bg-softGray/60 p-4 text-sm text-darkBlue/70">
                  <div>
                    <p className="text-darkBlue font-medium">Member #{memberId.slice(0, 4)}</p>
                    <p>Role: {memberId === team.leaderId ? 'Team Lead' : 'Contributor'}</p>
                  </div>
                  {isLeader && memberId !== team.leaderId && <button className="text-danger">Remove</button>}
                </li>
              ))}
            </ul>
          </div>

          {isLeader && (
            <div className="rounded-3xl border border-darkBlue/10 bg-white/80 p-6 shadow">
              <h2 className="text-lg font-semibold text-darkBlue">Pending applications</h2>
              {team.pendingApplications.length === 0 ? (
                <p className="mt-3 text-sm text-darkBlue/60">No pending applications.</p>
              ) : (
                <ul className="mt-4 space-y-4">
                  {team.pendingApplications.map((application) => (
                    <li key={application.id} className="rounded-2xl bg-softGray/70 p-4 text-sm text-darkBlue/70">
                      <p className="font-medium text-darkBlue">Member #{application.userId.slice(0, 4)}</p>
                      <p className="mt-1 text-xs text-darkBlue/60">{application.message}</p>
                      <div className="mt-3 flex items-center gap-3">
                        <button
                          className="rounded-lg bg-success px-3 py-1 text-xs font-semibold text-white"
                          onClick={() => reviewApplication(team.id, application.id, 'accepted')}
                        >
                          Accept
                        </button>
                        <button
                          className="rounded-lg bg-danger/90 px-3 py-1 text-xs font-semibold text-white"
                          onClick={() => reviewApplication(team.id, application.id, 'rejected')}
                        >
                          Reject
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-darkBlue/10 bg-white/80 p-6 shadow">
            <h2 className="text-lg font-semibold text-darkBlue">Team chat</h2>
            <div className="mt-4 h-64 overflow-y-auto space-y-3">
              {team.chat.map((entry) => (
                <div key={entry.id} className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                  entry.userId === user?.id ? 'ml-auto bg-mistBlue text-darkBlue' : 'bg-softGray/80 text-darkBlue/80'
                }`}>
                  <p className="font-medium">{entry.userId === user?.id ? 'You' : `Member #${entry.userId.slice(0, 4)}`}</p>
                  <p>{entry.message}</p>
                  <p className="text-[10px] text-darkBlue/50">{dayjs(entry.createdAt).format('MMM D, h:mm A')}</p>
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Share an update"
                className="flex-1 rounded-full border border-darkBlue/20 px-4 py-2 text-sm"
              />
              <button type="submit" className="rounded-full bg-mistBlueDark px-4 py-2 text-sm font-semibold text-white">
                Send
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-darkBlue/10 bg-white/80 p-6 shadow">
            <h2 className="text-lg font-semibold text-darkBlue">Settings</h2>
            <ul className="mt-4 space-y-3 text-sm text-darkBlue/70">
              <li>• Update team visibility</li>
              <li>• Share invite link</li>
              <li>• Leave team (before hackathon starts)</li>
              {isLeader && <li>• Disband team</li>}
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default TeamDashboardPage;
