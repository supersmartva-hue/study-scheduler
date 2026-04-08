import { format, addDays, startOfWeek, endOfWeek, isToday, isBefore, parseISO } from 'date-fns';

export const formatDate = (date) => format(new Date(date), 'yyyy-MM-dd');
export const formatDisplay = (date) => format(new Date(date), 'MMM d, yyyy');
export const formatTime = (time) => {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
};

export const getMondayOfWeek = (date = new Date()) =>
  formatDate(startOfWeek(date, { weekStartsOn: 1 }));

export const getWeekDays = (mondayStr) => {
  const monday = parseISO(mondayStr);
  return Array.from({ length: 7 }, (_, i) => {
    const d = addDays(monday, i);
    return {
      date: formatDate(d),
      label: format(d, 'EEE'),
      dayNum: format(d, 'd'),
      isToday: isToday(d),
    };
  });
};

export const isPast = (dateStr) => isBefore(parseISO(dateStr), new Date());

export { format, addDays, isToday, parseISO };
