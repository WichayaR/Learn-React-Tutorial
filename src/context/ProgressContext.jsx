import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const ProgressContext = createContext(null);

const STORAGE_KEY = 'react-tutorial-progress';

export function ProgressProvider({ children }) {
  const [completed, setCompleted] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
    } catch {
      // ignore quota errors
    }
  }, [completed]);

  const markComplete = useCallback((slug) => {
    setCompleted((prev) => (prev.includes(slug) ? prev : [...prev, slug]));
  }, []);

  const markIncomplete = useCallback((slug) => {
    setCompleted((prev) => prev.filter((s) => s !== slug));
  }, []);

  const isComplete = useCallback((slug) => completed.includes(slug), [completed]);

  const reset = useCallback(() => setCompleted([]), []);

  return (
    <ProgressContext.Provider
      value={{ completed, markComplete, markIncomplete, isComplete, reset }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}