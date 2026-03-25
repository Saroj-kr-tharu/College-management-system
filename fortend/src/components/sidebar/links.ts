export interface SubLink {
  label: string;
  to: string;
  roles?: string[]; // Add roles that can see this link
}

export interface SidebarLink {
  label: string;
  to?: string; // optional if dropdown
  subLinks?: SubLink[];
  roles?: string[]; // Add roles that can see this link
}

export const sidebarLinks: SidebarLink[] = [
  {
    label: 'Dashboard',
    subLinks: [
      { label: 'Admin Dashboard', to: '/dashboard/admin', roles: ['admin'] },
      { label: 'Student Dashboard', to: '/dashboard/student', roles: ['student'] },
      { label: 'Teacher Dashboard', to: '/dashboard/teacher', roles: ['teacher'] }
    ],
  },
  {
    label: 'Students',
    subLinks: [
      { label: 'Students', to: '/student' }
    ],
    roles: ['admin', 'teacher'] // Only admin and teacher can see
  },
  {
    label: 'Teachers',
    subLinks: [
      { label: 'Teachers', to: '/teacher' }
    ],
    roles: ['admin'] // Only admin can see
  },
  { label: 'Courses', to: '/course', roles: ['admin', 'teacher'] }, // All can see
  { label: 'Classes', to: '/class', roles: ['admin', 'teacher'] },  // Admin and teacher
  { label: 'Attendances', to: '/attendance', roles: ['admin', 'teacher'] }, // All can see
  { label: 'Profile', to: '/profile', roles: ['admin', 'teacher', 'student'] }, // All can see
  { label: 'Results', to: '/result', roles: ['admin', 'teacher'] },
  { label: 'Student Result', to: '/result/student', roles: ['student'] },
  { label: 'Class Report', to: '/class-report', roles: ['admin', 'teacher'] },

  { label: 'Report', to: '/report', roles: [ 'teacher', 'student'] },
];
