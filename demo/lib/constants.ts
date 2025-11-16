// App Constants

export const APP_NAME = "TeamSync";
export const APP_DESCRIPTION = "VIT's exclusive platform for hackathon team formation";

export const BRANCHES = [
  "CSE",
  "ECE",
  "EEE",
  "MECH",
  "CIVIL",
  "IT",
  "CSE (AI & ML)",
  "CSE (Data Science)",
  "CSE (Cyber Security)",
  "Other"
];

export const YEARS = [1, 2, 3, 4];

export const PERFORMANCE_BADGES = {
  BEGINNER: { min: 0, max: 50, label: "Beginner", color: "bg-gray-500" },
  INTERMEDIATE: { min: 50, max: 100, label: "Intermediate", color: "bg-blue-500" },
  ADVANCED: { min: 100, max: 200, label: "Advanced", color: "bg-purple-500" },
  EXPERT: { min: 200, max: Infinity, label: "Expert", color: "bg-amber-500" }
};

export const POINTS_SYSTEM = {
  PARTICIPATION: 10,
  ROUND_1: 20,
  ROUND_2: 30,
  FINALS: 50,
  WINNER: 100,
  RUNNER_UP: 75
};

export const NOTIFICATION_TYPES = {
  TEAM_INVITE: 'team_invite',
  APPLICATION_ACCEPTED: 'application_accepted',
  APPLICATION_REJECTED: 'application_rejected',
  TEAM_MEMBER_JOINED: 'team_member_joined',
  TEAM_MEMBER_LEFT: 'team_member_left',
  HACKATHON_REMINDER: 'hackathon_reminder',
  NEW_HACKATHON: 'new_hackathon',
  PERFORMANCE_UPDATED: 'performance_updated'
};

export const SKILL_CATEGORIES = [
  "Frontend",
  "Backend",
  "Mobile",
  "AI/ML",
  "Web3",
  "DevOps",
  "Cloud",
  "Database",
  "Design",
  "Language",
  "API",
  "Security",
  "Hardware",
  "Gaming"
];
