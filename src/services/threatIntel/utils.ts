import { format } from 'date-fns';

export const formatDateRange = (year: number) => {
  const startDate = format(new Date(year, 0, 1), "yyyy-MM-dd'T'HH:mm:ss.SSS");
  const endDate = format(new Date(year, 11, 31), "yyyy-MM-dd'T'HH:mm:ss.SSS");
  return { startDate, endDate };
};

export const parseCSVLine = (line: string): string[] => {
  return line.split(',').map(field => field.trim());
};