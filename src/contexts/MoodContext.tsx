import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface MoodData {
  mood: string;
  reason: string;
  timestamp: number;
}

interface MoodContextType {
  moodData: MoodData | null;
  setMoodData: (mood: string, reason: string) => void;
  clearMoodData: () => void;
  hasPendingMoodData: boolean;
  setHasPendingMoodData: (hasPending: boolean) => void;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const MoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [moodData, setMoodDataState] = useState<MoodData | null>(null);
  const [hasPendingMoodData, setHasPendingMoodData] = useState(false);

  // Load mood data from localStorage on mount
  useEffect(() => {
    const storedMoodData = localStorage.getItem('moodAssessment');
    if (storedMoodData) {
      try {
        const parsed = JSON.parse(storedMoodData);
        // Check if the data is recent (within last 24 hours)
        const isRecent = Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000;
        if (isRecent) {
          setMoodDataState(parsed);
        } else {
          // Clear old data
          localStorage.removeItem('moodAssessment');
        }
      } catch (error) {
        console.error('Error parsing mood data:', error);
        localStorage.removeItem('moodAssessment');
      }
    }
  }, []);

  const setMoodData = useCallback((mood: string, reason: string) => {
    const newMoodData: MoodData = {
      mood,
      reason,
      timestamp: Date.now()
    };
    setMoodDataState(newMoodData);
    localStorage.setItem('moodAssessment', JSON.stringify(newMoodData));
  }, []);

  const clearMoodData = useCallback(() => {
    setMoodDataState(null);
    setHasPendingMoodData(false);
    localStorage.removeItem('moodAssessment');
  }, [setHasPendingMoodData]);

  return (
    <MoodContext.Provider value={{
      moodData,
      setMoodData,
      clearMoodData,
      hasPendingMoodData,
      setHasPendingMoodData
    }}>
      {children}
    </MoodContext.Provider>
  );
};

export const useMood = () => {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};

