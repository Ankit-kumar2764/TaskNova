import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTaskStore } from '../store/useTaskStore';
import { Filters } from '../types';

const parseArray = (value: string | null) => (value ? value.split(',').filter(Boolean) : []);

export const useFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters, setFilters } = useTaskStore();

  useEffect(() => {
    const status = parseArray(searchParams.get('status')) as Filters['status'];
    const priority = parseArray(searchParams.get('priority')) as Filters['priority'];
    const assignee = parseArray(searchParams.get('assignee')) as Filters['assignee'];
    const dateRangeRaw = searchParams.get('dateRange');

    let dateRange: Filters['dateRange'];
    if (dateRangeRaw) {
      try {
        const parsed = JSON.parse(dateRangeRaw);
        if (parsed.start && parsed.end) {
          dateRange = { start: new Date(parsed.start), end: new Date(parsed.end) };
        }
      } catch {
        dateRange = undefined;
      }
    }

    setFilters({ status, priority, assignee, dateRange });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateFilters = (newFilters: Filters) => {
    setFilters(newFilters);
    const params = new URLSearchParams();

    if (newFilters.status.length) params.set('status', newFilters.status.join(','));
    if (newFilters.priority.length) params.set('priority', newFilters.priority.join(','));
    if (newFilters.assignee.length) params.set('assignee', newFilters.assignee.join(','));
    if (newFilters.dateRange) {
      params.set('dateRange', JSON.stringify({ start: newFilters.dateRange.start.toISOString(), end: newFilters.dateRange.end.toISOString() }));
    }

    setSearchParams(params);
  };

  return { filters, updateFilters };
};
