import { Fragment, useMemo } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Bars3Icon, BellIcon, PowerIcon } from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { useAuth } from '../contexts/AuthContext';
import { useDemoData } from '../contexts/DemoDataContext';
import { clsx } from 'clsx';
import { useState } from 'react';

const links = [
  { to: '/dashboard', label: 'Dashboard', emoji: '🏠' },
  { to: '/dashboard/hackathons', label: 'Find Hackathons', emoji: '🎯' },
  { to: '/dashboard/participants', label: 'Browse Participants', emoji: '👥' },
  { to: '/dashboard/teams', label: 'My Teams', emoji: '🤝' },
  { to: '/dashboard/find-teammates', label: 'Find Teammates', emoji: '🔍' },
  { to: '/dashboard/performance', label: 'My Performance', emoji: '📊' },
  { to: '/dashboard/profile', label: 'Profile', emoji: '👤' },
  { to: '/dashboard/settings', label: 'Settings', emoji: '⚙️' }
];

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { notifications } = useDemoData();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAdmin = user?.isAdmin;
  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);

  const activeLink = links.some((link) => location.pathname.startsWith(link.to))
    ? links.find((link) => location.pathname.startsWith(link.to))?.to
    : '/dashboard';

  return (
    <div className="min-h-screen bg-softGray">
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-darkBlue/40" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white px-6 pb-4 pt-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-darkBlue">TeamSync</h2>
                  <button onClick={() => setSidebarOpen(false)} className="rounded-md p-2 text-darkBlue/60">
                    ✖
                  </button>
                </div>
                <nav className="mt-8 space-y-1">
                  {links.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        clsx(
                          'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition',
                          isActive ? 'bg-mistBlue text-darkBlue' : 'text-darkBlue/70 hover:bg-softGray'
                        )
                      }
                    >
                      <span>{link.emoji}</span>
                      {link.label}
                    </NavLink>
                  ))}
                  {isAdmin && (
                    <NavLink
                      to="/dashboard/admin"
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        clsx(
                          'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition',
                          isActive ? 'bg-mistBlue text-darkBlue' : 'text-darkBlue/70 hover:bg-softGray'
                        )
                      }
                    >
                      <span>🛡️</span> Admin Panel
                    </NavLink>
                  )}
                </nav>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="flex min-h-screen">
        <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-darkBlue/10 bg-white/80 px-4 py-6 lg:flex">
          <div className="flex items-center justify-between px-2">
            <h1 className="text-2xl font-semibold text-darkBlue">TeamSync</h1>
            <span className="rounded-full bg-mistBlueDark/10 px-3 py-1 text-xs font-medium text-mistBlueDark">
              Demo
            </span>
          </div>
          <nav className="mt-8 flex flex-1 flex-col space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition',
                    isActive || activeLink === link.to ? 'bg-mistBlue text-darkBlue' : 'text-darkBlue/70 hover:bg-softGray'
                  )
                }
              >
                <span>{link.emoji}</span>
                {link.label}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink
                to="/dashboard/admin"
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition',
                    isActive ? 'bg-mistBlue text-darkBlue' : 'text-darkBlue/70 hover:bg-softGray'
                  )
                }
              >
                <span>🛡️</span> Admin Panel
              </NavLink>
            )}
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="mt-auto flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-danger transition hover:bg-danger/10"
            >
              <PowerIcon className="h-4 w-4" />
              Sign out
            </button>
          </nav>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="flex h-16 items-center justify-between border-b border-darkBlue/10 bg-white/70 px-4 backdrop-blur">
            <div className="flex items-center gap-2">
              <button
                className="rounded-xl p-2 text-darkBlue/70 hover:bg-softGray lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Bars3Icon className="h-5 w-5" />
              </button>
              <h2 className="text-lg font-semibold text-darkBlue">
                {location.pathname === '/dashboard'
                  ? 'Dashboard'
                  : location.pathname.split('/').slice(-1)[0]?.replace('-', ' ') || 'Dashboard'}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard/notifications')}
                className="relative rounded-full bg-softGray p-2 text-darkBlue/70 transition hover:text-darkBlue"
              >
                <BellIcon className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-semibold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              {user && (
                <button
                  onClick={() => navigate('/dashboard/profile')}
                  className="flex items-center gap-2 rounded-full bg-softGray px-3 py-1 text-sm font-medium text-darkBlue transition hover:bg-mistBlue"
                >
                  <img src={user.profilePicture} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
                  <span>{user.name || 'Complete profile'}</span>
                </button>
              )}
            </div>
          </header>
          <main className="flex-1 overflow-y-auto px-4 py-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
