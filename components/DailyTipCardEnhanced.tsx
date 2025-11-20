

// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import { savePersonalizationData, setPendingPersonalizationData } from '@/store/slices/dailyTipSlice';
// import { Ionicons } from '@expo/vector-icons';
// import * as Haptics from 'expo-haptics';
// import { LinearGradient } from 'expo-linear-gradient';
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   Dimensions,
//   FlatList,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import Animated, {
//   Extrapolate,
//   interpolate,
//   useAnimatedScrollHandler,
//   useAnimatedStyle,
//   useSharedValue
// } from 'react-native-reanimated';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { SimplifiedTip } from '../types/simplifiedTip';
// import PersonalizationCard from './PersonalizationCard';

// const { width: SCREEN_WIDTH } = Dimensions.get('window');
// const CARD_WIDTH = SCREEN_WIDTH - 40;

// interface Props {
//   tip: SimplifiedTip;
//   onResponse: (response: 'try_it' | 'maybe_later') => void;
//   onNotForMe: () => void;
//   reasons?: string[];
//   userGoals?: string[];
//   rejectionInfo?: {
//     feedback: 'not_for_me';
//     reason?: string;
//   };
//   maybeLaterInfo?: {
//     feedback: 'maybe_later';
//     savedAt?: Date | string;
//   };
//   onSavePersonalization?: (data: any) => void;
//   savedPersonalizationData?: any;
// }

// export default function DailyTipCardSwipe({ tip, onResponse, onNotForMe, reasons = [], userGoals = [], rejectionInfo, maybeLaterInfo, onSavePersonalization, savedPersonalizationData }: Props) {
//   const [currentPage, setCurrentPage] = useState(0);
//   const scrollX = useSharedValue(0);
//   const flatListRef = useRef<FlatList>(null);
//   const insets = useSafeAreaInsets();
  
//   // Redux state
//   const dispatch = useAppDispatch();
//   const pendingPersonalizationData = useAppSelector(state => state.dailyTip.pendingPersonalizationData);
//   const reduxSavedData = useAppSelector(state => state.dailyTip.savedPersonalizationData);

//   // Reset to first page when tip changes
//   useEffect(() => {
//     setCurrentPage(0);
//     flatListRef.current?.scrollToIndex({ index: 0, animated: false });
//   }, [tip.tip_id]);

//   // Parse details_md to extract sections
//   const parseDetailsContent = () => {
//     const content = tip.details_md || '';
//     const sections: { experiment?: string; whyItWorks?: string; howToTry?: string } = {};
    
//     // Extract "The Experiment" section
//     const experimentMatch = content.match(/\*\*The Experiment:\*\*(.+?)(?=\*\*Why it Works:|\*\*How to|$)/s);
//     if (experimentMatch) {
//       sections.experiment = experimentMatch[1].trim();
//     }
    
//     // Extract "Why it Works" section
//     const whyMatch = content.match(/\*\*Why it Works:\*\*(.+?)(?=\*\*How to|$)/s);
//     if (whyMatch) {
//       sections.whyItWorks = whyMatch[1].trim();
//     }
    
//     // Extract "How to Try It" section
//     const howMatch = content.match(/\*\*How to Try It:\*\*(.+?)$/s);
//     if (howMatch) {
//       sections.howToTry = howMatch[1].trim();
//     }
    
//     return sections;
//   };
  
//   const detailsSections = parseDetailsContent();
  
//   // Get relevant user goals that this tip meets
//   const relevantGoals = userGoals.filter(userGoal =>
//     tip.goals?.includes(userGoal)
//   );
  
//   // Check if this tip should have a personalization card
//   const shouldShowPersonalization = !!tip.personalization_prompt;
  
//   const handleResponse = async (response: 'try_it' | 'maybe_later') => {
//     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
//     console.log('DailyTipCardEnhanced - handleResponse called with:', response);
//     console.log('DailyTipCardEnhanced - pendingPersonalizationData from Redux:', pendingPersonalizationData);
//     console.log('DailyTipCardEnhanced - onSavePersonalization exists?', !!onSavePersonalization);
    
//     // If user is clicking "I'll try it" and there's pending personalization data, save it
//     if (response === 'try_it' && pendingPersonalizationData) {
//       console.log('DailyTipCardEnhanced - Saving pending personalization data before try_it:', pendingPersonalizationData);
      
//       // Save to Redux store
//       dispatch(savePersonalizationData(pendingPersonalizationData));
      
//       // Also call the parent's save function to persist to storage
//       if (onSavePersonalization) {
//         try {
//           await onSavePersonalization(pendingPersonalizationData);
//           console.log('DailyTipCardEnhanced - Finished saving personalization data');
//         } catch (error) {
//           console.error('DailyTipCardEnhanced - Error saving personalization data:', error);
//           // Continue anyway - don't block the transition
//         }
//       }
      
//       // Small delay to ensure state updates have propagated
//       await new Promise(resolve => setTimeout(resolve, 100));
//     }
    
//     console.log('DailyTipCardEnhanced - About to call onResponse with:', response);
//     onResponse(response);
//   };
  
//   const handleNotForMe = () => {
//     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//     onNotForMe();
//   };

//   const scrollHandler = useAnimatedScrollHandler({
//     onScroll: (event) => {
//       scrollX.value = event.contentOffset.x;
//     },
//   });

//   const navigateCard = (direction: number) => {
//     const newIndex = currentPage + direction;
//     if (newIndex >= 0 && newIndex < pages.length) {
//       Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//       flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
//     }
//   };

//   const getDifficultyLabel = (tier: number) => {
//     const labels = ['Very Easy', 'Easy', 'Moderate', 'Challenging', 'Very Challenging'];
//     return labels[tier - 1] || 'Easy';
//   };

//   const getTimeLabel = (time: string) => {
//     const labels: Record<string, string> = {
//       '0-5min': '< 5 min',
//       '5-15min': '5-15 min',
//       '15-30min': '15-30 min',
//       '30min+': '> 30 min',
//       // Legacy format support
//       '0_5_min': '< 5 min',
//       '5_15_min': '5-15 min',
//       '15_60_min': '15-60 min',
//       '>60_min': '> 1 hour',
//     };
//     return labels[time] || time;
//   };

//   const renderSummaryCard = () => (
//     <View style={styles.pageContainer}>
//       <LinearGradient
//         colors={['#FFFFFF', '#FAFAFA']}
//         style={styles.cardGradient}
//       >
//         <View style={styles.badges}>
//           <View style={[styles.badge, styles.timeBadge]}>
//             <Ionicons name="time-outline" size={14} color="#666" />
//             <Text style={styles.badgeText}>{getTimeLabel(tip.time)}</Text>
//           </View>
//           <View style={[styles.badge, styles.difficultyBadge]}>
//             <Text style={[styles.badgeText, { color: '#2E7D32' }]}>{getDifficultyLabel(tip.difficulty)}</Text>
//           </View>
//         </View>
        
//         <Text style={styles.summaryTitle}>{tip.summary}</Text>

//         {tip.short_description && (
//           <Text style={styles.summarySubtitle}>{tip.short_description}</Text>
//         )}
        
//         {reasons.length > 0 && (
//           <View style={styles.reasonsContainer}>
//             {reasons.map((reason, index) => (
//               <View key={index} style={styles.reasonChip}>
//                 <Ionicons name="sparkles" size={12} color="#4CAF50" />
//                 <Text style={styles.reasonText}>{reason}</Text>
//               </View>
//             ))}
//           </View>
//         )}

//         {rejectionInfo && (
//           <View style={styles.rejectionInlineWrapper}>
//             <View style={styles.rejectionInlineCornerLabel}>
//               <Text style={styles.rejectionInlineCornerLabelText}>You said</Text>
//             </View>
//             <View style={styles.rejectionInlineCard}>
//               <View style={styles.rejectionInlineHeader}>
//                 <View style={styles.rejectionInlineIconWrapper}>
//                   <Ionicons name="heart-dislike" size={20} color="#DC2626" />
//                 </View>
//                 <View style={styles.rejectionInlineContent}>
//                   <Text style={styles.rejectionInlineLabel}>Not My Thing</Text>
//                   <Text style={styles.rejectionInlineSubtext}>That's totally okay!</Text>
//                 </View>
//                 <TouchableOpacity
//                   style={styles.rejectionInlineEditButton}
//                   onPress={() => onNotForMe()}
//                   activeOpacity={0.7}
//                 >
//                   <Ionicons name="pencil" size={14} color="#6B7280" />
//                 </TouchableOpacity>
//               </View>
              
//               {rejectionInfo.reason && (
//                 <View style={styles.rejectionInlineReasonsBox}>
//                   <Text style={styles.rejectionInlineReasonHeader}>Your feedback:</Text>
//                   <View style={styles.rejectionInlineReasonsList}>
//                     {rejectionInfo.reason.split(':').map((reason, index) => (
//                       <View key={index} style={styles.rejectionInlineReasonRow}>
//                         <View style={styles.rejectionInlineReasonDot} />
//                         <Text style={styles.rejectionInlineReasonText}>{reason.trim()}</Text>
//                       </View>
//                     ))}
//                   </View>
//                 </View>
//               )}
//             </View>
//           </View>
//         )}

//         {maybeLaterInfo && (
//           <View style={styles.maybeLaterInlineWrapper}>
//             <View style={styles.maybeLaterInlineCornerLabel}>
//               <Text style={styles.maybeLaterInlineCornerLabelText}>You said</Text>
//             </View>
//             <View style={styles.maybeLaterInlineCard}>
//               <View style={styles.maybeLaterInlineHeader}>
//                 <View style={styles.maybeLaterInlineIconWrapper}>
//                   <Ionicons name="bookmark" size={20} color="#F59E0B" />
//                 </View>
//                 <View style={styles.maybeLaterInlineContent}>
//                   <Text style={styles.maybeLaterInlineLabel}>Saved for Later</Text>
//                   <Text style={styles.maybeLaterInlineSubtext}>We'll remind you another time!</Text>
//                 </View>
//               </View>
              
//               <View style={styles.maybeLaterInlineInfoBox}>
//                 <Text style={styles.maybeLaterInlineInfoText}>
//                   This tip has been saved to your collection. You can try it whenever you're ready!
//                 </Text>
//               </View>
//             </View>
//           </View>
//         )}
//       </LinearGradient>
//     </View>
//   );

//   const renderGoalsCard = () => (
//     <View style={styles.pageContainer}>
//       <LinearGradient
//         colors={['#FFFFFF', '#FAFAFA']}
//         style={styles.cardGradient}
//       >
//         <ScrollView 
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.scrollContent}
//         >
//           <Text style={styles.sectionTitle}>Goals This Meets</Text>
          
//           {relevantGoals.length > 0 ? (
//             <View style={styles.goalsMatchSection}>
//               <Text style={styles.goalsMatchTitle}>YOUR GOALS:</Text>
//               <View style={styles.goalsMatchGrid}>
//                 {[...new Set(relevantGoals)].map((goal, index) => (
//                   <View key={`${goal}-${index}`} style={styles.userGoalChip}>
//                     <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
//                     <Text style={styles.userGoalText}>
//                       {goal.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
//                     </Text>
//                   </View>
//                 ))}
//               </View>
//             </View>
//           ) : null}
          
//           <View style={styles.allGoalsSection}>
//             <Text style={styles.allGoalsTitle}>THIS TIP HELPS WITH:</Text>
//             <View style={styles.goalsGrid}>
//               {[...new Set(tip.goals || [])].map((goal, index) => {
//                 const isUserGoal = relevantGoals.includes(goal);
//                 return (
//                   <View 
//                     key={`${goal}-${index}`} 
//                     style={[styles.goalChip, isUserGoal && styles.goalChipHighlight]}
//                   >
//                     <Text style={[styles.goalChipText, isUserGoal && styles.goalChipTextHighlight]}>
//                       {goal.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
//                     </Text>
//                   </View>
//                 );
//               })}
//             </View>
//           </View>
//         </ScrollView>
//       </LinearGradient>
//     </View>
//   );
  
//   const renderHowToCard = () => (
//     <View style={styles.pageContainer}>
//       <LinearGradient
//         colors={['#FFFFFF', '#FAFAFA']}
//         style={styles.cardGradient}
//       >
//         <ScrollView 
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.scrollContent}
//         >
//           <Text style={styles.sectionTitle}>How To Do It</Text>
          
//           {detailsSections.howToTry ? (
//             <View style={styles.howToContent}>
//               {detailsSections.howToTry.split('\n').map((line, index) => {
//                 const isBullet = line.trim().startsWith('•');
//                 if (isBullet) {
//                   return (
//                     <View key={index} style={styles.bulletPoint}>
//                       <Text style={styles.bulletIcon}>•</Text>
//                       <Text style={styles.bulletText}>{line.replace('•', '').trim()}</Text>
//                     </View>
//                   );
//                 }
//                 return line.trim() ? (
//                   <Text key={index} style={styles.detailsText}>{line}</Text>
//                 ) : null;
//               })}
//             </View>
//           ) : (
//             <Text style={styles.detailsText}>
//               {detailsSections.experiment || tip.details_md}
//             </Text>
//           )}
          
//           <View style={styles.infoGrid}>
//             <View style={styles.infoItem}>
//               <Ionicons name="sunny-outline" size={20} color="#666" />
//               <Text style={styles.infoLabel}>Best Time</Text>
//               <Text style={styles.infoValue}>
//                 {(tip.time_of_day ?? []).map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ') || 'Any time'}
//               </Text>
//             </View>
            
//             <View style={styles.infoItem}>
//               <Ionicons name="cash-outline" size={20} color="#666" />
//               <Text style={styles.infoLabel}>Cost</Text>
//               <Text style={styles.infoValue}>{tip.money_cost_enum ?? 'Free'}</Text>
//             </View>
            
//             <View style={styles.infoItem}>
//               <Ionicons name="location-outline" size={20} color="#666" />
//               <Text style={styles.infoLabel}>Where</Text>
//               <Text style={styles.infoValue}>
//                 {(tip.location_tags ?? []).map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(', ') || 'Anywhere'}
//               </Text>
//             </View>
//           </View>
//         </ScrollView>
//       </LinearGradient>
//     </View>
//   );

//   const renderBenefitsCard = () => (
//     <View style={styles.pageContainer}>
//       <LinearGradient
//         colors={['#FFFFFF', '#FAFAFA']}
//         style={styles.cardGradient}
//       >
//         <ScrollView 
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.scrollContent}
//         >
//           <Text style={styles.sectionTitle}>Why This Works</Text>
          
//           {detailsSections.whyItWorks ? (
//             <View style={styles.whyItWorksSection}>
//               <Text style={styles.whyItWorksText}>
//                 {detailsSections.whyItWorks}
//               </Text>
//             </View>
//           ) : null}
          
//           <View style={styles.benefitsSection}>
//             <Text style={styles.benefitsSectionTitle}>TIP TYPE</Text>
//             <View style={styles.tipTypeGrid}>
//               {(tip.mechanisms || []).map(type => (
//                 <View key={type} style={styles.tipTypeBadge}>
//                   <Text style={styles.tipTypeText}>
//                     {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
//                   </Text>
//                 </View>
//               ))}
//             </View>
//           </View>

//           {(tip.goals ?? []).length > 0 && (
//             <View style={styles.goalsSection}>
//               <Text style={styles.goalsSectionTitle}>This helps with:</Text>
//               <View style={styles.goalsGrid}>
//                 {[...new Set(tip.goals)].map((goal, index) => (
//                   <View key={`${goal}-${index}`} style={styles.goalChip}>
//                     <Text style={styles.goalChipText}>
//                       {goal.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
//                     </Text>
//                   </View>
//                 ))}
//               </View>
//             </View>
//           )}
//         </ScrollView>
//       </LinearGradient>
//     </View>
//   );
  
//   const personalizationScrollRef = useRef<ScrollView>(null);
  
//   const renderPersonalizationCard = () => (
//     <View style={styles.pageContainer}>
//       <LinearGradient
//         colors={['#FFFFFF', '#FAFAFA']}
//         style={styles.cardGradient}
//       >
//         <KeyboardAvoidingView
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//           style={{ flex: 1 }}
//           keyboardVerticalOffset={100}
//         >
//           <ScrollView 
//             ref={personalizationScrollRef}
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={styles.scrollContent}
//             keyboardShouldPersistTaps="handled"
//             keyboardDismissMode="on-drag"
//           >
//             <PersonalizationCard
//               tip={tip}
//               savedData={savedPersonalizationData || reduxSavedData}
//               scrollViewRef={personalizationScrollRef}
//               onSave={async (data) => {
//               console.log('DailyTipCardEnhanced - PersonalizationCard onSave called with:', data);
              
//               // Save to Redux store
//               dispatch(savePersonalizationData(data));
              
//               // Also save to storage
//               if (onSavePersonalization) {
//                 await onSavePersonalization(data);
//               }
//               // Don't return anything to avoid issues
//             }}
//             onDataChange={(data) => {
//               console.log('DailyTipCardEnhanced - PersonalizationCard onDataChange called with:', data);
              
//               // Update pending data in Redux
//               dispatch(setPendingPersonalizationData(data));
//             }}
//             showHeader={true}
//           />
//         </ScrollView>
//         </KeyboardAvoidingView>
//       </LinearGradient>
//     </View>
//   );

//   const renderPersonalizationCardOld = () => {
//     // Handle text type  
//     if (tip.personalization_type === 'text') {
//       const placeholder = tip.personalization_config?.placeholders?.[0] || "Enter your answer";
      
//       return (
//         <View style={styles.pageContainer}>
//           <LinearGradient
//             colors={['#FFFFFF', '#FAFAFA']}
//             style={styles.cardGradient}
//           >
//             <KeyboardAvoidingView
//               behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//               style={{ flex: 1 }}
//               keyboardVerticalOffset={150}
//             >
//               <ScrollView 
//                 showsVerticalScrollIndicator={false}
//                 contentContainerStyle={[styles.scrollContent, { paddingBottom: 150 }]}
//                 keyboardShouldPersistTaps="handled"
//               >
//                 <Text style={styles.sectionTitle}>Make It Your Own</Text>
                
//                 {!savedTextInput ? (
//                   <View style={styles.textInputWrapper}>
//                     <Text style={styles.personalizationPrompt}>
//                       {tip.personalization_prompt}
//                     </Text>
                    
//                     <TextInput
//                       style={styles.textInputField}
//                       placeholder={placeholder}
//                       value={textInput}
//                       onChangeText={setTextInput}
//                       placeholderTextColor="#999"
//                       multiline={false}
//                       returnKeyType="done"
//                         onSubmitEditing={() => {
//                           if (textInput.trim()) {
//                             Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
//                             setSavedTextInput(textInput.trim());
//                             onSavePersonalization?.({ type: 'text', data: textInput.trim() });
//                             setShowSaveAnimation(true);
//                             setTimeout(() => setShowSaveAnimation(false), 2000);
//                           }
//                         }}
//                       />
                      
//                     <TouchableOpacity
//                       style={[
//                         styles.saveTextButton,
//                         !textInput.trim() && styles.saveTextButtonDisabled
//                       ]}
//                       onPress={() => {
//                         if (textInput.trim()) {
//                           Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
//                           setSavedTextInput(textInput.trim());
//                           onSavePersonalization?.({ type: 'text', data: textInput.trim() });
//                           setShowSaveAnimation(true);
//                           setTimeout(() => setShowSaveAnimation(false), 2000);
//                         }
//                       }}
//                       disabled={!textInput.trim()}
//                       activeOpacity={0.7}
//                     >
//                       <Text style={styles.saveTextButtonText}>Save</Text>
//                       <Ionicons name="checkmark" size={20} color="#FFF" />
//                     </TouchableOpacity>
//                   </View>
//                 ) : (
//                   <View style={styles.savedChoiceContainer}>
//                     <View style={styles.savedHeader}>
//                       <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
//                       <Text style={styles.savedTitle}>Your Plan</Text>
//                     </View>
                    
//                     <View style={styles.savedChoiceBox}>
//                       <Text style={styles.savedChoicePrompt}>{tip.personalization_prompt}</Text>
//                       <Text style={styles.savedChoiceText}>{savedTextInput}</Text>
//                     </View>
                    
//                     <TouchableOpacity
//                       style={styles.editButton}
//                       onPress={() => {
//                         setSavedTextInput(null);
//                         setTextInput(savedTextInput || '');
//                       }}
//                       activeOpacity={0.7}
//                     >
//                       <Ionicons name="pencil" size={16} color="#4CAF50" />
//                       <Text style={styles.editButtonText}>Change My Answer</Text>
//                     </TouchableOpacity>
//                   </View>
//                 )}
                
//                 {showSaveAnimation && (
//                   <View style={styles.celebrationOverlay}>
//                     <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
//                     <Text style={styles.celebrationText}>Saved! 🎯</Text>
//                   </View>
//                 )}
//               </ScrollView>
//             </KeyboardAvoidingView>
//           </LinearGradient>
//         </View>
//       );
//     }
    
//     // Handle multi_text type
//     if (tip.personalization_type === 'multi_text') {
//       const items = tip.personalization_config?.items || [];
      
//       return (
//         <View style={styles.pageContainer}>
//           <LinearGradient
//             colors={['#FFFFFF', '#FAFAFA']}
//             style={styles.cardGradient}
//           >
//             <KeyboardAvoidingView
//               behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//               style={{ flex: 1 }}
//               keyboardVerticalOffset={150}
//             >
//               <ScrollView 
//                 showsVerticalScrollIndicator={false}
//                 contentContainerStyle={[styles.scrollContent, { paddingBottom: 150 }]}
//                 keyboardShouldPersistTaps="handled"
//               >
//                 <Text style={styles.sectionTitle}>Make It Your Own</Text>
                
//                 {!savedMultiTextInputs ? (
//                   <View style={styles.multiTextWrapper}>
//                     <Text style={styles.personalizationPrompt}>
//                       {tip.personalization_prompt}
//                     </Text>
                    
//                     {items.map((item, index) => (
//                       <View key={index} style={styles.multiTextSection}>
//                         <Text style={styles.multiTextLabel}>{item.label}</Text>
//                         <TextInput
//                           style={styles.textInputField}
//                           placeholder={item.placeholder}
//                           value={multiTextInputs[index] || ''}
//                           onChangeText={(text) => {
//                             setMultiTextInputs({ ...multiTextInputs, [index]: text });
//                           }}
//                           placeholderTextColor="#999"
//                           multiline={false}
//                           returnKeyType="next"
//                         />
//                       </View>
//                     ))}
                    
//                     <TouchableOpacity
//                       style={[
//                         styles.saveTextButton,
//                         !items.every((_, index) => multiTextInputs[index]?.trim()) && styles.saveTextButtonDisabled
//                       ]}
//                       onPress={() => {
//                         if (items.every((_, index) => multiTextInputs[index]?.trim())) {
//                           Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
//                           setSavedMultiTextInputs(multiTextInputs);
//                           onSavePersonalization?.({ type: 'multi_text', data: multiTextInputs });
//                           setShowSaveAnimation(true);
//                           setTimeout(() => setShowSaveAnimation(false), 2000);
//                         }
//                       }}
//                       disabled={!items.every((_, index) => multiTextInputs[index]?.trim())}
//                       activeOpacity={0.7}
//                     >
//                       <Text style={styles.saveTextButtonText}>Save Plan</Text>
//                       <Ionicons name="checkmark" size={20} color="#FFF" />
//                     </TouchableOpacity>
//                   </View>
//                 ) : (
//                   <View style={styles.savedChoiceContainer}>
//                     <View style={styles.savedHeader}>
//                       <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
//                       <Text style={styles.savedTitle}>Your Plan</Text>
//                     </View>
                    
//                     <View style={styles.savedMultiTextBox}>
//                       {items.map((item, index) => (
//                         <View key={index} style={styles.savedMultiTextItem}>
//                           <Text style={styles.savedMultiTextLabel}>{item.label}</Text>
//                           <Text style={styles.savedMultiTextValue}>{savedMultiTextInputs[index]}</Text>
//                         </View>
//                       ))}
//                     </View>
                    
//                     <TouchableOpacity
//                       style={styles.editButton}
//                       onPress={() => {
//                         setSavedMultiTextInputs(null);
//                         setMultiTextInputs(savedMultiTextInputs || {});
//                       }}
//                       activeOpacity={0.7}
//                     >
//                       <Ionicons name="pencil" size={16} color="#4CAF50" />
//                       <Text style={styles.editButtonText}>Change My Plan</Text>
//                     </TouchableOpacity>
//                   </View>
//                 )}
                
//                 {showSaveAnimation && (
//                   <View style={styles.celebrationOverlay}>
//                     <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
//                     <Text style={styles.celebrationText}>Saved! 🎯</Text>
//                   </View>
//                 )}
//               </ScrollView>
//             </KeyboardAvoidingView>
//           </LinearGradient>
//         </View>
//       );
//     }
    
//     // Handle choice type
//     if (tip.personalization_type === 'choice') {
//       const choices = tip.personalization_config?.choices || [];
//       const isMultiple = tip.personalization_config?.multiple === true;
      
//       return (
//         <View style={styles.pageContainer}>
//           <LinearGradient
//             colors={['#FFFFFF', '#FAFAFA']}
//             style={styles.cardGradient}
//           >
//             <ScrollView 
//               showsVerticalScrollIndicator={false}
//               contentContainerStyle={styles.scrollContent}
//             >
//               <Text style={styles.sectionTitle}>Make It Your Own</Text>
              
//               {(!savedChoice && !savedChoices) ? (
//                 <>
//                   <Text style={styles.personalizationPrompt}>
//                     {tip.personalization_prompt}
//                   </Text>
                  
//                   <View style={styles.choiceContainer}>
//                     {choices.map((choice, index) => {
//                       const isSelected = isMultiple 
//                         ? selectedChoices.includes(choice)
//                         : selectedChoice === choice;
//                       // Define colors for each choice type
//                       const getChoiceColor = () => {
//                         const lowerChoice = choice.toLowerCase();
//                         // Meal times
//                         if (lowerChoice.includes('breakfast')) return '#FFE0B2';
//                         if (lowerChoice.includes('lunch')) return '#C8E6C9';
//                         if (lowerChoice.includes('dinner')) return '#E1BEE7';
//                         if (lowerChoice.includes('snack')) return '#FBBF24';
//                         // Craving types
//                         if (lowerChoice === 'salty') return '#B3E5FC'; // Light blue
//                         if (lowerChoice === 'sweet') return '#FCE4EC'; // Light pink
//                         if (lowerChoice === 'savory') return '#FFCCBC'; // Light orange
//                         if (lowerChoice === 'crunchy') return '#DCEDC8'; // Light green
//                         if (lowerChoice === 'chewy') return '#F3E5F5'; // Light purple
//                         if (lowerChoice === 'creamy') return '#FFF9C4'; // Light yellow
//                         return '#E0E0E0';
//                       };
                      
//                       return (
//                         <TouchableOpacity
//                           key={index}
//                           style={[
//                             styles.choiceItem,
//                             isSelected && styles.choiceItemSelected
//                           ]}
//                           onPress={() => {
//                             Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            
//                             if (isMultiple) {
//                               // Toggle selection for multiple choice
//                               if (selectedChoices.includes(choice)) {
//                                 setSelectedChoices(selectedChoices.filter(c => c !== choice));
//                               } else {
//                                 setSelectedChoices([...selectedChoices, choice]);
//                               }
//                             } else {
//                               setSelectedChoice(choice);
//                               // Auto-save after a brief delay for single choice
//                               setTimeout(() => {
//                                 Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
//                                 setSavedChoice(choice);
//                                 onSavePersonalization?.({ type: 'choice', data: choice, multiple: false });
//                                 setShowSaveAnimation(true);
//                                 setTimeout(() => setShowSaveAnimation(false), 2000);
//                               }, 500);
//                             }
//                           }}
//                           activeOpacity={0.7}
//                         >
//                           <View style={styles.choiceItemHeader}>
//                             <View style={[styles.choiceCircle, { backgroundColor: getChoiceColor() }]}>
//                               {isSelected && (
//                                 <Ionicons name="checkmark" size={18} color="#424242" />
//                               )}
//                             </View>
//                             <Text style={[
//                               styles.choiceText,
//                               isSelected && styles.choiceTextSelected
//                             ]}>
//                               {choice}
//                             </Text>
//                           </View>
//                           {(choice.toLowerCase().includes('breakfast') || 
//                             choice.toLowerCase().includes('lunch') || 
//                             choice.toLowerCase().includes('dinner') || 
//                             choice.toLowerCase().includes('snack')) ? (
//                             <Text style={styles.choiceTimeDescription}>
//                               {choice.toLowerCase().includes('breakfast') && 'Start your day with protein'}
//                               {choice.toLowerCase().includes('lunch') && 'Midday protein boost'}
//                               {choice.toLowerCase().includes('dinner') && 'Evening protein portion'}
//                               {choice.toLowerCase().includes('afternoon') && 'Afternoon protein snack'}
//                               {choice.toLowerCase().includes('evening') && 'Evening protein treat'}
//                             </Text>
//                           ) : (
//                             <Text style={styles.choiceTimeDescription}>
//                               {choice.toLowerCase() === 'salty' && 'Like chips or pretzels'}
//                               {choice.toLowerCase() === 'sweet' && 'Like candy or desserts'}
//                               {choice.toLowerCase() === 'savory' && 'Like cheese or meat'}
//                               {choice.toLowerCase() === 'crunchy' && 'Like crackers or nuts'}
//                               {choice.toLowerCase() === 'chewy' && 'Like gummies or bread'}
//                               {choice.toLowerCase() === 'creamy' && 'Like ice cream or yogurt'}
//                             </Text>
//                           )}
//                         </TouchableOpacity>
//                       );
//                     })}
//                   </View>
                  
//                   {isMultiple && selectedChoices.length > 0 && (
//                     <TouchableOpacity
//                       style={styles.saveMultipleButton}
//                       onPress={() => {
//                         Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
//                         setSavedChoices(selectedChoices);
//                         onSavePersonalization?.({ type: 'choice', data: selectedChoices, multiple: true });
//                         setShowSaveAnimation(true);
//                         setTimeout(() => setShowSaveAnimation(false), 2000);
//                       }}
//                       activeOpacity={0.7}
//                     >
//                       <Text style={styles.saveMultipleButtonText}>
//                         Save {selectedChoices.length} Selection{selectedChoices.length > 1 ? 's' : ''}
//                       </Text>
//                       <Ionicons name="checkmark" size={20} color="#FFF" />
//                     </TouchableOpacity>
//                   )}
//                 </>
//               ) : (
//                 <View style={styles.savedChoiceContainer}>
//                   <View style={styles.savedHeader}>
//                     <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
//                     <Text style={styles.savedTitle}>Your Plan</Text>
//                   </View>
                  
//                   <View style={styles.savedChoiceBox}>
//                     <Text style={styles.savedChoicePrompt}>{tip.personalization_prompt}</Text>
//                     <Text style={styles.savedChoiceText}>
//                       {isMultiple && savedChoices 
//                         ? savedChoices.join(', ')
//                         : savedChoice}
//                     </Text>
//                   </View>
                  
//                   <TouchableOpacity
//                     style={styles.editButton}
//                     onPress={() => {
//                       if (isMultiple) {
//                         setSavedChoices(null);
//                         setSelectedChoices([]);
//                       } else {
//                         setSavedChoice(null);
//                         setSelectedChoice(null);
//                       }
//                     }}
//                     activeOpacity={0.7}
//                   >
//                     <Ionicons name="pencil" size={16} color="#4CAF50" />
//                     <Text style={styles.editButtonText}>Change My Selection</Text>
//                   </TouchableOpacity>
//                 </View>
//               )}
              
//               {showSaveAnimation && (
//                 <View style={styles.celebrationOverlay}>
//                   <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
//                   <Text style={styles.celebrationText}>Locked in! 🎯</Text>
//                 </View>
//               )}
//             </ScrollView>
//           </LinearGradient>
//         </View>
//       );
//     }
    
//     // Original scale type implementation
//     return (
//     <View style={styles.pageContainer}>
//       <LinearGradient
//         colors={['#FFFFFF', '#FAFAFA']}
//         style={styles.cardGradient}
//       >
//         <KeyboardAvoidingView
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//           style={{ flex: 1 }}
//         >
//           <ScrollView 
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={styles.scrollContent}
//             keyboardShouldPersistTaps="handled"
//           >
//             <Text style={styles.sectionTitle}>Make It Your Own</Text>
            
//             {!savedScaleNames ? (
//               <>
//                 <Text style={styles.personalizationPrompt}>
//                   {tip.personalization_prompt || "Give your hunger levels fun, memorable names! What would you call each level?"}
//                 </Text>
                
//                 <View style={styles.scaleInputContainer}>
//                   <View style={styles.scaleLevel}>
//                     <View style={styles.scaleLevelHeader}>
//                       <View style={styles.scaleNumber}>
//                         <Text style={styles.scaleNumberText}>1</Text>
//                       </View>
//                       <TextInput
//                         style={styles.scaleNameInput}
//                         placeholder="e.g., Lion"
//                         value={scaleNames.level1}
//                         onChangeText={(text) => setScaleNames({ ...scaleNames, level1: text })}
//                         placeholderTextColor="#999"
//                         maxLength={20}
//                       />
//                     </View>
//                     <Text style={styles.scaleDescriptor}>Extremely hungry - stomach growling</Text>
//                   </View>
                  
//                   <View style={styles.scaleLevel}>
//                     <View style={styles.scaleLevelHeader}>
//                       <View style={[styles.scaleNumber, styles.scaleNumberMid]}>
//                         <Text style={styles.scaleNumberText}>5</Text>
//                       </View>
//                       <TextInput
//                         style={styles.scaleNameInput}
//                         placeholder="e.g., Kitty"
//                         value={scaleNames.level5}
//                         onChangeText={(text) => setScaleNames({ ...scaleNames, level5: text })}
//                         placeholderTextColor="#999"
//                         maxLength={20}
//                       />
//                     </View>
//                     <Text style={styles.scaleDescriptor}>Satisfied - comfortable and content</Text>
//                   </View>
                  
//                   <View style={styles.scaleLevel}>
//                     <View style={styles.scaleLevelHeader}>
//                       <View style={[styles.scaleNumber, styles.scaleNumberFull]}>
//                         <Text style={styles.scaleNumberText}>10</Text>
//                       </View>
//                       <TextInput
//                         style={styles.scaleNameInput}
//                         placeholder="e.g., Sloth"
//                         value={scaleNames.level10}
//                         onChangeText={(text) => setScaleNames({ ...scaleNames, level10: text })}
//                         placeholderTextColor="#999"
//                         maxLength={20}
//                       />
//                     </View>
//                     <Text style={styles.scaleDescriptor}>Overly full - uncomfortably stuffed</Text>
//                   </View>
//                 </View>
                
//                 {(scaleNames.level1 || scaleNames.level5 || scaleNames.level10) && (
//                   <Animated.View style={animatedSaveButtonStyle}>
//                     <TouchableOpacity
//                       style={styles.saveButton}
//                       onPress={handleSavePersonalization}
//                       activeOpacity={0.8}
//                     >
//                       <Ionicons name="sparkles" size={20} color="#FFF" />
//                       <Text style={styles.saveButtonText}>Save My Scale</Text>
//                     </TouchableOpacity>
//                   </Animated.View>
//                 )}
//               </>
//             ) : (
//               <View style={styles.savedScaleContainer}>
//                 <View style={styles.savedHeader}>
//                   <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
//                   <Text style={styles.savedTitle}>Your Personal Hunger Scale</Text>
//                 </View>
                
//                 <View style={styles.savedScaleItems}>
//                   {savedScaleNames.level1 && (
//                     <View style={styles.savedScaleItemWrapper}>
//                       <View style={styles.savedScaleItem}>
//                         <View style={[styles.savedScaleNumber, styles.scaleNumber]}>
//                           <Text style={styles.savedScaleNumberText}>1</Text>
//                         </View>
//                         <Text style={styles.savedScaleName}>{savedScaleNames.level1}</Text>
//                       </View>
//                       <Text style={styles.savedScaleDesc}>Extremely hungry</Text>
//                     </View>
//                   )}
                  
//                   {savedScaleNames.level5 && (
//                     <View style={styles.savedScaleItemWrapper}>
//                       <View style={styles.savedScaleItem}>
//                         <View style={[styles.savedScaleNumber, styles.scaleNumberMid]}>
//                           <Text style={styles.savedScaleNumberText}>5</Text>
//                         </View>
//                         <Text style={styles.savedScaleName}>{savedScaleNames.level5}</Text>
//                       </View>
//                       <Text style={styles.savedScaleDesc}>Satisfied</Text>
//                     </View>
//                   )}
                  
//                   {savedScaleNames.level10 && (
//                     <View style={styles.savedScaleItemWrapper}>
//                       <View style={styles.savedScaleItem}>
//                         <View style={[styles.savedScaleNumber, styles.scaleNumberFull]}>
//                           <Text style={styles.savedScaleNumberText}>10</Text>
//                         </View>
//                         <Text style={styles.savedScaleName}>{savedScaleNames.level10}</Text>
//                       </View>
//                       <Text style={styles.savedScaleDesc}>Overly full</Text>
//                     </View>
//                   )}
//                 </View>
                
//                 <TouchableOpacity
//                   style={styles.editButton}
//                   onPress={() => setSavedScaleNames(null)}
//                   activeOpacity={0.7}
//                 >
//                   <Ionicons name="pencil" size={16} color="#4CAF50" />
//                   <Text style={styles.editButtonText}>Edit My Scale</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
            
//             {showSaveAnimation && (
//               <View style={styles.celebrationOverlay}>
//                 <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
//                 <Text style={styles.celebrationText}>Personalized! 🎉</Text>
//               </View>
//             )}
//           </ScrollView>
//         </KeyboardAvoidingView>
//       </LinearGradient>
//     </View>
//     );
//   };

//   const pages = [
//     { key: 'summary', render: renderSummaryCard },
//     { key: 'goals', render: renderGoalsCard },
//     { key: 'benefits', render: renderBenefitsCard },
//     { key: 'howto', render: renderHowToCard },
//     ...(shouldShowPersonalization ? [{ key: 'personalize', render: renderPersonalizationCard }] : []),
//   ];

//   const DotIndicator = ({ index }: { index: number }) => {
//     const animatedDotStyle = useAnimatedStyle(() => {
//       const inputRange = [(index - 1) * CARD_WIDTH, index * CARD_WIDTH, (index + 1) * CARD_WIDTH];
      
//       const width = interpolate(
//         scrollX.value,
//         inputRange,
//         [8, 28, 8],
//         Extrapolate.CLAMP
//       );
      
//       const opacity = interpolate(
//         scrollX.value,
//         inputRange,
//         [0.4, 1, 0.4],
//         Extrapolate.CLAMP
//       );

//       return {
//         width,
//         opacity,
//       };
//     });

//     const labelOpacity = useAnimatedStyle(() => {
//       const inputRange = [(index - 1) * CARD_WIDTH, index * CARD_WIDTH, (index + 1) * CARD_WIDTH];
      
//       const opacity = interpolate(
//         scrollX.value,
//         inputRange,
//         [0, 1, 0],
//         Extrapolate.CLAMP
//       );

//       return { opacity };
//     });

//     const labels = shouldShowPersonalization 
//       ? ['Summary', 'Goals', 'Why', 'How', 'Plan']
//       : ['Summary', 'Goals', 'Why', 'How'];

//     return (
//       <TouchableOpacity
//         style={styles.step}
//         onPress={() => {
//           Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//           flatListRef.current?.scrollToIndex({ index, animated: true });
//           setCurrentPage(index);
//         }}
//         activeOpacity={0.7}
//       >
//         <Animated.View style={[styles.dot, animatedDotStyle]} />
//         <Animated.Text style={[styles.stepLabel, labelOpacity]}>{labels[index]}</Animated.Text>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {/* Fixed Header */}
//       <View style={styles.fixedHeader}>
//         <Text style={styles.headerLabel}>TODAY'S IDEA TO TRY</Text>
        
//         {/* Progress Indicator */}
//         <View style={styles.progressSteps}>
//           {pages.map((_, index) => (
//             <DotIndicator key={index} index={index} />
//           ))}
//         </View>
//       </View>

//       {/* Scrollable Card Content Area */}
//       <View style={styles.cardContainer}>
//         <View style={styles.cardWrapper}>
//           {/* Card Content */}
//           <View style={styles.cardMask}>
//             <Animated.FlatList
//               ref={flatListRef}
//               data={pages}
//               renderItem={({ item }) => item.render()}
//               horizontal
//               pagingEnabled
//               showsHorizontalScrollIndicator={false}
//               onScroll={scrollHandler}
//               scrollEventThrottle={16}
//               keyExtractor={(item) => item.key}
//               decelerationRate="fast"
//               bounces={false}
//               onMomentumScrollEnd={(event) => {
//                 const newPage = Math.round(event.nativeEvent.contentOffset.x / CARD_WIDTH);
//                 setCurrentPage(newPage);
//               }}
//             />
//           </View>
          
//           {/* Navigation Arrows */}
//           {currentPage > 0 && (
//             <TouchableOpacity 
//               style={[styles.navArrow, styles.navArrowLeft]}
//               onPress={() => navigateCard(-1)}
//               activeOpacity={0.7}
//             >
//               <Ionicons name="chevron-back" size={22} color="#4CAF50" />
//             </TouchableOpacity>
//           )}
          
//           {currentPage < pages.length - 1 && (
//             <TouchableOpacity 
//               style={[styles.navArrow, styles.navArrowRight]}
//               onPress={() => navigateCard(1)}
//               activeOpacity={0.7}
//             >
//               <Ionicons name="chevron-forward" size={22} color="#4CAF50" />
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>

//       {/* Fixed Action Buttons - Hide when rejected or saved for later */}
//       {!rejectionInfo && !maybeLaterInfo && (
//         <LinearGradient
//           colors={['#f8faf9', '#f5f8f6']}
//           style={[styles.actionContainer, { paddingBottom: 24 + insets.bottom }]}
//         >
//           <TouchableOpacity
//             style={styles.primaryAction}
//             onPress={() => {
//               console.log('==========================================');
//               console.log('BUTTON CLICK: "I\'ll try it" button pressed');
//               console.log('Current state - rejectionInfo:', rejectionInfo);
//               console.log('Current state - maybeLaterInfo:', maybeLaterInfo);
//               console.log('==========================================');
//               handleResponse('try_it');
//             }}
//             activeOpacity={0.8}
//           >
//             <Ionicons name="checkmark-circle" size={26} color="#FFF" />
//             <Text style={styles.primaryActionText}>I'll Try It!</Text>
//           </TouchableOpacity>
          
//           <View style={styles.secondaryActions}>
//             <TouchableOpacity
//               style={[styles.secondaryAction, styles.maybeButton]}
//               onPress={() => handleResponse('maybe_later')}
//               activeOpacity={0.8}
//             >
//               <Ionicons name="bookmark-outline" size={18} color="#FF9800" />
//               <Text style={styles.maybeButtonText}>Maybe Later</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity
//               style={[styles.secondaryAction, styles.skipButton]}
//               onPress={handleNotForMe}
//               activeOpacity={0.8}
//             >
//               <Ionicons name="close-circle-outline" size={18} color="#757575" />
//               <Text style={styles.skipButtonText}>Not for Me</Text>
//             </TouchableOpacity>
//           </View>
//         </LinearGradient>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8faf9',
//   },
//   fixedHeader: {
//     paddingTop: 20,
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//     backgroundColor: '#f8faf9',
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(0, 0, 0, 0.03)',
//   },
//   headerLabel: {
//     fontSize: 12,
//     fontWeight: '700',
//     color: '#4CAF50',
//     letterSpacing: 1,
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   progressSteps: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 12,
//   },
//   step: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   dot: {
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#4CAF50',
//     minWidth: 8,
//   },
//   stepLabel: {
//     fontSize: 11,
//     color: '#4CAF50',
//     fontWeight: '500',
//     marginLeft: 4,
//   },
//   cardContainer: {
//     flex: 1,
//     marginHorizontal: 20,
//     marginTop: 20,
//     marginBottom: 10,
//   },
//   cardWrapper: {
//     flex: 1,
//     position: 'relative',
//   },
//   cardMask: {
//     flex: 1,
//     borderRadius: 20,
//     overflow: 'hidden',
//     backgroundColor: 'transparent',
//   },
//   pageContainer: {
//     width: CARD_WIDTH,
//     paddingHorizontal: 0,
//     height: '100%',
//   },
//   cardGradient: {
//     flex: 1,
//     borderRadius: 20,
//     padding: 20,
//     minHeight: 300,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.1,
//         shadowRadius: 12,
//       },
//       android: {
//         elevation: 5,
//       },
//     }),
//   },
//   scrollContent: {
//     paddingBottom: 10,
//   },
//   navArrow: {
//     position: 'absolute',
//     top: '50%',
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: 'white',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 10,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 3 },
//         shadowOpacity: 0.12,
//         shadowRadius: 10,
//       },
//       android: {
//         elevation: 5,
//       },
//     }),
//   },
//   navArrowLeft: {
//     left: -12,
//     transform: [{ translateY: -22 }],
//   },
//   navArrowRight: {
//     right: -12,
//     transform: [{ translateY: -22 }],
//   },
//   badges: {
//     flexDirection: 'row',
//     gap: 8,
//     marginBottom: 16,
//   },
//   badge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//     gap: 4,
//   },
//   timeBadge: {
//     backgroundColor: '#F5F5F5',
//   },
//   difficultyBadge: {
//     backgroundColor: '#E8F5E9',
//   },
//   badgeText: {
//     fontSize: 11,
//     color: '#666',
//     fontWeight: '600',
//   },
//   summaryTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#212121',
//     lineHeight: 30,
//     marginBottom: 8,
//   },
//   summarySubtitle: {
//     fontSize: 16,
//     color: '#555',
//     lineHeight: 22,
//     marginBottom: 16,
//   },
//   reasonsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   reasonChip: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#E8F5E9',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//     gap: 4,
//   },
//   reasonText: {
//     fontSize: 11,
//     color: '#2E7D32',
//     fontWeight: '500',
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#212121',
//     marginBottom: 20,
//   },
//   detailsText: {
//     fontSize: 15,
//     color: '#424242',
//     lineHeight: 24,
//     marginBottom: 24,
//   },
//   infoGrid: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: 16,
//     backgroundColor: '#FAFAFA',
//     borderRadius: 12,
//     marginBottom: 24,
//   },
//   infoItem: {
//     alignItems: 'center',
//   },
//   infoLabel: {
//     fontSize: 11,
//     color: '#757575',
//     marginTop: 4,
//   },
//   infoValue: {
//     fontSize: 12,
//     color: '#424242',
//     fontWeight: '600',
//     marginTop: 2,
//   },
//   benefitsSection: {
//     marginBottom: 24,
//   },
//   benefitsSectionTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#757575',
//     marginBottom: 12,
//   },
//   benefitsBox: {
//     backgroundColor: '#E8F5E9',
//     padding: 16,
//     borderRadius: 12,
//   },
//   longTermBox: {
//     backgroundColor: '#FFF3E0',
//   },
//   benefitItem: {
//     fontSize: 14,
//     color: '#2E7D32',
//     lineHeight: 20,
//     marginBottom: 8,
//   },
//   longTermItem: {
//     color: '#E65100',
//   },
//   goalsSection: {
//     marginTop: 16,
//   },
//   goalsSectionTitle: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#757575',
//     marginBottom: 8,
//   },
//   goalsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   goalChip: {
//     backgroundColor: '#FFF3E0',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 8,
//   },
//   goalChipText: {
//     fontSize: 11,
//     color: '#E65100',
//     fontWeight: '500',
//   },
//   goalsMatchSection: {
//     marginBottom: 24,
//   },
//   goalsMatchTitle: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#4CAF50',
//     marginBottom: 12,
//     letterSpacing: 0.5,
//   },
//   goalsMatchGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 10,
//   },
//   userGoalChip: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#E8F5E9',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 16,
//     gap: 6,
//     borderWidth: 1,
//     borderColor: '#4CAF50',
//   },
//   userGoalText: {
//     fontSize: 13,
//     color: '#2E7D32',
//     fontWeight: '600',
//   },
//   allGoalsSection: {
//     marginTop: 8,
//   },
//   allGoalsTitle: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#757575',
//     marginBottom: 8,
//   },
//   goalChipHighlight: {
//     backgroundColor: '#C8E6C9',
//     borderWidth: 1,
//     borderColor: '#4CAF50',
//   },
//   goalChipTextHighlight: {
//     color: '#2E7D32',
//     fontWeight: '600',
//   },
//   whyItWorksSection: {
//     backgroundColor: '#F0F7FF',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 20,
//   },
//   whyItWorksText: {
//     fontSize: 15,
//     color: '#424242',
//     lineHeight: 24,
//   },
//   tipTypeGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   tipTypeBadge: {
//     backgroundColor: '#E3F2FD',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 8,
//   },
//   tipTypeText: {
//     fontSize: 11,
//     color: '#1976D2',
//     fontWeight: '500',
//   },
//   howToContent: {
//     marginBottom: 24,
//   },
//   bulletPoint: {
//     flexDirection: 'row',
//     marginBottom: 12,
//     paddingLeft: 8,
//   },
//   bulletIcon: {
//     fontSize: 16,
//     color: '#4CAF50',
//     marginRight: 10,
//     fontWeight: '700',
//   },
//   bulletText: {
//     fontSize: 15,
//     color: '#424242',
//     lineHeight: 22,
//     flex: 1,
//   },
//   personalizationPrompt: {
//     fontSize: 16,
//     color: '#424242',
//     lineHeight: 24,
//     marginBottom: 24,
//   },
//   scaleInputContainer: {
//     gap: 20,
//   },
//   scaleLevel: {
//     marginBottom: 8,
//   },
//   scaleLevelHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 6,
//     gap: 12,
//   },
  
//   scaleNumber: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#FFE0B2',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   scaleNumberMid: {
//     backgroundColor: '#C8E6C9',
//   },
//   scaleNumberFull: {
//     backgroundColor: '#FFCDD2',
//   },
//   scaleNumberText: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#424242',
//   },
//   scaleLevelLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#757575',
//   },
//   scaleInput: {
//     backgroundColor: '#F5F5F5',
//     borderRadius: 12,
//     padding: 12,
//     fontSize: 15,
//     color: '#424242',
//     minHeight: 60,
//     textAlignVertical: 'top',
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//   },
//   scaleNameInput: {
//     backgroundColor: '#FFF',
//     borderRadius: 10,
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     fontSize: 17,
//     fontWeight: '600',
//     color: '#424242',
//     borderWidth: 2,
//     borderColor: '#E8E8E8',
//     flex: 1,
//   },
//   scaleDescriptor: {
//     fontSize: 13,
//     color: '#757575',
//     marginLeft: 44,
//     fontStyle: 'italic',
//   },
//   saveButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#4CAF50',
//     borderRadius: 14,
//     paddingVertical: 14,
//     marginTop: 24,
//     gap: 8,
//   },
//   saveButtonText: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#FFF',
//   },
//   savedScaleContainer: {
//     backgroundColor: '#F0F7FF',
//     borderRadius: 16,
//     padding: 20,
//   },
//   savedHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//     marginBottom: 20,
//   },
//   savedTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#212121',
//   },
//   savedScaleItems: {
//     gap: 16,
//   },
//   savedScaleItemWrapper: {
//     backgroundColor: 'white',
//     padding: 12,
//     borderRadius: 10,
//   },
//   savedScaleItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   savedScaleDesc: {
//     fontSize: 12,
//     color: '#757575',
//     fontStyle: 'italic',
//     marginLeft: 40,
//     marginTop: 4,
//   },
//   savedScaleNumber: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   savedScaleNumberText: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#424242',
//   },
//   savedScaleText: {
//     fontSize: 15,
//     color: '#424242',
//     flex: 1,
//     fontWeight: '500',
//   },
//   savedScaleName: {
//     fontSize: 20,
//     color: '#212121',
//     fontWeight: '700',
//     flex: 1,
//   },
//   editButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 16,
//     gap: 6,
//     paddingVertical: 8,
//   },
//   editButtonText: {
//     fontSize: 14,
//     color: '#4CAF50',
//     fontWeight: '600',
//   },
//   celebrationOverlay: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: [{ translateX: -80 }, { translateY: -50 }],
//     backgroundColor: 'white',
//     borderRadius: 16,
//     padding: 20,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 12,
//     elevation: 8,
//   },
//   celebrationText: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#4CAF50',
//     marginTop: 8,
//   },
//   choiceContainer: {
//     gap: 12,
//     marginTop: 20,
//   },
//   choiceButton: {
//     backgroundColor: '#FFF',
//     borderRadius: 16,
//     paddingVertical: 20,
//     paddingHorizontal: 24,
//     borderWidth: 2,
//     borderColor: '#E8E8E8',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   choiceButtonSelected: {
//     backgroundColor: '#E8F5E9',
//     borderColor: '#4CAF50',
//     borderWidth: 2,
//     transform: [{ scale: 0.98 }],
//   },
//   choiceButtonText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#424242',
//     flex: 1,
//   },
//   choiceButtonTextSelected: {
//     color: '#2E7D32',
//   },
//   choiceCheckmark: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     backgroundColor: '#4CAF50',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   savedChoiceContainer: {
//     backgroundColor: '#F0F7FF',
//     borderRadius: 16,
//     padding: 20,
//   },
//   savedChoiceBox: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     borderLeftWidth: 4,
//     borderLeftColor: '#4CAF50',
//   },
//   savedChoicePrompt: {
//     fontSize: 14,
//     color: '#757575',
//     marginBottom: 8,
//   },
//   savedChoiceText: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#2E7D32',
//   },
//   choiceItem: {
//     backgroundColor: '#FFF',
//     borderRadius: 10,
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     marginBottom: 4,
//     borderWidth: 2,
//     borderColor: '#E8E8E8',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.03,
//     shadowRadius: 4,
//     elevation: 1,
//   },
//   choiceItemSelected: {
//     backgroundColor: '#F0F7FF',
//     borderColor: '#4CAF50',
//   },
//   choiceItemHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginBottom: 2,
//   },
//   choiceCircle: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   choiceText: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#424242',
//     flex: 1,
//   },
//   choiceTextSelected: {
//     color: '#2E7D32',
//   },
//   choiceTimeDescription: {
//     fontSize: 11,
//     color: '#757575',
//     marginLeft: 32,
//     fontStyle: 'italic',
//     lineHeight: 14,
//   },
//   actionContainer: {
//     paddingTop: 16,
//     paddingHorizontal: 20,
//     paddingBottom: 24,
//     borderTopWidth: 1,
//     borderTopColor: 'rgba(0, 0, 0, 0.05)',
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: -4 },
//         shadowOpacity: 0.04,
//         shadowRadius: 16,
//       },
//       android: {
//         elevation: 10,
//       },
//     }),
//   },
//   primaryAction: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 18,
//     backgroundColor: '#4CAF50',
//     borderRadius: 14,
//     gap: 8,
//     marginBottom: 14,
//   },
//   primaryActionText: {
//     fontSize: 17,
//     fontWeight: '700',
//     color: '#FFF',
//   },
//   secondaryActions: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   secondaryAction: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 14,
//     borderRadius: 12,
//     gap: 6,
//   },
//   maybeButton: {
//     backgroundColor: '#FFF3E0',
//   },
//   maybeButtonText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#FF9800',
//   },
//   skipButton: {
//     backgroundColor: '#F5F5F5',
//   },
//   skipButtonText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#757575',
//   },
//   rejectionStatusWrapper: {
//     position: 'relative',
//   },
//   rejectionCornerLabel: {
//     position: 'absolute',
//     top: -10,
//     right: 20,
//     backgroundColor: '#F87171',
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 10,
//     zIndex: 1,
//   },
//   rejectionCornerLabelText: {
//     fontSize: 11,
//     fontWeight: '600',
//     color: '#FFF',
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//   },
//   rejectionStatusCard: {
//     backgroundColor: '#FFF',
//     borderRadius: 16,
//     padding: 20,
//     borderWidth: 1.5,
//     borderColor: '#FCA5A5',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   rejectionStatusHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 16,
//     marginBottom: 16,
//   },
//   rejectionIconWrapper: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#FEE2E2',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   rejectionStatusContent: {
//     flex: 1,
//   },
//   rejectionStatusLabel: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#1F2937',
//     marginBottom: 2,
//   },
//   rejectionStatusSubtext: {
//     fontSize: 14,
//     color: '#6B7280',
//     fontStyle: 'italic',
//   },
//   rejectionReasonsCard: {
//     backgroundColor: '#FEF3F2',
//     borderRadius: 12,
//     padding: 14,
//     borderLeftWidth: 3,
//     borderLeftColor: '#F87171',
//   },
//   rejectionReasonHeader: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#7F1D1D',
//     marginBottom: 8,
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//   },
//   rejectionReasonsList: {
//     gap: 6,
//   },
//   rejectionReasonRow: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     gap: 10,
//   },
//   rejectionReasonDot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: '#DC2626',
//     marginTop: 5,
//   },
//   rejectionReasonText: {
//     fontSize: 14,
//     color: '#1F2937',
//     flex: 1,
//     lineHeight: 20,
//   },
//   rejectionEditButton: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#F3F4F6',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
//   rejectionInlineWrapper: {
//     position: 'relative',
//     marginTop: 20,
//   },
//   rejectionInlineCornerLabel: {
//     position: 'absolute',
//     top: -8,
//     right: 16,
//     backgroundColor: '#F87171',
//     paddingHorizontal: 10,
//     paddingVertical: 3,
//     borderRadius: 8,
//     zIndex: 1,
//   },
//   rejectionInlineCornerLabelText: {
//     fontSize: 10,
//     fontWeight: '600',
//     color: '#FFF',
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//   },
//   rejectionInlineCard: {
//     backgroundColor: '#FFF',
//     borderRadius: 12,
//     padding: 16,
//     borderWidth: 1.5,
//     borderColor: '#FCA5A5',
//   },
//   rejectionInlineHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//     marginBottom: 12,
//   },
//   rejectionInlineIconWrapper: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#FEE2E2',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   rejectionInlineContent: {
//     flex: 1,
//   },
//   rejectionInlineLabel: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#DC2626',
//   },
//   rejectionInlineSubtext: {
//     fontSize: 11,
//     color: '#9CA3AF',
//     marginTop: 1,
//   },
//   rejectionInlineEditButton: {
//     width: 26,
//     height: 26,
//     borderRadius: 13,
//     backgroundColor: '#F9FAFB',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
//   rejectionInlineReasonsBox: {
//     backgroundColor: '#FEF3F2',
//     borderRadius: 8,
//     padding: 10,
//   },
//   rejectionInlineReasonHeader: {
//     fontSize: 10,
//     fontWeight: '600',
//     color: '#EF4444',
//     marginBottom: 6,
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//   },
//   rejectionInlineReasonsList: {
//     gap: 4,
//   },
//   rejectionInlineReasonRow: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     gap: 6,
//   },
//   rejectionInlineReasonDot: {
//     width: 4,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: '#DC2626',
//     marginTop: 4,
//   },
//   rejectionInlineReasonText: {
//     fontSize: 12,
//     color: '#1F2937',
//     flex: 1,
//     lineHeight: 16,
//   },
//   maybeLaterInlineWrapper: {
//     position: 'relative',
//     marginTop: 20,
//   },
//   maybeLaterInlineCornerLabel: {
//     position: 'absolute',
//     top: -8,
//     right: 16,
//     backgroundColor: '#F59E0B',
//     paddingHorizontal: 10,
//     paddingVertical: 3,
//     borderRadius: 8,
//     zIndex: 1,
//   },
//   maybeLaterInlineCornerLabelText: {
//     fontSize: 10,
//     fontWeight: '600',
//     color: '#FFF',
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//   },
//   maybeLaterInlineCard: {
//     backgroundColor: '#FFF',
//     borderRadius: 12,
//     padding: 16,
//     borderWidth: 1.5,
//     borderColor: '#FCD34D',
//   },
//   maybeLaterInlineHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//     marginBottom: 12,
//   },
//   maybeLaterInlineIconWrapper: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#FEF3C7',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   maybeLaterInlineContent: {
//     flex: 1,
//   },
//   maybeLaterInlineLabel: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#F59E0B',
//   },
//   maybeLaterInlineSubtext: {
//     fontSize: 11,
//     color: '#9CA3AF',
//     marginTop: 1,
//   },
//   maybeLaterInlineInfoBox: {
//     backgroundColor: '#FFFBEB',
//     borderRadius: 8,
//     padding: 10,
//   },
//   maybeLaterInlineInfoText: {
//     fontSize: 12,
//     color: '#78350F',
//     lineHeight: 16,
//   },
//   // Text input styles
//   textInputWrapper: {
//     marginTop: 4,
//     gap: 8,
//   },
//   textInputField: {
//     backgroundColor: '#FFF',
//     borderWidth: 2,
//     borderColor: '#E0E0E0',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     fontSize: 16,
//     color: '#333',
//     minHeight: 52,
//     marginTop: 4,
//   },
//   saveTextButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 8,
//     backgroundColor: '#4CAF50',
//     paddingVertical: 14,
//     borderRadius: 12,
//     marginTop: 8,
//   },
//   saveTextButtonDisabled: {
//     backgroundColor: '#CCCCCC',
//   },
//   saveTextButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#FFF',
//   },
//   // Multiple choice save button
//   saveMultipleButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 8,
//     backgroundColor: '#4CAF50',
//     paddingVertical: 14,
//     borderRadius: 12,
//     marginTop: 20,
//   },
//   saveMultipleButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#FFF',
//   },
//   // Multi-text styles
//   multiTextWrapper: {
//     marginTop: 4,
//   },
//   multiTextSection: {
//     marginTop: 16,
//   },
//   multiTextLabel: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 6,
//   },
//   savedMultiTextBox: {
//     backgroundColor: '#F8F8F8',
//     borderRadius: 12,
//     padding: 16,
//     gap: 12,
//   },
//   savedMultiTextItem: {
//     borderBottomWidth: 1,
//     borderBottomColor: '#E0E0E0',
//     paddingBottom: 8,
//   },
//   savedMultiTextLabel: {
//     fontSize: 13,
//     color: '#666',
//     marginBottom: 4,
//   },
//   savedMultiTextValue: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#333',
//   },
// });
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { savePersonalizationData, setPendingPersonalizationData } from '@/store/slices/dailyTipSlice';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SimplifiedTip } from '../types/simplifiedTip';
import PersonalizationCard from './PersonalizationCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = 16;
const CARD_WIDTH = SCREEN_WIDTH - (CARD_MARGIN * 2);

// Theme based on new_design.html (Green Theme)
const theme = {
  primary: '#2E7D32',
  primaryLight: '#4CAF50',
  primaryLighter: '#81C784',
  primaryLightest: '#E8F5E9',
  gray900: '#1A1A1A',
  gray700: '#4A4A4A',
  gray500: '#767676',
  gray300: '#B8B8B8',
  gray100: '#F5F5F5',
  white: '#FFFFFF',
  shadow: 'rgba(46, 125, 50, 0.25)',
};

interface Props {
  tip: SimplifiedTip;
  onResponse: (response: 'try_it' | 'maybe_later') => void;
  onNotForMe: () => void;
  reasons?: string[];
  userGoals?: string[];
  rejectionInfo?: {
    feedback: 'not_for_me';
    reason?: string;
  };
  maybeLaterInfo?: {
    feedback: 'maybe_later';
    savedAt?: Date | string;
  };
  onSavePersonalization?: (data: any) => void;
  savedPersonalizationData?: any;
}

export default function DailyTipCardEnhanced({ 
  tip, 
  onResponse, 
  onNotForMe, 
  reasons = [], 
  userGoals = [], 
  rejectionInfo, 
  maybeLaterInfo, 
  onSavePersonalization, 
  savedPersonalizationData 
}: Props) {
  const [currentPage, setCurrentPage] = useState(0);
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  
  const dispatch = useAppDispatch();
  const pendingPersonalizationData = useAppSelector(state => state.dailyTip.pendingPersonalizationData);
  const reduxSavedData = useAppSelector(state => state.dailyTip.savedPersonalizationData);

  // Reset to first page when tip changes
  useEffect(() => {
    setCurrentPage(0);
    flatListRef.current?.scrollToIndex({ index: 0, animated: false });
  }, [tip.tip_id]);

  // --- Parsing Logic ---
  const parseDetailsContent = () => {
    const content = tip.details_md || '';
    const sections: { experiment?: string; whyItWorks?: string; howToTry?: string } = {};
    const experimentMatch = content.match(/\*\*The Experiment:\*\*(.+?)(?=\*\*Why it Works:|\*\*How to|$)/s);
    if (experimentMatch) sections.experiment = experimentMatch[1].trim();
    const whyMatch = content.match(/\*\*Why it Works:\*\*(.+?)(?=\*\*How to|$)/s);
    if (whyMatch) sections.whyItWorks = whyMatch[1].trim();
    const howMatch = content.match(/\*\*How to Try It:\*\*(.+?)$/s);
    if (howMatch) sections.howToTry = howMatch[1].trim();
    return sections;
  };
  
  const detailsSections = parseDetailsContent();
  const relevantGoals = userGoals.filter(userGoal => tip.goals?.includes(userGoal));
  const shouldShowPersonalization = !!tip.personalization_prompt;

  // --- Handlers ---

  const handleResponse = async (response: 'try_it' | 'maybe_later') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (response === 'try_it' && pendingPersonalizationData) {
      dispatch(savePersonalizationData(pendingPersonalizationData));
      if (onSavePersonalization) {
        try {
          await onSavePersonalization(pendingPersonalizationData);
        } catch (error) {
          console.error('Error saving personalization data:', error);
        }
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    onResponse(response);
  };
  
  const handleNotForMe = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onNotForMe();
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const scrollToPage = (index: number) => {
    if (index >= 0 && index < pages.length) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      flatListRef.current?.scrollToIndex({ index, animated: true });
      setCurrentPage(index);
    }
  };

  // --- Helper Components ---

  const CardVisualHeader = ({ title, subtitle, icon, badgeLabel }: any) => (
    <View style={styles.cardVisual}>
      {/* Background decoration circles matching CSS */}
      <View style={styles.decoCircleBig} />
      <View style={styles.decoCircleSmall} />

      <View style={styles.timeDifficultyContainer}>
        <View style={styles.visualBadge}>
          <Ionicons name="time-outline" size={14} color={theme.primary} />
          <Text style={styles.visualBadgeText}>{tip.time ? tip.time.replace('_', ' ') : '5 min'}</Text>
        </View>
        <View style={styles.visualBadge}>
          <Text style={styles.visualBadgeText}>{tip.difficulty ? `Level ${tip.difficulty}` : 'Easy'}</Text>
        </View>
      </View>

      <Ionicons name={icon} size={56} color="white" style={styles.visualIcon} />
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
    </View>
  );

  // --- Render Methods ---

  const renderSummaryCard = () => (
    <View style={styles.pageContainer}>
      <View style={styles.mainCard}>
        <LinearGradient
          colors={[theme.primary, theme.primaryLight]}
          style={styles.cardVisualGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <CardVisualHeader 
            title={tip.summary} 
            subtitle="Today's Idea to Try" 
            icon="bulb-outline" 
          />
        </LinearGradient>

        <View style={styles.cardContent}>
          <View style={styles.benefitsGrid}>
             {/* Map existing data to "Benefits" look */}
            {reasons.length > 0 ? reasons.map((r, i) => (
              <View key={i} style={styles.benefitItem}>
                <Ionicons name="star" size={18} color={theme.primaryLight} />
                <Text style={styles.benefitText}>{r}</Text>
              </View>
            )) : (
              <View style={styles.benefitItem}>
                 <Ionicons name="flash" size={18} color={theme.primaryLight} />
                 <Text style={styles.benefitText}>Quick & Effective</Text>
              </View>
            )}
            
            {/* Dynamic benefits based on metadata */}
            <View style={styles.benefitItem}>
              <Ionicons name="people" size={18} color={theme.primaryLight} />
              <Text style={styles.benefitText}>Community Favorite</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="wallet-outline" size={18} color={theme.primaryLight} />
              <Text style={styles.benefitText}>{tip.money_cost_enum === 'free' ? 'Completely Free' : 'Low Cost'}</Text>
            </View>
          </View>

          {tip.short_description && (
            <Text style={styles.bodyText}>{tip.short_description}</Text>
          )}
        </View>
      </View>
    </View>
  );

  const renderGoalsCard = () => (
    <View style={styles.pageContainer}>
      <View style={styles.mainCard}>
        <LinearGradient colors={[theme.primary, theme.primaryLight]} style={styles.cardVisualGradient}>
          <CardVisualHeader title="Goals" subtitle="Why this matters" icon="trophy-outline" />
        </LinearGradient>
        <ScrollView style={styles.cardContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Targeted Goals</Text>
          <View style={styles.tagContainer}>
             {[...new Set(tip.goals || [])].map((goal, index) => {
                const isUserGoal = relevantGoals.includes(goal);
                return (
                  <View key={index} style={[styles.tag, isUserGoal && styles.tagActive]}>
                    {isUserGoal && <Ionicons name="checkmark-circle" size={16} color={theme.primary} />}
                    <Text style={[styles.tagText, isUserGoal && styles.tagTextActive]}>
                      {goal.replace(/_/g, ' ')}
                    </Text>
                  </View>
                );
              })}
          </View>
        </ScrollView>
      </View>
    </View>
  );

  const renderBenefitsCard = () => (
    <View style={styles.pageContainer}>
      <View style={styles.mainCard}>
        <LinearGradient colors={[theme.primary, theme.primaryLight]} style={styles.cardVisualGradient}>
          <CardVisualHeader title="The Science" subtitle="Why it works" icon="school-outline" />
        </LinearGradient>
        <ScrollView style={styles.cardContent} showsVerticalScrollIndicator={false}>
          {detailsSections.whyItWorks ? (
             <Text style={styles.bodyText}>{detailsSections.whyItWorks}</Text>
          ) : (
            <Text style={styles.bodyText}>This habit uses psychology to improve your daily routine.</Text>
          )}
          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Mechanisms</Text>
          <View style={styles.tagContainer}>
            {(tip.mechanisms || []).map((m, i) => (
              <View key={i} style={styles.tag}>
                 <Text style={styles.tagText}>{m.replace(/_/g, ' ')}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );

  const renderHowToCard = () => (
    <View style={styles.pageContainer}>
      <View style={styles.mainCard}>
        <LinearGradient colors={[theme.primary, theme.primaryLight]} style={styles.cardVisualGradient}>
          <CardVisualHeader title="How To" subtitle="Step by Step" icon="list-outline" />
        </LinearGradient>
        <ScrollView style={styles.cardContent} showsVerticalScrollIndicator={false}>
           {detailsSections.howToTry ? (
            <View>
              {detailsSections.howToTry.split('\n').map((line, index) => {
                const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
                return (
                  <View key={index} style={styles.bulletRow}>
                    {isBullet && <Text style={styles.bulletDot}>•</Text>}
                    <Text style={styles.bodyText}>{line.replace(/^[•-]\s*/, '').trim()}</Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <Text style={styles.bodyText}>{detailsSections.experiment || tip.details_md}</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );

  const renderPersonalizationCard = () => (
    <View style={styles.pageContainer}>
      <View style={styles.mainCard}>
        <LinearGradient colors={[theme.primary, theme.primaryLight]} style={styles.cardVisualGradient}>
          <CardVisualHeader title="Your Plan" subtitle="Customize It" icon="create-outline" />
        </LinearGradient>
        <View style={[styles.cardContent, { paddingHorizontal: 0, flex: 1 }]}>
           <PersonalizationCard
              tip={tip}
              savedData={savedPersonalizationData || reduxSavedData}
              onSave={async (data) => {
                dispatch(savePersonalizationData(data));
                if (onSavePersonalization) await onSavePersonalization(data);
              }}
              onDataChange={(data) => dispatch(setPendingPersonalizationData(data))}
              showHeader={false}
              style={{ paddingHorizontal: 24 }} // Pass padding down
           />
        </View>
      </View>
    </View>
  );

  // --- Navigation Setup ---

  const pages = [
    { key: 'summary', title: 'Summary', icon: 'flash', render: renderSummaryCard },
    { key: 'goals', title: 'Goals', icon: 'trophy', render: renderGoalsCard },
    { key: 'benefits', title: 'Why', icon: 'school', render: renderBenefitsCard },
    { key: 'howto', title: 'How To', icon: 'list', render: renderHowToCard },
    ...(shouldShowPersonalization ? [{ key: 'personalize', title: 'Plan', icon: 'create', render: renderPersonalizationCard }] : []),
  ];

  return (
    <View style={styles.container}>
      
      {/* 1. Header Title */}
      <View style={[styles.header, { marginTop: insets.top }]}>
        <Text style={styles.appTitle}>Daily Habit</Text>
      </View>

      {/* 2. Story Progress Bar */}
      <View style={styles.storiesSection}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {pages.map((page, index) => {
            const isActive = index === currentPage;
            const isCompleted = index < currentPage;
            
            return (
              <TouchableOpacity 
                key={page.key} 
                style={styles.storyItem}
                onPress={() => scrollToPage(index)}
                activeOpacity={0.8}
              >
                {/* The Line Connector */}
                {index < pages.length - 1 && (
                  <View style={[
                    styles.storyLine, 
                    (isCompleted || isActive) && { backgroundColor: theme.primaryLight } 
                  ]} />
                )}
                
                {/* The Circle */}
                <View style={[
                  styles.storyCircle, 
                  isActive && styles.storyCircleActive,
                  (isCompleted && !isActive) && styles.storyCircleViewed
                ]}>
                  <View style={styles.storyInner}>
                    <Ionicons 
                      name={page.icon as any} 
                      size={20} 
                      color={isActive ? theme.primary : theme.gray500} 
                    />
                  </View>
                </View>
                <Text style={[
                  styles.storyLabel,
                  isActive && { color: theme.primary, fontWeight: '600' }
                ]}>{page.title}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 3. Main Card Slider */}
      <View style={styles.cardContainer}>
        <Animated.FlatList
          ref={flatListRef}
          data={pages}
          renderItem={({ item }) => item.render()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          keyExtractor={(item) => item.key}
          onMomentumScrollEnd={(event) => {
            const newPage = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
            setCurrentPage(newPage);
          }}
        />
      </View>

      {/* 4. Social Proof (Below card, above buttons) */}
      <View style={styles.socialProof}>
        <Ionicons name="people-circle-outline" size={18} color={theme.primary} />
        <Text style={styles.socialProofText}>
          <Text style={{ color: theme.primary, fontWeight: '700' }}>2,403</Text> people tried this recently
        </Text>
      </View>

      {/* 5. Action Buttons */}
      {!rejectionInfo && !maybeLaterInfo && (
        <View style={[styles.actionSection, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => handleResponse('try_it')}
            activeOpacity={0.9}
          >
            <Ionicons name="checkmark-circle-outline" size={24} color="white" />
            <Text style={styles.primaryBtnText}>I'll Try It!</Text>
          </TouchableOpacity>
          
          <View style={styles.secondaryActions}>
            <TouchableOpacity
              style={[styles.secondaryBtn]}
              onPress={() => handleResponse('maybe_later')}
              activeOpacity={0.7}
            >
               <Ionicons name="bookmark-outline" size={18} color={theme.gray700} />
               <Text style={styles.secondaryBtnText}>Save for Later</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.secondaryBtn]}
              onPress={handleNotForMe}
              activeOpacity={0.7}
            >
               <Ionicons name="close-outline" size={18} color={theme.gray700} />
               <Text style={styles.secondaryBtnText}>Pass</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.gray100,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: theme.white,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.primary,
    letterSpacing: -0.5,
  },
  // Stories Section
  storiesSection: {
    backgroundColor: theme.white,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
    width: 70, // Fixed width for spacing
  },
  storyCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    padding: 2,
    backgroundColor: theme.gray300,
    marginBottom: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyCircleActive: {
    backgroundColor: theme.primaryLight,
    transform: [{ scale: 1.05 }],
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  storyCircleViewed: {
    backgroundColor: theme.primaryLighter, // Or gray depending on preference
    opacity: 0.8,
  },
  storyInner: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: theme.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.white,
  },
  storyLabel: {
    fontSize: 11,
    color: theme.gray500,
    fontWeight: '500',
    textAlign: 'center',
  },
  storyLine: {
    position: 'absolute',
    top: 28, // Center of circle height
    left: 56, // Circle width
    width: 30, // Distance to next circle
    height: 2,
    backgroundColor: theme.gray300,
    zIndex: -1,
  },
  // Main Card
  cardContainer: {
    flex: 1,
  },
  pageContainer: {
    width: SCREEN_WIDTH,
    paddingHorizontal: CARD_MARGIN,
    paddingTop: 20,
    paddingBottom: 10,
  },
  mainCard: {
    flex: 1,
    backgroundColor: theme.white,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 5,
  },
  cardVisualGradient: {
    height: 220, 
  },
  cardVisual: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: 20,
  },
  // Decorative background circles
  decoCircleBig: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.1)',
    top: -150,
    right: -150,
  },
  decoCircleSmall: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: -100,
    left: -100,
  },
  timeDifficultyContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    gap: 8,
  },
  visualBadge: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  visualBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.primary,
    textTransform: 'capitalize',
  },
  visualIcon: {
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: theme.white,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardContent: {
    flex: 1,
    padding: 24,
    backgroundColor: theme.white,
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  benefitItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  benefitText: {
    fontSize: 13,
    color: theme.gray700,
    fontWeight: '500',
    flex: 1,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.gray700,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.gray900,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: theme.gray100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tagActive: {
    backgroundColor: theme.primaryLightest,
    borderWidth: 1,
    borderColor: theme.primaryLight,
  },
  tagText: {
    fontSize: 12,
    color: theme.gray700,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  tagTextActive: {
    color: theme.primary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: theme.gray100,
    marginVertical: 20,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  bulletDot: {
    fontSize: 16,
    color: theme.primary,
    marginRight: 8,
    fontWeight: 'bold',
  },
  // Social Proof
  socialProof: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingBottom: 16,
  },
  socialProofText: {
    fontSize: 13,
    color: theme.gray700,
  },
  // Actions
  actionSection: {
    paddingHorizontal: 20,
    paddingTop: 0,
  },
  primaryBtn: {
    backgroundColor: theme.primary,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 12,
  },
  primaryBtnText: {
    color: theme.white,
    fontSize: 17,
    fontWeight: '700',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: theme.white,
    borderWidth: 1,
    borderColor: theme.gray300,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.gray700,
  },
});