export const API_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

export const SUBJECT_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#3b82f6', '#06b6d4',
];

export const DIFFICULTY_LABELS = {
  1: 'Very Easy',
  2: 'Easy',
  3: 'Medium',
  4: 'Hard',
  5: 'Very Hard',
};

export const STATUS_COLORS = {
  pending:     'bg-blue-100 text-blue-700',
  completed:   'bg-green-100 text-green-700',
  missed:      'bg-red-100 text-red-700',
  skipped:     'bg-gray-100 text-gray-600',
  rescheduled: 'bg-yellow-100 text-yellow-700',
};
