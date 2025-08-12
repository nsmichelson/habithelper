import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import EveningCheckIn from '@/components/EveningCheckIn';
import { Tip } from '@/types/tip';

// Mock tip for testing
const mockTip: Tip = {
  tip_id: 'test-1',
  summary: 'Replace one sugary drink with sparkling water today',
  details_md: 'Try swapping your afternoon soda for a flavored sparkling water',
  contraindications: [],
  goal_tags: ['reduce_sugar', 'improve_hydration'],
  tip_type: ['healthy_swap'],
  time_cost_enum: '0_5_min',
  money_cost_enum: '$',
  mental_effort: 1,
  physical_effort: 1,
  location_tags: ['home', 'work'],
  social_mode: 'either',
  time_of_day: ['afternoon'],
  difficulty_tier: 1,
  created_by: 'dietitian_reviewed',
};

export default function TabTwoScreen() {
  const handleCheckIn = (feedback: any, notes?: string) => {
    console.log('Check-in received:', { feedback, notes });
    alert(`Check-in saved!\nFeedback: ${feedback}\nNotes: ${notes || 'No notes'}`);
  };

  const handleSkip = () => {
    console.log('Check-in skipped');
    alert('Check-in skipped - will remind you later!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Testing Evening Check-In Component</Text>
      <EveningCheckIn 
        tip={mockTip}
        onCheckIn={handleCheckIn}
        onSkip={handleSkip}
        quickCompletions={[]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
    textAlign: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
});