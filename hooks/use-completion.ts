'use client'

import { useState, useEffect } from 'react';

const getCompletedQuestions = (): string[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  const completed = localStorage.getItem('completedQuestions');
  return completed ? JSON.parse(completed) : [];
};

const setCompletedQuestions = (completed: string[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('completedQuestions', JSON.stringify(completed));
  }
};

export const useCompletion = () => {
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    setCompleted(getCompletedQuestions());
  }, []);

  const markAsComplete = (questionId: string) => {
    if (!completed.includes(questionId)) {
      const newCompleted = [...completed, questionId];
      setCompleted(newCompleted);
      setCompletedQuestions(newCompleted);
    }
  };

  const isCompleted = (questionId: string) => {
    return completed.includes(questionId);
  };

  return { completed, markAsComplete, isCompleted };
};
