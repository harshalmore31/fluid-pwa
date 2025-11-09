import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const SettingsPage = () => {
  const { user } = useAuth();
  const [visibility, setVisibility] = useState({ skills: true, socials: true, performance: true });
  const [notifications, setNotifications] = useState({ email: true, product: true });

  if (!user) return null;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-darkBlue/10 bg-white/80 p-6 shadow">
        <h3 className="text-lg font-semibold text-darkBlue">Account</h3>
        <p className="mt-2 text-sm text-darkBlue/70">Signed in as {user.email}</p>
        <button className="mt-4 rounded-xl bg-mistBlueDark px-4 py-2 text-sm font-semibold text-white">Reset password</button>
      </section>

      <section className="rounded-3xl border border-darkBlue/10 bg-white/80 p-6 shadow">
        <h3 className="text-lg font-semibold text-darkBlue">Profile visibility</h3>
        <div className="mt-4 space-y-3 text-sm text-darkBlue/70">
          {[
            { key: 'skills', label: 'Show skills & interests' },
            { key: 'socials', label: 'Display social links' },
            { key: 'performance', label: 'Share performance badge' }
          ].map((item) => (
            <label key={item.key} className="flex items-center justify-between rounded-2xl bg-softGray/60 p-4">
              <span>{item.label}</span>
              <input
                type="checkbox"
                checked={visibility[item.key as keyof typeof visibility]}
                onChange={(event) =>
                  setVisibility((prev) => ({ ...prev, [item.key]: event.target.checked }))
                }
              />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-darkBlue/10 bg-white/80 p-6 shadow">
        <h3 className="text-lg font-semibold text-darkBlue">Notifications</h3>
        <div className="mt-4 space-y-3 text-sm text-darkBlue/70">
          {[
            { key: 'email', label: 'Email updates' },
            { key: 'product', label: 'Product announcements' }
          ].map((item) => (
            <label key={item.key} className="flex items-center justify-between rounded-2xl bg-softGray/60 p-4">
              <span>{item.label}</span>
              <input
                type="checkbox"
                checked={notifications[item.key as keyof typeof notifications]}
                onChange={(event) =>
                  setNotifications((prev) => ({ ...prev, [item.key]: event.target.checked }))
                }
              />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-darkBlue/10 bg-white/80 p-6 shadow">
        <h3 className="text-lg font-semibold text-darkBlue">Privacy</h3>
        <div className="mt-4 grid gap-3 text-sm text-darkBlue/70 md:grid-cols-2">
          <button className="rounded-xl border border-darkBlue/20 px-4 py-3 text-left">Export my data</button>
          <button className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-left text-danger">Delete account</button>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;
