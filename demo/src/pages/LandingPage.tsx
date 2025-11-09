import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const bentoCards = [
  {
    title: 'Skill-based Matching',
    description: 'Smart pairing with people whose skills complement yours.',
    emoji: '🧠'
  },
  {
    title: 'Performance Tracking',
    description: 'Earn badges as you conquer more hackathons.',
    emoji: '🏆'
  },
  {
    title: 'Previous Teammate Network',
    description: 'Reconnect with partners who already trust your work.',
    emoji: '🤝'
  },
  {
    title: 'Live Hackathon Feed',
    description: 'See what the campus is building this month.',
    emoji: '🗓️'
  },
  {
    title: 'Smart Suggestions',
    description: 'Get curated teammate recommendations instantly.',
    emoji: '✨'
  },
  {
    title: 'Seamless Team Chat',
    description: 'Stay in sync with built-in real-time collaboration.',
    emoji: '💬'
  }
];

const LandingPage = () => {
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const message = login(email.trim().toLowerCase());
    if (message) {
      setError(message);
      return;
    }
    if (user && user.onboarded) {
      navigate('/dashboard');
    } else {
      navigate('/onboarding');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-mistBlue via-softGray to-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(69,123,157,0.3),_transparent_65%)]" />
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
        <div className="flex items-center gap-2 text-lg font-semibold text-darkBlue">
          <span className="rounded-full bg-white/60 px-3 py-1">⚡</span>
          TeamSync
        </div>
        <button
          onClick={() => navigate(user ? '/dashboard' : '#signin')}
          className="rounded-full bg-darkBlue px-5 py-2 text-sm font-medium text-white shadow-lg shadow-darkBlue/10 transition hover:bg-mistBlueDark"
        >
          {user ? 'Go to dashboard' : 'Sign in'}
        </button>
      </header>

      <main className="mx-auto mt-10 flex max-w-6xl flex-col gap-16 px-6 pb-20">
        <section className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h1 className="text-4xl font-bold text-darkBlue sm:text-5xl">
              Find Your Dream Team for Every Hackathon
            </h1>
            <p className="mt-4 max-w-xl text-lg text-darkBlue/70">
              TeamSync is VIT&apos;s exclusive space for meeting collaborators, tracking hackathon growth, and shipping
              winning prototypes with confidence.
            </p>
            <form
              id="signin"
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col gap-3 rounded-2xl border border-darkBlue/10 bg-white/80 p-6 shadow-xl shadow-mistBlue/20 backdrop-blur"
            >
              <label className="text-sm font-medium text-darkBlue">Sign in with your VIT email</label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@vit.edu.in"
                  className="flex-1 rounded-xl border border-darkBlue/20 bg-white/70 px-4 py-3 text-darkBlue shadow-inner focus:border-mistBlueDark focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-mistBlueDark px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-mistBlueDark/20 transition hover:bg-darkBlue"
                >
                  Send magic link
                </button>
              </div>
              {error && <p className="text-sm text-danger">{error}</p>}
              <p className="text-xs text-darkBlue/60">We only allow @vit.edu.in addresses to keep the community secure.</p>
            </form>
          </div>
          <div className="relative hidden rounded-3xl bg-white/70 p-10 shadow-2xl shadow-mistBlue/30 lg:flex">
            <div className="absolute inset-0 -z-10 rounded-3xl bg-[radial-gradient(circle_at_top,_rgba(168,218,220,0.6),_transparent_70%)]" />
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-darkBlue">Activity Snapshot</h3>
                <ul className="mt-4 space-y-4 text-sm text-darkBlue/80">
                  <li className="rounded-2xl bg-softGray/80 p-4">
                    <p className="font-medium text-darkBlue">Pixel Pioneers</p>
                    <p>Ananya accepted Rohith&apos;s application</p>
                  </li>
                  <li className="rounded-2xl bg-softGray/80 p-4">
                    <p className="font-medium text-darkBlue">ETHIndia Campus Edition</p>
                    <p>12 VIT builders are preparing pitches</p>
                  </li>
                  <li className="rounded-2xl bg-softGray/80 p-4">
                    <p className="font-medium text-darkBlue">Smart Suggestions</p>
                    <p>3 new teammates match your AI skill gaps</p>
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl bg-mistBlue/40 p-5 text-sm text-darkBlue">
                <p className="font-semibold">Performance Badges</p>
                <p>Earn Beginner → Expert badges as you dominate each hackathon season.</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bentoCards.map((card) => (
              <div key={card.title} className="rounded-3xl border border-darkBlue/10 bg-white/70 p-6 shadow-lg shadow-mistBlue/15">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{card.emoji}</span>
                  <h3 className="text-lg font-semibold text-darkBlue">{card.title}</h3>
                </div>
                <p className="mt-3 text-sm text-darkBlue/70">{card.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
