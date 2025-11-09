import { createContext, useContext, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import {
  activityFeed,
  mockConnections,
  mockHackathons,
  mockNotifications,
  mockRecommendations,
  mockTeams,
  mockUsers,
  performanceHistory
} from '../data/mockData';
import { UserProfile } from './AuthContext';

export interface Hackathon {
  id: string;
  name: string;
  organizer: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  minTeamSize: number;
  maxTeamSize: number;
  requiredSkills: string[];
  status: 'upcoming' | 'active' | 'completed';
  bannerUrl?: string;
  description: string;
  externalLink: string;
  participants: string[];
}

export interface Team {
  id: string;
  hackathonId: string;
  name: string;
  description: string;
  leaderId: string;
  maxMembers: number;
  requiredSkills: string[];
  isOpen: boolean;
  memberIds: string[];
  pendingApplications: { id: string; userId: string; message: string; status: 'pending' | 'accepted' | 'rejected' }[];
  invites: { id: string; inviteeId: string; status: 'pending' | 'accepted' | 'declined' }[];
  chat: { id: string; userId: string; message: string; createdAt: string }[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

interface DemoDataContextValue {
  hackathons: Hackathon[];
  teams: Team[];
  notifications: NotificationItem[];
  getHackathon: (id: string) => Hackathon | undefined;
  getTeam: (id: string) => Team | undefined;
  createTeam: (team: Partial<Team>, creator: UserProfile) => Team;
  applyToTeam: (teamId: string, user: UserProfile, message: string) => void;
  reviewApplication: (teamId: string, applicationId: string, status: 'accepted' | 'rejected') => void;
  sendInvite: (teamId: string, inviteeId: string) => void;
  respondToInvite: (teamId: string, inviteId: string, status: 'accepted' | 'declined', userId: string) => void;
  postMessage: (teamId: string, user: UserProfile, message: string) => void;
  markParticipating: (hackathonId: string, userId: string, participating: boolean) => void;
  toggleLookingForTeam: (userId: string, looking: boolean) => void;
  createNotification: (notification: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>) => void;
  markNotificationRead: (id: string) => void;
  activity: typeof activityFeed;
  recommendations: typeof mockRecommendations;
  connections: typeof mockConnections;
  performance: typeof performanceHistory;
}

const DemoDataContext = createContext<DemoDataContextValue | undefined>(undefined);

export const DemoDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [hackathonsState, setHackathons] = useState(mockHackathons);
  const [teamsState, setTeams] = useState(mockTeams);
  const [notificationsState, setNotifications] = useState(mockNotifications);

  const getHackathon = (id: string) => hackathonsState.find((h) => h.id === id);
  const getTeam = (id: string) => teamsState.find((t) => t.id === id);

  const createTeam = (team: Partial<Team>, creator: UserProfile) => {
    const newTeam: Team = {
      id: crypto.randomUUID(),
      hackathonId: team.hackathonId ?? hackathonsState[0].id,
      name: team.name ?? 'New Team',
      description: team.description ?? '',
      leaderId: creator.id,
      maxMembers: team.maxMembers ?? 4,
      requiredSkills: team.requiredSkills ?? [],
      isOpen: team.isOpen ?? true,
      memberIds: [creator.id],
      pendingApplications: [],
      invites: [],
      chat: [
        {
          id: crypto.randomUUID(),
          userId: creator.id,
          message: 'Team created successfully! 🎉',
          createdAt: dayjs().toISOString()
        }
      ]
    };
    setTeams((prev) => [...prev, newTeam]);
    return newTeam;
  };

  const applyToTeam = (teamId: string, user: UserProfile, message: string) => {
    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId
          ? {
              ...team,
              pendingApplications: [
                ...team.pendingApplications,
                {
                  id: crypto.randomUUID(),
                  userId: user.id,
                  message,
                  status: 'pending'
                }
              ]
            }
          : team
      )
    );
  };

  const reviewApplication = (teamId: string, applicationId: string, status: 'accepted' | 'rejected') => {
    setTeams((prev) =>
      prev.map((team) => {
        if (team.id !== teamId) return team;
        const application = team.pendingApplications.find((app) => app.id === applicationId);
        if (!application) return team;
        const updatedApplications = team.pendingApplications.map((app) =>
          app.id === applicationId ? { ...app, status } : app
        );
        let memberIds = team.memberIds;
        if (status === 'accepted' && !team.memberIds.includes(application.userId)) {
          memberIds = [...team.memberIds, application.userId];
        }
        return { ...team, pendingApplications: updatedApplications, memberIds };
      })
    );
  };

  const sendInvite = (teamId: string, inviteeId: string) => {
    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId
          ? {
              ...team,
              invites: [
                ...team.invites,
                {
                  id: crypto.randomUUID(),
                  inviteeId,
                  status: 'pending'
                }
              ]
            }
          : team
      )
    );
  };

  const respondToInvite = (teamId: string, inviteId: string, status: 'accepted' | 'declined', userId: string) => {
    setTeams((prev) =>
      prev.map((team) => {
        if (team.id !== teamId) return team;
        const invites = team.invites.map((invite) =>
          invite.id === inviteId ? { ...invite, status } : invite
        );
        const memberIds = status === 'accepted' && !team.memberIds.includes(userId)
          ? [...team.memberIds, userId]
          : team.memberIds;
        return { ...team, invites, memberIds };
      })
    );
  };

  const postMessage = (teamId: string, user: UserProfile, message: string) => {
    if (!message.trim()) return;
    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId
          ? {
              ...team,
              chat: [
                ...team.chat,
                {
                  id: crypto.randomUUID(),
                  userId: user.id,
                  message,
                  createdAt: dayjs().toISOString()
                }
              ]
            }
          : team
      )
    );
  };

  const markParticipating = (hackathonId: string, userId: string, participating: boolean) => {
    setHackathons((prev) =>
      prev.map((hackathon) =>
        hackathon.id === hackathonId
          ? {
              ...hackathon,
              participants: participating
                ? Array.from(new Set([...hackathon.participants, userId]))
                : hackathon.participants.filter((id) => id !== userId)
            }
          : hackathon
      )
    );
  };

  const toggleLookingForTeam = (userId: string, looking: boolean) => {
    const index = mockUsers.findIndex((u) => u.id === userId);
    if (index !== -1) {
      mockUsers[index] = { ...mockUsers[index], lookingForTeam: looking };
    }
  };

  const createNotification = (notification: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>) => {
    setNotifications((prev) => [
      {
        ...notification,
        id: crypto.randomUUID(),
        createdAt: dayjs().toISOString(),
        isRead: false
      },
      ...prev
    ]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const value = useMemo(
    () => ({
      hackathons: hackathonsState,
      teams: teamsState,
      notifications: notificationsState,
      getHackathon,
      getTeam,
      createTeam,
      applyToTeam,
      reviewApplication,
      sendInvite,
      respondToInvite,
      postMessage,
      markParticipating,
      toggleLookingForTeam,
      createNotification,
      markNotificationRead,
      activity: activityFeed,
      recommendations: mockRecommendations,
      connections: mockConnections,
      performance: performanceHistory
    }),
    [hackathonsState, teamsState, notificationsState]
  );

  return <DemoDataContext.Provider value={value}>{children}</DemoDataContext.Provider>;
};

export const useDemoData = () => {
  const context = useContext(DemoDataContext);
  if (!context) throw new Error('useDemoData must be used within DemoDataProvider');
  return context;
};
