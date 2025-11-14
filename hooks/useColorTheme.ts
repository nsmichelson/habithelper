import { useState, useEffect } from 'react';
import StorageService from '@/services/storage';

/**
 * Hook to manage color theme preference (dynamic colors vs original green)
 */
export function useColorTheme() {
  const [useDynamicColors, setUseDynamicColors] = useState(false); // Default to classic green
  const [loading, setLoading] = useState(true);

  // Load the preference on mount
  useEffect(() => {
    loadPreference();
  }, []);

  const loadPreference = async () => {
    try {
      const preference = await StorageService.getUseDynamicColors();
      setUseDynamicColors(preference);
    } catch (error) {
      console.error('Error loading color preference:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleColorTheme = async () => {
    const newValue = !useDynamicColors;
    setUseDynamicColors(newValue);

    try {
      await StorageService.setUseDynamicColors(newValue);
    } catch (error) {
      console.error('Error saving color preference:', error);
      // Revert on error
      setUseDynamicColors(!newValue);
    }
  };

  return {
    useDynamicColors,
    toggleColorTheme,
    loading,
  };
}