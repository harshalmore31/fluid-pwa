import { useState } from 'react';
import { useDemoData } from '../contexts/DemoDataContext';

const FindTeammatesPage = () => {
  const { recommendations } = useDemoData();
  const [activeTab, setActiveTab] = useState<'board' | 'suggestions'>('board');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 rounded-full bg-white/80 p-1 shadow">
        <button
          onClick={() => setActiveTab('board')}
          className={`rounded-full px-4 py-2 text-sm font-medium ${activeTab === 'board' ? 'bg-mistBlue text-darkBlue shadow' : 'text-darkBlue/60'}`}
        >
          Looking for Team Board
        </button>
        <button
          onClick={() => setActiveTab('suggestions')}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            activeTab === 'suggestions' ? 'bg-mistBlue text-darkBlue shadow' : 'text-darkBlue/60'
          }`}
        >
          Smart Suggestions
        </button>
      </div>

      {activeTab === 'board' && (
        <section className="space-y-4">
          <p className="text-sm text-darkBlue/70">Sorted by performance score. Reach out to align on ideas fast.</p>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recommendations.forUser.map((candidate) => (
              <div key={candidate.id} className="rounded-3xl border border-darkBlue/10 bg-white/80 p-6 shadow">
                <div className="flex items-center justify-between text-xs text-darkBlue/60">
                  <span className="text-sm font-semibold text-darkBlue">{candidate.name}</span>
                  <span className="rounded-full bg-softGray px-3 py-1 text-[11px] text-darkBlue">{candidate.badge}</span>
                </div>
                <p className="mt-3 text-sm text-darkBlue/70">Performance score: {candidate.performanceScore}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-darkBlue/70">
                  {candidate.skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-softGray px-3 py-1">
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-xs text-darkBlue/60">{candidate.matchReason}</p>
                <div className="mt-4 flex items-center gap-3 text-sm text-mistBlueDark">
                  <button className="font-medium">Connect</button>
                  <span>·</span>
                  <button className="font-medium">Invite to team</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'suggestions' && (
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-darkBlue">Recommended for your team</h3>
          <p className="text-sm text-darkBlue/70">We compared your current roster with DevSprint requirements.</p>
          <div className="grid gap-4 md:grid-cols-2">
            {recommendations.forTeam.map((candidate) => (
              <div key={candidate.id} className="rounded-3xl border border-darkBlue/10 bg-white/80 p-6 shadow">
                <div className="flex items-center justify-between text-xs text-darkBlue/60">
                  <span className="text-sm font-semibold text-darkBlue">{candidate.name}</span>
                  <span className="rounded-full bg-softGray px-3 py-1 text-[11px] text-darkBlue">{candidate.badge}</span>
                </div>
                <p className="mt-3 text-sm text-darkBlue/70">Performance score: {candidate.performanceScore}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-darkBlue/70">
                  {candidate.skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-softGray px-3 py-1">
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-xs text-darkBlue/60">{candidate.matchReason}</p>
                <button className="mt-4 rounded-xl bg-mistBlueDark px-4 py-2 text-sm font-semibold text-white">
                  Send invite
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default FindTeammatesPage;
