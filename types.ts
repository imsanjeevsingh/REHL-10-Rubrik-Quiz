
export enum Difficulty {
  EASY = 'Junior',
  MEDIUM = 'Intermediate',
  HARD = 'Senior'
}

export interface Question {
  id: string;
  module: string;
  topic: string;
  scenario: string;
  question: string;
  options: string[];
  optionSimulations: string[]; // Added: Simulated terminal output for each option
  correctAnswer: number;
  explanation: string;
  difficulty: Difficulty;
}

export interface AdminResult {
  id: string;
  name: string;
  email: string;
  score: number;
  date: string;
  modulePerformance: Record<string, number>;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: Record<string, number>;
  status: 'idle' | 'register' | 'generating' | 'active' | 'completed' | 'admin';
  score: number;
  startTime: number | null;
  endTime: number | null;
  userName?: string;
  userEmail?: string;
}

export const RHEL_MODULES = [
  "Module 1: Get started with RHEL (Open source, distributions)",
  "Module 2: Access the command line (Shell, simple commands)",
  "Module 3: Manage files (Copy, move, create, delete, organize)",
  "Module 4: Get help (Local help systems)",
  "Module 5: Create, view, and edit text files (Vim shortcuts)",
  "Module 6: Manage local users and groups (Password policies)",
  "Module 7: Control access to files (Permissions, ACLs, Sticky Bits, Immutability)",
  "Module 8: Monitor and manage Linux processes",
  "Module 9: Control services and daemons (systemd)",
  "Module 10: Configure and secure SSH (OpenSSH)",
  "Module 11: Analyze and store logs (Troubleshooting)",
  "Module 12: Manage networking (Interfaces and settings)",
  "Module 13: Archive and transfer files (rsync)",
  "Module 14: Install and update software (DNF/YUM)",
  "Module 15: Access Linux files systems (Storage)",
  "Troubleshooting: Performance (top, Load Average, atop)",
  "Troubleshooting: CPU/Disk (iostat, sar, iotop)",
  "Troubleshooting: Bandwidth (iftop, iperf)",
  "Troubleshooting: Scheduling (Cron and related files)",
  "Troubleshooting: Core Commands (lsof, grep, awk, ethtool, ifup/down)",
  "Troubleshooting: Critical Files (resolv.conf, hosts, fstab, mnttab)"
];
