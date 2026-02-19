'use client'

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'completed-questions-v1';

export const useCompletion = () => {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCompleted(new Set(JSON.parse(stored)));
      }
    } catch (e) {
      console.error('Failed to load completion status', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const toggleCompletion = (questionId: string) => {
    const newSet = new Set(completed);
    if (newSet.has(questionId)) {
      newSet.delete(questionId);
    } else {
      newSet.add(questionId);
    }
    setCompleted(newSet);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(newSet)));
  };

  const isCompleted = (questionId: string) => completed.has(questionId);

  return { completed, toggleCompletion, isCompleted, isLoaded };
};
