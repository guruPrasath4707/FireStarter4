import {
  LayoutDashboard,
  Compass,
  BookOpen,
  Bot,
  ClipboardCheck,
  GraduationCap,
  Briefcase,
  User,
  Settings as SettingsIcon,
} from 'lucide-react';

export const PRIMARY_NAV = [
  { to: '/dashboard',    label: 'Dashboard',        icon: LayoutDashboard, end: true },
  { to: '/careers',      label: 'Career Explorer',  icon: Compass },
  { to: '/learning',     label: 'Learning Hub',     icon: BookOpen },
  { to: '/mentor',       label: 'AI Mentor',        icon: Bot },
  { to: '/assessments',  label: 'Assessments',      icon: ClipboardCheck },
  { to: '/scholarships', label: 'Scholarships',     icon: GraduationCap },
  { to: '/opportunities',label: 'Opportunities',    icon: Briefcase },
  { to: '/profile',      label: 'Profile',          icon: User },
  { to: '/settings',     label: 'Settings',         icon: SettingsIcon },
];
