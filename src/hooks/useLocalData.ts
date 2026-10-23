import { useState, useCallback } from 'react';
import { loadData, saveData } from '../data/db';
import type { AppData } from '../types';

export function useLocalData() {
  const [data, setData] = useState<AppData>(() => loadData());

  const update = useCallback((updater: (prev: AppData) => AppData) => {
    setData(prev => {
      const next = updater(prev);
      saveData(next);
      return next;
    });
  }, []);

  return { data, update };
}
