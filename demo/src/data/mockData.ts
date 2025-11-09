import dayjs from 'dayjs';
import { UserProfile } from '../contexts/AuthContext';
import { Hackathon, Team, NotificationItem } from '../contexts/DemoDataContext';

export const mockUsers: UserProfile[] = [
  {
    id: 'u1',
    email: 'ananya.sharma@vit.edu.in',
    name: 'Ananya Sharma',
    rollNo: '21BCE1001',
    branch: 'Computer Science',
    year: 3,
    bio: 'Full-stack dev passionate about AI-powered experiences.',
    profilePicture: 'https://i.pravatar.cc/150?img=47',
    skills: ['React', 'TypeScript', 'Node.js', 'Figma'],
    interests: ['AI/ML', 'Web Development'],
    github: 'https://github.com/ananyash',
    linkedin: 'https://linkedin.com/in/ananyash',
    portfolio: 'https://ananya.dev',
    performanceScore: 142,
    totalHackathons: 8,
    badge: 'Advanced',
    lookingForTeam: false,
    connections: ['u2', 'u3', 'u4'],
    onboarded: true
  },
  {
    id: 'u2',
    email: 'arjun.menon@vit.edu.in',
    name: 'Arjun Menon',
    rollNo: '22BIT2020',
    branch: 'Information Technology',
    year: 2,
    bio: 'Product thinker, loves building delightful UX.',
    profilePicture: 'https://i.pravatar.cc/150?img=32',
    skills: ['Next.js', 'Tailwind', 'Product Design'],
    interests: ['Web Development', 'Design Systems'],
    github: 'https://github.com/arjunmenon',
    linkedin: 'https://linkedin.com/in/arjunmenon',
    performanceScore: 86,
    totalHackathons: 5,
    badge: 'Intermediate',
    lookingForTeam: true,
    connections: ['u1', 'u3'],
    onboarded: true
  },
  {
    id: 'u3',
    email: 'isha.patel@vit.edu.in',
    name: 'Isha Patel',
    rollNo: '20BDS3033',
    branch: 'Data Science',
    year: 4,
    bio: 'Data storyteller with a love for hackathons & mentorship.',
    profilePicture: 'https://i.pravatar.cc/150?img=15',
    skills: ['Python', 'TensorFlow', 'PowerBI', 'SQL'],
    interests: ['AI/ML', 'Data Science'],
    performanceScore: 212,
    totalHackathons: 12,
    badge: 'Expert',
    lookingForTeam: false,
    connections: ['u1', 'u2'],
    onboarded: true
  },
  {
    id: 'u4',
    email: 'rohith.nair@vit.edu.in',
    name: 'Rohith Nair',
    rollNo: '23BME1204',
    branch: 'Mechanical Engineering',
    year: 1,
    bio: 'Hardware tinkerer exploring hackathon world.',
    profilePicture: 'https://i.pravatar.cc/150?img=8',
    skills: ['Arduino', 'CAD', '3D Printing'],
    interests: ['IoT', 'Robotics'],
    performanceScore: 35,
    totalHackathons: 2,
    badge: 'Beginner',
    lookingForTeam: true,
    connections: ['u1'],
    onboarded: true
  },
  {
    id: 'admin',
    email: 'admin@vit.edu.in',
    name: 'Hackathon Admin',
    rollNo: '19ADM0001',
    branch: 'Administration',
    year: 5,
    bio: 'Ensuring VIT hackathon experiences stay world-class.',
    profilePicture: 'https://i.pravatar.cc/150?img=67',
    skills: ['Operations', 'Community'],
    interests: ['Innovation', 'Community Building'],
    performanceScore: 0,
    totalHackathons: 0,
    badge: 'Beginner',
    lookingForTeam: false,
    connections: [],
    onboarded: true,
    isAdmin: true
  }
];

export const mockHackathons: Hackathon[] = [
  {
    id: 'h1',
    name: 'DevSprint 2025',
    organizer: 'Google Developer Student Club',
    startDate: dayjs().add(12, 'day').toISOString(),
    endDate: dayjs().add(14, 'day').toISOString(),
    registrationDeadline: dayjs().add(7, 'day').toISOString(),
    minTeamSize: 2,
    maxTeamSize: 4,
    requiredSkills: ['React', 'Firebase', 'UI/UX'],
    status: 'upcoming',
    bannerUrl: 'https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=1200&q=80',
    description: 'Build solutions for local communities with mentorship from industry leaders.',
    externalLink: 'https://gdscvit.in/devsprint',
    participants: ['u1', 'u2', 'u3']
  },
  {
    id: 'h2',
    name: 'Smart India Hackathon',
    organizer: 'Ministry of Education',
    startDate: dayjs().subtract(10, 'day').toISOString(),
    endDate: dayjs().subtract(8, 'day').toISOString(),
    registrationDeadline: dayjs().subtract(40, 'day').toISOString(),
    minTeamSize: 3,
    maxTeamSize: 6,
    requiredSkills: ['Python', 'Data Science', 'Cloud'],
    status: 'completed',
    bannerUrl: 'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?auto=format&fit=crop&w=1200&q=80',
    description: 'Nation-wide hackathon to solve real-world problems with government agencies.',
    externalLink: 'https://sih.gov.in',
    participants: ['u1', 'u3']
  },
  {
    id: 'h3',
    name: 'ETHIndia Campus Edition',
    organizer: 'Devfolio',
    startDate: dayjs().add(30, 'day').toISOString(),
    endDate: dayjs().add(32, 'day').toISOString(),
    registrationDeadline: dayjs().add(20, 'day').toISOString(),
    minTeamSize: 2,
    maxTeamSize: 5,
    requiredSkills: ['Solidity', 'Next.js', 'UX Research'],
    status: 'upcoming',
    bannerUrl: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
    description: 'Build the future of decentralised applications with mentors from the Web3 space.',
    externalLink: 'https://ethindia.devfolio.co',
    participants: ['u2']
  }
];

export const mockTeams: Team[] = [
  {
    id: 't1',
    hackathonId: 'h1',
    name: 'Pixel Pioneers',
    description: 'Design-first builders crafting human-centred experiences.',
    leaderId: 'u1',
    maxMembers: 4,
    requiredSkills: ['UI/UX', 'React', 'Firebase'],
    isOpen: true,
    memberIds: ['u1', 'u2'],
    pendingApplications: [
      {
        id: 'a1',
        userId: 'u4',
        message: 'I can handle embedded integrations and hardware prototypes.',
        status: 'pending'
      }
    ],
    invites: [
      {
        id: 'i1',
        inviteeId: 'u3',
        status: 'pending'
      }
    ],
    chat: [
      {
        id: 'c1',
        userId: 'u1',
        message: 'Kick-off sync tomorrow at 8pm? 🚀',
        createdAt: dayjs().subtract(2, 'hour').toISOString()
      },
      {
        id: 'c2',
        userId: 'u2',
        message: 'Works for me! Will bring the latest UI exploration.',
        createdAt: dayjs().subtract(90, 'minute').toISOString()
      }
    ]
  },
  {
    id: 't2',
    hackathonId: 'h2',
    name: 'Data Mavericks',
    description: 'Turning complex data into actionable insights.',
    leaderId: 'u3',
    maxMembers: 6,
    requiredSkills: ['Python', 'TensorFlow', 'Data Viz'],
    isOpen: false,
    memberIds: ['u3', 'u1'],
    pendingApplications: [],
    invites: [],
    chat: [
      {
        id: 'c3',
        userId: 'u3',
        message: 'Great job on winning SIH finals team! 🏆',
        createdAt: dayjs().subtract(5, 'day').toISOString()
      }
    ]
  }
];

export const mockNotifications: NotificationItem[] = [
  {
    id: 'n1',
    userId: 'u1',
    title: 'Application received',
    message: 'Rohith applied to join Pixel Pioneers for DevSprint 2025.',
    type: 'application',
    link: '/dashboard/teams/t1',
    isRead: false,
    createdAt: dayjs().subtract(1, 'hour').toISOString()
  },
  {
    id: 'n2',
    userId: 'u1',
    title: 'Hackathon deadline',
    message: 'DevSprint 2025 registrations close in 3 days.',
    type: 'reminder',
    link: '/dashboard/hackathons/h1',
    isRead: false,
    createdAt: dayjs().subtract(4, 'hour').toISOString()
  }
];

export const activityFeed = [
  {
    id: 'af1',
    message: 'Arjun joined Pixel Pioneers for DevSprint 2025',
    timestamp: dayjs().subtract(3, 'hour').toISOString()
  },
  {
    id: 'af2',
    message: 'New hackathon posted: ETHIndia Campus Edition',
    timestamp: dayjs().subtract(1, 'day').toISOString()
  },
  {
    id: 'af3',
    message: 'Your connection Isha is mentoring Smart India Hackathon finalists',
    timestamp: dayjs().subtract(2, 'day').toISOString()
  }
];

export const performanceHistory = [
  {
    hackathon: 'Smart India Hackathon 2024',
    team: 'Data Mavericks',
    round: 'Winner',
    points: 100,
    date: '2024-08-24'
  },
  {
    hackathon: 'DevSoc Innovation Sprint',
    team: 'Pixel Pioneers',
    round: 'Finalist',
    points: 50,
    date: '2024-05-02'
  },
  {
    hackathon: 'VIT Makeathon',
    team: 'Visionary',
    round: 'Round 2',
    points: 30,
    date: '2023-12-11'
  }
];

export const mockConnections = [
  {
    userId: 'u1',
    connections: [
      {
        id: 'u2',
        name: 'Arjun Menon',
        hackathons: ['DevSprint 2025'],
        lastCollaboration: '2024-11-04'
      },
      {
        id: 'u3',
        name: 'Isha Patel',
        hackathons: ['Smart India Hackathon 2024'],
        lastCollaboration: '2024-08-24'
      }
    ]
  }
];

export const mockRecommendations = {
  forUser: [
    {
      id: 'u4',
      name: 'Rohith Nair',
      badge: 'Beginner',
      performanceScore: 35,
      skills: ['Arduino', 'CAD'],
      matchReason: 'Hardware prototyping skills complement your AI focus'
    },
    {
      id: 'u2',
      name: 'Arjun Menon',
      badge: 'Intermediate',
      performanceScore: 86,
      skills: ['Next.js', 'Tailwind'],
      matchReason: 'Frequent collaborator with aligned performance score'
    }
  ],
  forTeam: [
    {
      id: 'u3',
      name: 'Isha Patel',
      badge: 'Expert',
      performanceScore: 212,
      skills: ['Python', 'TensorFlow'],
      matchReason: 'Covers data science gap in your current roster'
    },
    {
      id: 'u4',
      name: 'Rohith Nair',
      badge: 'Beginner',
      performanceScore: 35,
      skills: ['Arduino', 'CAD'],
      matchReason: 'Adds hardware prototyping for DevSprint challenges'
    }
  ]
};
