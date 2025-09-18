import React, { createContext, useContext, useState, ReactNode } from 'react';
import { format } from 'date-fns';

interface DateSimulationContextType {
  simulatedDate: Date | null;
  setSimulatedDate: (date: Date | null) => void;
  getCurrentDate: () => Date;
  isSimulating: boolean;
}

const DateSimulationContext = createContext<DateSimulationContextType | undefined>(undefined);

export function DateSimulationProvider({ children }: { children: ReactNode }) {
  const [simulatedDate, setSimulatedDate] = useState<Date | null>(null);

  const getCurrentDate = () => {
    if (simulatedDate) {
      // Create a new date with the simulated date but current time
      const now = new Date();
      const simulated = new Date(simulatedDate);
      simulated.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
      return simulated;
    }
    return new Date();
  };

  return (
    <DateSimulationContext.Provider
      value={{
        simulatedDate,
        setSimulatedDate,
        getCurrentDate,
        isSimulating: !!simulatedDate
      }}
    >
      {children}
    </DateSimulationContext.Provider>
  );
}

export function useDateSimulation() {
  const context = useContext(DateSimulationContext);
  if (context === undefined) {
    throw new Error('useDateSimulation must be used within a DateSimulationProvider');
  }
  return context;
}

// Helper hook to get the current date (simulated or real)
export function useCurrentDate() {
  const context = useContext(DateSimulationContext);
  if (!context) {
    return new Date();
  }
  return context.getCurrentDate();
}