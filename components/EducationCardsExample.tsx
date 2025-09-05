// Example usage of EducationCards component
import React, { useState } from 'react';
import { View, Button } from 'react-native';
import EducationCards from './EducationCards';
import { organizationEducation } from '@/data/eduation_collection/organization';

const ExampleScreen = () => {
  const [showCards, setShowCards] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Button 
        title="Learn About Organization" 
        onPress={() => setShowCards(true)} 
      />
      
      <EducationCards
        content={organizationEducation}
        visible={showCards}
        onClose={() => setShowCards(false)}
        onComplete={() => {
          console.log('User completed all education cards!');
          // You could track this completion, award points, etc.
        }}
      />
    </View>
  );
};

export default ExampleScreen;