import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const branches = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical Engineering', 'Biotechnology'];
const interests = ['AI/ML', 'Web Development', 'Blockchain', 'Product Design', 'IoT', 'AR/VR'];
const skills = ['React', 'TypeScript', 'Node.js', 'Python', 'TensorFlow', 'Solidity', 'Figma', 'UI/UX', 'Firebase'];

const Onboarding = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: user?.name ?? '',
    rollNo: user?.rollNo ?? '',
    branch: user?.branch ?? '',
    year: user?.year ?? 1,
    bio: user?.bio ?? '',
    skills: user?.skills ?? [],
    interests: user?.interests ?? [],
    github: user?.github ?? '',
    linkedin: user?.linkedin ?? '',
    portfolio: user?.portfolio ?? ''
  });

  if (!user) return null;

  const toggleValue = (field: 'skills' | 'interests', value: string) => {
    setFormData((prev) => {
      const nextValues = prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value];
      return { ...prev, [field]: nextValues };
    });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    updateProfile({ ...formData, onboarded: true });
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-mistBlue/60 via-softGray to-white">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl rounded-3xl bg-white/80 p-10 shadow-2xl shadow-mistBlue/30">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-darkBlue">Complete your TeamSync profile</h2>
          <span className="text-sm font-medium text-darkBlue/60">Step {step} of 4</span>
        </div>

        {step === 1 && (
          <div className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-medium text-darkBlue">Full name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-darkBlue/20 px-4 py-3"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-darkBlue">Roll number</label>
                <input
                  type="text"
                  required
                  value={formData.rollNo}
                  onChange={(event) => setFormData((prev) => ({ ...prev, rollNo: event.target.value }))}
                  className="mt-2 w-full rounded-xl border border-darkBlue/20 px-4 py-3"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-darkBlue">Year</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={formData.year}
                  onChange={(event) => setFormData((prev) => ({ ...prev, year: Number(event.target.value) }))}
                  className="mt-2 w-full rounded-xl border border-darkBlue/20 px-4 py-3"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-darkBlue">Branch</label>
              <select
                required
                value={formData.branch}
                onChange={(event) => setFormData((prev) => ({ ...prev, branch: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-darkBlue/20 px-4 py-3"
              >
                <option value="" disabled>
                  Select branch
                </option>
                {branches.map((branch) => (
                  <option key={branch}>{branch}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mt-8">
            <p className="text-sm font-medium text-darkBlue">Choose your skill set</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {skills.map((skill) => {
                const active = formData.skills.includes(skill);
                return (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => toggleValue('skills', skill)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      active ? 'border-mistBlueDark bg-mistBlue text-darkBlue' : 'border-darkBlue/20 bg-white'
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="mt-8 space-y-6">
            <div>
              <p className="text-sm font-medium text-darkBlue">Interests</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {interests.map((interest) => {
                  const active = formData.interests.includes(interest);
                  return (
                    <button
                      type="button"
                      key={interest}
                      onClick={() => toggleValue('interests', interest)}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        active ? 'border-mistBlueDark bg-mistBlue text-darkBlue' : 'border-darkBlue/20 bg-white'
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-darkBlue">Bio</label>
              <textarea
                rows={4}
                maxLength={150}
                value={formData.bio}
                onChange={(event) => setFormData((prev) => ({ ...prev, bio: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-darkBlue/20 px-4 py-3"
              />
              <p className="mt-1 text-xs text-darkBlue/50">Tell teammates how you love to work (150 characters).</p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="mt-8 space-y-4">
            <div>
              <label className="text-sm font-medium text-darkBlue">GitHub</label>
              <input
                type="url"
                value={formData.github}
                onChange={(event) => setFormData((prev) => ({ ...prev, github: event.target.value }))}
                placeholder="https://github.com/you"
                className="mt-2 w-full rounded-xl border border-darkBlue/20 px-4 py-3"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-darkBlue">LinkedIn</label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(event) => setFormData((prev) => ({ ...prev, linkedin: event.target.value }))}
                placeholder="https://linkedin.com/in/you"
                className="mt-2 w-full rounded-xl border border-darkBlue/20 px-4 py-3"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-darkBlue">Portfolio</label>
              <input
                type="url"
                value={formData.portfolio}
                onChange={(event) => setFormData((prev) => ({ ...prev, portfolio: event.target.value }))}
                placeholder="https://yourportfolio.dev"
                className="mt-2 w-full rounded-xl border border-darkBlue/20 px-4 py-3"
              />
            </div>
          </div>
        )}

        <div className="mt-10 flex items-center justify-between">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep((prev) => Math.max(1, prev - 1))}
            className="rounded-xl border border-darkBlue/20 px-4 py-2 text-sm font-medium text-darkBlue/70 disabled:opacity-40"
          >
            Back
          </button>
          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => Math.min(4, prev + 1))}
              className="rounded-xl bg-mistBlueDark px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-mistBlueDark/20"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="rounded-xl bg-success px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-success/20"
            >
              Complete profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Onboarding;
