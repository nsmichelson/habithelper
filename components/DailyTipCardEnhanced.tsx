import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Line, Path, Polygon, Polyline, Rect } from 'react-native-svg';
import { SimplifiedTip } from '../types/simplifiedTip';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 40;

// Type definitions
type ThemeName = 'green' | 'orange' | 'gold' | 'pink' | 'indigo' | 'turquoise' | 'violet';

interface Theme {
  primary: string;
  primaryLight: string;
  primaryLighter: string;
  primaryLightest: string;
}

interface StoryItem {
  id: string;
  label: string;
  icon: (color: string) => JSX.Element;
  active?: boolean;
  viewed?: boolean;
  completed?: boolean;
}

interface BenefitItem {
  id: string;
  icon: JSX.Element;
  text: string;
}

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

// Theme configurations
const themes: Record<ThemeName, Theme> = {
  green: {
    primary: '#2E7D32',
    primaryLight: '#4CAF50',
    primaryLighter: '#81C784',
    primaryLightest: '#E8F5E9',
  },
  orange: {
    primary: '#D84315',
    primaryLight: '#FF6B35',
    primaryLighter: '#FF8A65',
    primaryLightest: '#FFF3E0',
  },
  gold: {
    primary: '#F57C00',
    primaryLight: '#FFB300',
    primaryLighter: '#FFD54F',
    primaryLightest: '#FFF8E1',
  },
  pink: {
    primary: '#C2185B',
    primaryLight: '#EC407A',
    primaryLighter: '#F48FB1',
    primaryLightest: '#FCE4EC',
  },
  indigo: {
    primary: '#3949AB',
    primaryLight: '#5C6BC0',
    primaryLighter: '#7986CB',
    primaryLightest: '#E8EAF6',
  },
  turquoise: {
    primary: '#00838F',
    primaryLight: '#26C6DA',
    primaryLighter: '#4DD0E1',
    primaryLightest: '#E0F7FA',
  },
  violet: {
    primary: '#8E24AA',
    primaryLight: '#BA68C8',
    primaryLighter: '#CE93D8',
    primaryLightest: '#F3E5F5',
  },
};

// Neutral colors (constant across themes)
const neutralColors = {
  accent: '#7E57C2',
  accentLight: '#9575CD',
  accentLightest: '#F3E5F5',
  gray900: '#1A1A1A',
  gray700: '#4A4A4A',
  gray500: '#767676',
  gray300: '#B8B8B8',
  gray100: '#F5F5F5',
  white: '#FFFFFF',
  warning: '#FF9800',
  warningLight: '#FFF3E0',
  error: '#F44336',
  errorLight: '#FFEBEE',
};

export default function HabitHelper({ 
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
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('green');
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [activeNavItem, setActiveNavItem] = useState('Today');
  const [currentPage, setCurrentPage] = useState(0);
  
  // Personalization states
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
  const [savedChoice, setSavedChoice] = useState<string | null>(savedPersonalizationData?.data || null);
  const [savedChoices, setSavedChoices] = useState<string[] | null>(savedPersonalizationData?.data || null);
  const [textInput, setTextInput] = useState('');
  const [savedTextInput, setSavedTextInput] = useState<string | null>(savedPersonalizationData?.data || null);
  const [multiTextInputs, setMultiTextInputs] = useState<Record<number, string>>({});
  const [savedMultiTextInputs, setSavedMultiTextInputs] = useState<Record<number, string> | null>(savedPersonalizationData?.data || null);
  const [showSaveAnimation, setShowSaveAnimation] = useState(false);
  
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  
  const theme = themes[currentTheme];
  const themeList = Object.keys(themes) as ThemeName[];

  // Parse details_md to extract sections
  const parseDetailsContent = () => {
    const content = tip.details_md || '';
    const sections: { experiment?: string; whyItWorks?: string; howToTry?: string } = {};
    
    const experimentMatch = content.match(/\*\*The Experiment:\*\*(.+?)(?=\*\*Why it Works:|\*\*How to|$)/s);
    if (experimentMatch) {
      sections.experiment = experimentMatch[1].trim();
    }
    
    const whyMatch = content.match(/\*\*Why it Works:\*\*(.+?)(?=\*\*How to|$)/s);
    if (whyMatch) {
      sections.whyItWorks = whyMatch[1].trim();
    }
    
    const howMatch = content.match(/\*\*How to Try It:\*\*(.+?)$/s);
    if (howMatch) {
      sections.howToTry = howMatch[1].trim();
    }
    
    return sections;
  };
  
  const detailsSections = parseDetailsContent();

  // Reset to first page when tip changes
  useEffect(() => {
    setCurrentPage(0);
    flatListRef.current?.scrollToIndex({ index: 0, animated: false });
  }, [tip.tip_id]);

  // Load saved theme on mount
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('selectedTheme');
      if (savedTheme && themeList.includes(savedTheme as ThemeName)) {
        setCurrentTheme(savedTheme as ThemeName);
      } else {
        const randomTheme = themeList[Math.floor(Math.random() * themeList.length)];
        setCurrentTheme(randomTheme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const cycleTheme = async () => {
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      rotateAnim.setValue(0);
    });

    const currentIndex = themeList.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themeList.length;
    const nextTheme = themeList[nextIndex];
    
    setCurrentTheme(nextTheme);
    try {
      await AsyncStorage.setItem('selectedTheme', nextTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const handleResponse = async (response: 'try_it' | 'maybe_later') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Handle personalization saving if needed
    if (response === 'try_it' && onSavePersonalization) {
      // Save any pending personalization data
      if (savedChoice || savedChoices || savedTextInput || savedMultiTextInputs) {
        const data = savedChoice || savedChoices || savedTextInput || savedMultiTextInputs;
        await onSavePersonalization({ type: tip.personalization_type, data });
      }
    }
    
    onResponse(response);
  };

  const handleNotForMe = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onNotForMe();
  };

  const navigateCard = (direction: number) => {
    const newIndex = currentPage + direction;
    if (newIndex >= 0 && newIndex < pages.length) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
    }
  };

  const getDifficultyLabel = (tier: number) => {
    const labels = ['Very Easy', 'Easy', 'Moderate', 'Challenging', 'Very Challenging'];
    return labels[tier - 1] || 'Easy';
  };

  const getTimeLabel = (time: string) => {
    const labels: Record<string, string> = {
      '0-5min': '< 5 min',
      '5-15min': '5-15 min',
      '15-30min': '15-30 min',
      '30min+': '> 30 min',
      '0_5_min': '< 5 min',
      '5_15_min': '5-15 min',
      '15_60_min': '15-60 min',
      '>60_min': '> 1 hour',
    };
    return labels[time] || time;
  };

  const styles = createStyles(theme, neutralColors);

  // Get relevant user goals that this tip meets
  const relevantGoals = userGoals.filter(userGoal =>
    tip.goals?.includes(userGoal)
  );

  // Story items data
  const stories: StoryItem[] = [
    {
      id: 'summary',
      label: 'Summary',
      icon: (color: string) => (
        <Svg width={24} height={24} viewBox="0 0 24 24">
          <Rect x={4} y={4} width={16} height={16} rx={2} stroke={color} strokeWidth={2} fill="none" />
          <Line x1={8} y1={9} x2={16} y2={9} stroke={color} strokeWidth={2} />
          <Line x1={8} y1={13} x2={14} y2={13} stroke={color} strokeWidth={2} />
        </Svg>
      ),
      active: activeStoryIndex === 0,
      completed: activeStoryIndex >= 0,
    },
    {
      id: 'why',
      label: 'Why It Works',
      icon: (color: string) => (
        <Svg width={24} height={24} viewBox="0 0 24 24">
          <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={2} fill="none" />
          <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={2} fill="none" />
        </Svg>
      ),
      active: activeStoryIndex === 1,
      completed: activeStoryIndex >= 1,
    },
    {
      id: 'howto',
      label: 'How To',
      icon: (color: string) => (
        <Svg width={24} height={24} viewBox="0 0 24 24">
          <Path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a1.82 1.82 0 0 0-2.91-.09z" 
                stroke={color} strokeWidth={2} fill="none" />
          <Path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" 
                stroke={color} strokeWidth={2} fill="none" />
        </Svg>
      ),
      active: activeStoryIndex === 2,
      completed: activeStoryIndex >= 2,
    },
    {
      id: 'protips',
      label: 'Pro Tips',
      icon: (color: string) => (
        <Svg width={24} height={24} viewBox="0 0 24 24">
          <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={2} fill="none" />
          <Path d="M12 6v6l4 2" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      ),
      active: activeStoryIndex === 3,
      completed: activeStoryIndex >= 3,
    },
  ];

  // Benefits data based on tip
  const benefits: BenefitItem[] = [];
  
  // Add benefits based on goals
  if (tip.goals?.includes('mindfulness')) {
    benefits.push({
      id: 'mindset',
      icon: (
        <Svg width={20} height={20} viewBox="0 0 24 24">
          <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" 
                   stroke={theme.primaryLight} strokeWidth={2} fill="none" />
        </Svg>
      ),
      text: 'Perfect for mindset focus',
    });
  }
  
  if (relevantGoals.length >= 3) {
    benefits.push({
      id: 'goals',
      icon: (
        <Svg width={20} height={20} viewBox="0 0 24 24">
          <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke={theme.primaryLight} strokeWidth={2} fill="none" />
          <Polyline points="22 4 12 14.01 9 11.01" stroke={theme.primaryLight} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      ),
      text: `Matches ${relevantGoals.length}/3 goals`,
    });
  }
  
  // Add default benefits
  benefits.push(
    {
      id: 'effort',
      icon: (
        <Svg width={20} height={20} viewBox="0 0 24 24">
          <Circle cx={12} cy={12} r={10} stroke={theme.primaryLight} strokeWidth={2} fill="none" />
          <Circle cx={12} cy={12} r={3} stroke={theme.primaryLight} strokeWidth={2} fill="none" />
        </Svg>
      ),
      text: 'Good effort match',
    },
    {
      id: 'time',
      icon: (
        <Svg width={20} height={20} viewBox="0 0 24 24">
          <Circle cx={12} cy={12} r={10} stroke={theme.primaryLight} strokeWidth={2} fill="none" />
          <Path d="M12 6v6l4 2" stroke={theme.primaryLight} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      ),
      text: 'Fits time budget',
    }
  );
  
  if (tip.time_of_day?.includes('morning')) {
    benefits.push({
      id: 'morning',
      icon: (
        <Svg width={20} height={20} viewBox="0 0 24 24">
          <Circle cx={12} cy={5} r={3} stroke={theme.primaryLight} strokeWidth={2} fill="none" />
          <Path d="M5.22 11a10 10 0 0 0 13.56 0" stroke={theme.primaryLight} strokeWidth={2} fill="none" />
        </Svg>
      ),
      text: 'Good for morning',
    });
  }
  
  benefits.push({
    id: 'fresh',
    icon: (
      <Svg width={20} height={20} viewBox="0 0 24 24">
        <Path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke={theme.primaryLight} strokeWidth={2} fill="none" />
        <Line x1={3} y1={6} x2={21} y2={6} stroke={theme.primaryLight} strokeWidth={2} />
      </Svg>
    ),
    text: 'Fresh option',
  });

  // Render functions for each page
  const renderSummaryCard = () => (
    <View style={styles.pageContainer}>
      <LinearGradient
        colors={['#FFFFFF', '#FAFAFA']}
        style={styles.cardGradient}
      >
        <View style={styles.badges}>
          <View style={[styles.badge, styles.timeBadge]}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text style={styles.badgeText}>{getTimeLabel(tip.time)}</Text>
          </View>
          <View style={[styles.badge, styles.difficultyBadge]}>
            <Text style={[styles.badgeText, { color: '#2E7D32' }]}>{getDifficultyLabel(tip.difficulty)}</Text>
          </View>
        </View>
        
        <Text style={styles.summaryTitle}>{tip.summary}</Text>

        {tip.short_description && (
          <Text style={styles.summarySubtitle}>{tip.short_description}</Text>
        )}
        
        {reasons.length > 0 && (
          <View style={styles.reasonsContainer}>
            {reasons.map((reason, index) => (
              <View key={index} style={styles.reasonChip}>
                <Ionicons name="sparkles" size={12} color="#4CAF50" />
                <Text style={styles.reasonText}>{reason}</Text>
              </View>
            ))}
          </View>
        )}

        {rejectionInfo && (
          <View style={styles.rejectionInlineWrapper}>
            <View style={styles.rejectionInlineCornerLabel}>
              <Text style={styles.rejectionInlineCornerLabelText}>You said</Text>
            </View>
            <View style={styles.rejectionInlineCard}>
              <View style={styles.rejectionInlineHeader}>
                <View style={styles.rejectionInlineIconWrapper}>
                  <Ionicons name="heart-dislike" size={20} color="#DC2626" />
                </View>
                <View style={styles.rejectionInlineContent}>
                  <Text style={styles.rejectionInlineLabel}>Not My Thing</Text>
                  <Text style={styles.rejectionInlineSubtext}>That's totally okay!</Text>
                </View>
                <TouchableOpacity
                  style={styles.rejectionInlineEditButton}
                  onPress={() => onNotForMe()}
                  activeOpacity={0.7}
                >
                  <Ionicons name="pencil" size={14} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              {rejectionInfo.reason && (
                <View style={styles.rejectionInlineReasonsBox}>
                  <Text style={styles.rejectionInlineReasonHeader}>Your feedback:</Text>
                  <View style={styles.rejectionInlineReasonsList}>
                    {rejectionInfo.reason.split(':').map((reason, index) => (
                      <View key={index} style={styles.rejectionInlineReasonRow}>
                        <View style={styles.rejectionInlineReasonDot} />
                        <Text style={styles.rejectionInlineReasonText}>{reason.trim()}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {maybeLaterInfo && (
          <View style={styles.maybeLaterInlineWrapper}>
            <View style={styles.maybeLaterInlineCornerLabel}>
              <Text style={styles.maybeLaterInlineCornerLabelText}>You said</Text>
            </View>
            <View style={styles.maybeLaterInlineCard}>
              <View style={styles.maybeLaterInlineHeader}>
                <View style={styles.maybeLaterInlineIconWrapper}>
                  <Ionicons name="bookmark" size={20} color="#F59E0B" />
                </View>
                <View style={styles.maybeLaterInlineContent}>
                  <Text style={styles.maybeLaterInlineLabel}>Saved for Later</Text>
                  <Text style={styles.maybeLaterInlineSubtext}>We'll remind you another time!</Text>
                </View>
              </View>
              
              <View style={styles.maybeLaterInlineInfoBox}>
                <Text style={styles.maybeLaterInlineInfoText}>
                  This tip has been saved to your collection. You can try it whenever you're ready!
                </Text>
              </View>
            </View>
          </View>
        )}
      </LinearGradient>
    </View>
  );

  const renderBenefitsCard = () => (
    <View style={styles.pageContainer}>
      <LinearGradient
        colors={['#FFFFFF', '#FAFAFA']}
        style={styles.cardGradient}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.sectionTitle}>Why This Works</Text>
          
          {detailsSections.whyItWorks ? (
            <View style={styles.whyItWorksSection}>
              <Text style={styles.whyItWorksText}>
                {detailsSections.whyItWorks}
              </Text>
            </View>
          ) : null}
          
          <View style={styles.benefitsGrid}>
            {benefits.slice(0, 6).map((benefit) => (
              <View key={benefit.id} style={styles.benefitItem}>
                {benefit.icon}
                <Text style={styles.benefitText}>{benefit.text}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );

  const renderHowToCard = () => (
    <View style={styles.pageContainer}>
      <LinearGradient
        colors={['#FFFFFF', '#FAFAFA']}
        style={styles.cardGradient}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.sectionTitle}>How To Do It</Text>
          
          {detailsSections.howToTry ? (
            <View style={styles.howToContent}>
              {detailsSections.howToTry.split('\n').map((line, index) => {
                const isBullet = line.trim().startsWith('•');
                if (isBullet) {
                  return (
                    <View key={index} style={styles.bulletPoint}>
                      <Text style={styles.bulletIcon}>•</Text>
                      <Text style={styles.bulletText}>{line.replace('•', '').trim()}</Text>
                    </View>
                  );
                }
                return line.trim() ? (
                  <Text key={index} style={styles.detailsText}>{line}</Text>
                ) : null;
              })}
            </View>
          ) : (
            <Text style={styles.detailsText}>
              {detailsSections.experiment || tip.details_md}
            </Text>
          )}
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Ionicons name="sunny-outline" size={20} color="#666" />
              <Text style={styles.infoLabel}>Best Time</Text>
              <Text style={styles.infoValue}>
                {(tip.time_of_day ?? []).map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ') || 'Any time'}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="cash-outline" size={20} color="#666" />
              <Text style={styles.infoLabel}>Cost</Text>
              <Text style={styles.infoValue}>{tip.money_cost_enum ?? 'Free'}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={20} color="#666" />
              <Text style={styles.infoLabel}>Where</Text>
              <Text style={styles.infoValue}>
                {(tip.location_tags ?? []).map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(', ') || 'Anywhere'}
              </Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );

  const renderGoalsCard = () => (
    <View style={styles.pageContainer}>
      <LinearGradient
        colors={['#FFFFFF', '#FAFAFA']}
        style={styles.cardGradient}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.sectionTitle}>Goals This Meets</Text>
          
          {relevantGoals.length > 0 ? (
            <View style={styles.goalsMatchSection}>
              <Text style={styles.goalsMatchTitle}>YOUR GOALS:</Text>
              <View style={styles.goalsMatchGrid}>
                {[...new Set(relevantGoals)].map((goal, index) => (
                  <View key={`${goal}-${index}`} style={styles.userGoalChip}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.userGoalText}>
                      {goal.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
          
          <View style={styles.allGoalsSection}>
            <Text style={styles.allGoalsTitle}>THIS TIP HELPS WITH:</Text>
            <View style={styles.goalsGrid}>
              {[...new Set(tip.goals || [])].map((goal, index) => {
                const isUserGoal = relevantGoals.includes(goal);
                return (
                  <View 
                    key={`${goal}-${index}`} 
                    style={[styles.goalChip, isUserGoal && styles.goalChipHighlight]}
                  >
                    <Text style={[styles.goalChipText, isUserGoal && styles.goalChipTextHighlight]}>
                      {goal.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );

  const renderPersonalizationCard = () => {
    // Handle text type
    if (tip.personalization_type === 'text') {
      const placeholder = tip.personalization_config?.placeholders?.[0] || "Enter your answer";
      
      return (
        <View style={styles.pageContainer}>
          <LinearGradient
            colors={['#FFFFFF', '#FAFAFA']}
            style={styles.cardGradient}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}
              keyboardVerticalOffset={150}
            >
              <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: 150 }]}
                keyboardShouldPersistTaps="handled"
              >
                <Text style={styles.sectionTitle}>Make It Your Own</Text>
                
                {!savedTextInput ? (
                  <View style={styles.textInputWrapper}>
                    <Text style={styles.personalizationPrompt}>
                      {tip.personalization_prompt}
                    </Text>
                    
                    <TextInput
                      style={styles.textInputField}
                      placeholder={placeholder}
                      value={textInput}
                      onChangeText={setTextInput}
                      placeholderTextColor="#999"
                      multiline={false}
                      returnKeyType="done"
                      onSubmitEditing={() => {
                        if (textInput.trim()) {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                          setSavedTextInput(textInput.trim());
                          onSavePersonalization?.({ type: 'text', data: textInput.trim() });
                          setShowSaveAnimation(true);
                          setTimeout(() => setShowSaveAnimation(false), 2000);
                        }
                      }}
                    />
                    
                    <TouchableOpacity
                      style={[
                        styles.saveTextButton,
                        !textInput.trim() && styles.saveTextButtonDisabled
                      ]}
                      onPress={() => {
                        if (textInput.trim()) {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                          setSavedTextInput(textInput.trim());
                          onSavePersonalization?.({ type: 'text', data: textInput.trim() });
                          setShowSaveAnimation(true);
                          setTimeout(() => setShowSaveAnimation(false), 2000);
                        }
                      }}
                      disabled={!textInput.trim()}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.saveTextButtonText}>Save</Text>
                      <Ionicons name="checkmark" size={20} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.savedChoiceContainer}>
                    <View style={styles.savedHeader}>
                      <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
                      <Text style={styles.savedTitle}>Your Plan</Text>
                    </View>
                    
                    <View style={styles.savedChoiceBox}>
                      <Text style={styles.savedChoicePrompt}>{tip.personalization_prompt}</Text>
                      <Text style={styles.savedChoiceText}>{savedTextInput}</Text>
                    </View>
                    
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => {
                        setSavedTextInput(null);
                        setTextInput(savedTextInput || '');
                      }}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="pencil" size={16} color="#4CAF50" />
                      <Text style={styles.editButtonText}>Change My Answer</Text>
                    </TouchableOpacity>
                  </View>
                )}
                
                {showSaveAnimation && (
                  <View style={styles.celebrationOverlay}>
                    <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
                    <Text style={styles.celebrationText}>Saved! 🎯</Text>
                  </View>
                )}
              </ScrollView>
            </KeyboardAvoidingView>
          </LinearGradient>
        </View>
      );
    }

    // Handle choice type
    if (tip.personalization_type === 'choice') {
      const choices = tip.personalization_config?.choices || [];
      const isMultiple = tip.personalization_config?.multiple === true;
      
      return (
        <View style={styles.pageContainer}>
          <LinearGradient
            colors={['#FFFFFF', '#FAFAFA']}
            style={styles.cardGradient}
          >
            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <Text style={styles.sectionTitle}>Make It Your Own</Text>
              
              {(!savedChoice && !savedChoices) ? (
                <>
                  <Text style={styles.personalizationPrompt}>
                    {tip.personalization_prompt}
                  </Text>
                  
                  <View style={styles.choiceContainer}>
                    {choices.map((choice, index) => {
                      const isSelected = isMultiple 
                        ? selectedChoices.includes(choice)
                        : selectedChoice === choice;
                      
                      return (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.choiceItem,
                            isSelected && styles.choiceItemSelected
                          ]}
                          onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            
                            if (isMultiple) {
                              if (selectedChoices.includes(choice)) {
                                setSelectedChoices(selectedChoices.filter(c => c !== choice));
                              } else {
                                setSelectedChoices([...selectedChoices, choice]);
                              }
                            } else {
                              setSelectedChoice(choice);
                              setTimeout(() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                setSavedChoice(choice);
                                onSavePersonalization?.({ type: 'choice', data: choice, multiple: false });
                                setShowSaveAnimation(true);
                                setTimeout(() => setShowSaveAnimation(false), 2000);
                              }, 500);
                            }
                          }}
                          activeOpacity={0.7}
                        >
                          <View style={styles.choiceItemHeader}>
                            <View style={styles.choiceCircle}>
                              {isSelected && (
                                <Ionicons name="checkmark" size={18} color="#424242" />
                              )}
                            </View>
                            <Text style={[
                              styles.choiceText,
                              isSelected && styles.choiceTextSelected
                            ]}>
                              {choice}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </>
              ) : (
                <View style={styles.savedChoiceContainer}>
                  <View style={styles.savedHeader}>
                    <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
                    <Text style={styles.savedTitle}>Your Plan</Text>
                  </View>
                  
                  <View style={styles.savedChoiceBox}>
                    <Text style={styles.savedChoicePrompt}>{tip.personalization_prompt}</Text>
                    <Text style={styles.savedChoiceText}>
                      {isMultiple && savedChoices 
                        ? savedChoices.join(', ')
                        : savedChoice}
                    </Text>
                  </View>
                  
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => {
                      if (isMultiple) {
                        setSavedChoices(null);
                        setSelectedChoices([]);
                      } else {
                        setSavedChoice(null);
                        setSelectedChoice(null);
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="pencil" size={16} color="#4CAF50" />
                    <Text style={styles.editButtonText}>Change My Selection</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              {showSaveAnimation && (
                <View style={styles.celebrationOverlay}>
                  <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
                  <Text style={styles.celebrationText}>Locked in! 🎯</Text>
                </View>
              )}
            </ScrollView>
          </LinearGradient>
        </View>
      );
    }

    // Default return for no personalization
    return null;
  };

  const shouldShowPersonalization = !!tip.personalization_prompt;

  const pages = [
    { key: 'summary', render: renderSummaryCard },
    { key: 'goals', render: renderGoalsCard },
    { key: 'benefits', render: renderBenefitsCard },
    { key: 'howto', render: renderHowToCard },
    ...(shouldShowPersonalization ? [{ key: 'personalize', render: renderPersonalizationCard }] : []),
  ];

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={neutralColors.white} />
      
      {/* Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.statusTime}>11:56 AM</Text>
        <View style={styles.statusRight}>
          <Svg width={16} height={16} viewBox="0 0 24 24">
            <Path d="M5 12.55a11 11 0 0 1 14 0M8.5 9.05a5.5 5.5 0 0 1 7 0M12 5v.01" 
                  stroke={neutralColors.gray700} strokeWidth={2} fill="none" strokeLinecap="round" />
          </Svg>
          <Svg width={16} height={16} viewBox="0 0 24 24">
            <Rect x={4} y={6} width={16} height={10} rx={2} stroke={neutralColors.gray700} strokeWidth={2} fill="none" />
            <Line x1={8} y1={6} x2={8} y2={4} stroke={neutralColors.gray700} strokeWidth={2} strokeLinecap="round" />
            <Line x1={16} y1={6} x2={16} y2={4} stroke={neutralColors.gray700} strokeWidth={2} strokeLinecap="round" />
          </Svg>
          <Text style={styles.statusBattery}>79%</Text>
        </View>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.appTitle, { color: theme.primary }]}>Habit Helper</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={cycleTheme}>
            <Animated.View style={[styles.iconBtn, { 
              backgroundColor: theme.primary,
              transform: [{ rotate: spin }] 
            }]}>
              <Svg width={20} height={20} viewBox="0 0 24 24">
                <Circle cx={12} cy={12} r={5} stroke={neutralColors.white} strokeWidth={2} fill="none" />
                <Line x1={12} y1={1} x2={12} y2={3} stroke={neutralColors.white} strokeWidth={2} strokeLinecap="round" />
                <Line x1={12} y1={21} x2={12} y2={23} stroke={neutralColors.white} strokeWidth={2} strokeLinecap="round" />
                <Line x1={4.22} y1={4.22} x2={5.64} y2={5.64} stroke={neutralColors.white} strokeWidth={2} strokeLinecap="round" />
                <Line x1={18.36} y1={18.36} x2={19.78} y2={19.78} stroke={neutralColors.white} strokeWidth={2} strokeLinecap="round" />
                <Line x1={1} y1={12} x2={3} y2={12} stroke={neutralColors.white} strokeWidth={2} strokeLinecap="round" />
                <Line x1={21} y1={12} x2={23} y2={12} stroke={neutralColors.white} strokeWidth={2} strokeLinecap="round" />
              </Svg>
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stories Section */}
      <View style={styles.storiesWrapper}>
        <ScrollView 
          horizontal 
          style={styles.storiesSection} 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesContent}
        >
          {stories.map((story, index) => (
            <TouchableOpacity 
              key={story.id} 
              onPress={() => {
                setActiveStoryIndex(index);
                setCurrentPage(Math.min(index, pages.length - 1));
                flatListRef.current?.scrollToIndex({ index: Math.min(index, pages.length - 1), animated: true });
              }}
              style={styles.storyItemWrapper}
            >
              <View style={styles.storyItem}>
                <View style={[
                  styles.storyCircle,
                  story.active && { backgroundColor: theme.primaryLight },
                  story.viewed && !story.active && styles.storyCircleViewed,
                ]}>
                  <View style={styles.storyInner}>
                    {story.icon(story.active ? theme.primary : neutralColors.gray700)}
                  </View>
                </View>
                <Text style={styles.storyLabel}>{story.label}</Text>
                {index < stories.length - 1 && (
                  <View style={[
                    styles.storyLine,
                    story.completed && { backgroundColor: theme.primaryLight }
                  ]} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Card Content Area */}
      <View style={styles.cardContainer}>
        <View style={styles.cardWrapper}>
          <View style={styles.cardMask}>
            <FlatList
              ref={flatListRef}
              data={pages}
              renderItem={({ item }) => item.render()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              keyExtractor={(item) => item.key}
              decelerationRate="fast"
              bounces={false}
              onMomentumScrollEnd={(event) => {
                const newPage = Math.round(event.nativeEvent.contentOffset.x / CARD_WIDTH);
                setCurrentPage(newPage);
              }}
            />
          </View>
          
          {/* Navigation Arrows */}
          {currentPage > 0 && (
            <TouchableOpacity 
              style={[styles.navArrow, styles.navArrowLeft]}
              onPress={() => navigateCard(-1)}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={22} color="#4CAF50" />
            </TouchableOpacity>
          )}
          
          {currentPage < pages.length - 1 && (
            <TouchableOpacity 
              style={[styles.navArrow, styles.navArrowRight]}
              onPress={() => navigateCard(1)}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-forward" size={22} color="#4CAF50" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Social Proof */}
      <View style={styles.socialProof}>
        <Svg width={16} height={16} viewBox="0 0 24 24">
          <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" 
                fill={theme.primary} />
        </Svg>
        <Text style={styles.socialProofText}>
          <Text style={[styles.socialProofNumber, { color: theme.primary }]}>3,423</Text> tried this
        </Text>
      </View>

      {/* Action Buttons - Hide when rejected or saved for later */}
      {!rejectionInfo && !maybeLaterInfo && (
        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
            onPress={() => handleResponse('try_it')}
            activeOpacity={0.8}
          >
            <Svg width={20} height={20} viewBox="0 0 24 24">
              <Polyline points="20 6 9 17 4 12" stroke={neutralColors.white} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.primaryBtnText}>I'll Try It!</Text>
          </TouchableOpacity>

          <View style={styles.secondaryActions}>
            <TouchableOpacity 
              style={[styles.secondaryBtn, { borderColor: neutralColors.gray300 }]}
              onPress={() => handleResponse('maybe_later')}
              activeOpacity={0.7}
            >
              <Svg width={16} height={16} viewBox="0 0 24 24">
                <Path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
                      stroke={neutralColors.gray700} strokeWidth={2} fill="none" />
              </Svg>
              <Text style={styles.secondaryBtnText}>Save for Later</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.secondaryBtn, { borderColor: neutralColors.gray300 }]}
              onPress={handleNotForMe}
              activeOpacity={0.7}
            >
              <Svg width={16} height={16} viewBox="0 0 24 24">
                <Line x1={18} y1={6} x2={6} y2={18} stroke={neutralColors.gray700} strokeWidth={2} strokeLinecap="round" />
                <Line x1={6} y1={6} x2={18} y2={18} stroke={neutralColors.gray700} strokeWidth={2} strokeLinecap="round" />
              </Svg>
              <Text style={styles.secondaryBtnText}>Pass</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveNavItem('Today')}>
          <Svg width={24} height={24} viewBox="0 0 24 24">
            <Rect x={3} y={4} width={18} height={18} rx={2} 
                  stroke={activeNavItem === 'Today' ? theme.primary : neutralColors.gray500} strokeWidth={2} fill="none" />
            <Line x1={16} y1={2} x2={16} y2={6} stroke={activeNavItem === 'Today' ? theme.primary : neutralColors.gray500} strokeWidth={2} strokeLinecap="round" />
            <Line x1={8} y1={2} x2={8} y2={6} stroke={activeNavItem === 'Today' ? theme.primary : neutralColors.gray500} strokeWidth={2} strokeLinecap="round" />
            <Line x1={3} y1={10} x2={21} y2={10} stroke={activeNavItem === 'Today' ? theme.primary : neutralColors.gray500} strokeWidth={2} />
          </Svg>
          <Text style={[styles.navLabel, activeNavItem === 'Today' && { color: theme.primary }]}>Today</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveNavItem('Habits')}>
          <Svg width={24} height={24} viewBox="0 0 24 24">
            <Polyline points="20 6 9 17 4 12" 
                      stroke={activeNavItem === 'Habits' ? theme.primary : neutralColors.gray500} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
          <Text style={[styles.navLabel, activeNavItem === 'Habits' && { color: theme.primary }]}>Habits</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveNavItem('Progress')}>
          <Svg width={24} height={24} viewBox="0 0 24 24">
            <Line x1={18} y1={20} x2={18} y2={10} stroke={activeNavItem === 'Progress' ? theme.primary : neutralColors.gray500} strokeWidth={2} strokeLinecap="round" />
            <Line x1={12} y1={20} x2={12} y2={4} stroke={activeNavItem === 'Progress' ? theme.primary : neutralColors.gray500} strokeWidth={2} strokeLinecap="round" />
            <Line x1={6} y1={20} x2={6} y2={14} stroke={activeNavItem === 'Progress' ? theme.primary : neutralColors.gray500} strokeWidth={2} strokeLinecap="round" />
          </Svg>
          <Text style={[styles.navLabel, activeNavItem === 'Progress' && { color: theme.primary }]}>Progress</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveNavItem('MyWhy')}>
          <Svg width={24} height={24} viewBox="0 0 24 24">
            <Path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" 
                  stroke={activeNavItem === 'MyWhy' ? theme.primary : neutralColors.gray500} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
          <Text style={[styles.navLabel, activeNavItem === 'MyWhy' && { color: theme.primary }]}>My Why</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveNavItem('TestProfile')}>
          <Svg width={24} height={24} viewBox="0 0 24 24">
            <Path d="M10 2v20M14 2v20M5 9l14 4L5 17" 
                  stroke={activeNavItem === 'TestProfile' ? theme.primary : neutralColors.gray500} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
          <Text style={[styles.navLabel, activeNavItem === 'TestProfile' && { color: theme.primary }]}>Test Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles
const createStyles = (theme: Theme, neutralColors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: neutralColors.gray100,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: neutralColors.white,
  },
  statusTime: {
    fontSize: 13,
    fontWeight: '500',
    color: neutralColors.gray700,
  },
  statusRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBattery: {
    fontSize: 13,
    fontWeight: '500',
    color: neutralColors.gray700,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: neutralColors.white,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: neutralColors.gray100,
  },
  storiesWrapper: {
    backgroundColor: neutralColors.white,
  },
  storiesSection: {
    paddingVertical: 20,
  },
  storiesContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  storyItemWrapper: {
    marginRight: 16,
  },
  storyItem: {
    alignItems: 'center',
    position: 'relative',
  },
  storyCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    padding: 2,
    backgroundColor: neutralColors.gray300,
    marginBottom: 8,
  },
  storyCircleViewed: {
    opacity: 0.6,
  },
  storyInner: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    backgroundColor: neutralColors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyLabel: {
    fontSize: 11,
    color: neutralColors.gray500,
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: 70,
  },
  storyLine: {
    position: 'absolute',
    top: 32,
    left: 66,
    width: 12,
    height: 2,
    backgroundColor: neutralColors.gray300,
  },
  cardContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  cardWrapper: {
    flex: 1,
    position: 'relative',
  },
  cardMask: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  pageContainer: {
    width: CARD_WIDTH,
    paddingHorizontal: 0,
    height: '100%',
  },
  cardGradient: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    minHeight: 300,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  scrollContent: {
    paddingBottom: 10,
  },
  navArrow: {
    position: 'absolute',
    top: '50%',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  navArrowLeft: {
    left: -12,
    transform: [{ translateY: -22 }],
  },
  navArrowRight: {
    right: -12,
    transform: [{ translateY: -22 }],
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  timeBadge: {
    backgroundColor: '#F5F5F5',
  },
  difficultyBadge: {
    backgroundColor: '#E8F5E9',
  },
  badgeText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  summaryTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#212121',
    lineHeight: 30,
    marginBottom: 8,
  },
  summarySubtitle: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
    marginBottom: 16,
  },
  reasonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  reasonChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  reasonText: {
    fontSize: 11,
    color: '#2E7D32',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 20,
  },
  detailsText: {
    fontSize: 15,
    color: '#424242',
    lineHeight: 24,
    marginBottom: 24,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    marginBottom: 24,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 11,
    color: '#757575',
    marginTop: 4,
  },
  infoValue: {
    fontSize: 12,
    color: '#424242',
    fontWeight: '600',
    marginTop: 2,
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '48%',
  },
  benefitText: {
    fontSize: 13,
    color: neutralColors.gray700,
    fontWeight: '500',
    flex: 1,
  },
  whyItWorksSection: {
    backgroundColor: '#F0F7FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  whyItWorksText: {
    fontSize: 15,
    color: '#424242',
    lineHeight: 24,
  },
  howToContent: {
    marginBottom: 24,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingLeft: 8,
  },
  bulletIcon: {
    fontSize: 16,
    color: '#4CAF50',
    marginRight: 10,
    fontWeight: '700',
  },
  bulletText: {
    fontSize: 15,
    color: '#424242',
    lineHeight: 22,
    flex: 1,
  },
  goalsMatchSection: {
    marginBottom: 24,
  },
  goalsMatchTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4CAF50',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  goalsMatchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  userGoalChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  userGoalText: {
    fontSize: 13,
    color: '#2E7D32',
    fontWeight: '600',
  },
  allGoalsSection: {
    marginTop: 8,
  },
  allGoalsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#757575',
    marginBottom: 8,
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goalChip: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  goalChipText: {
    fontSize: 11,
    color: '#E65100',
    fontWeight: '500',
  },
  goalChipHighlight: {
    backgroundColor: '#C8E6C9',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  goalChipTextHighlight: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  socialProof: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 15,
    paddingTop: 2,
    paddingBottom: 16,
  },
  socialProofText: {
    fontSize: 13,
    color: neutralColors.gray700,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  socialProofNumber: {
    fontWeight: '600',
  },
  actionSection: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: neutralColors.white,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    backgroundColor: neutralColors.white,
  },
  secondaryBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: neutralColors.gray700,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 16 : 12,
    backgroundColor: neutralColors.white,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  navItem: {
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 5,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: neutralColors.gray500,
  },
  // Personalization styles
  personalizationPrompt: {
    fontSize: 16,
    color: '#424242',
    lineHeight: 24,
    marginBottom: 24,
  },
  textInputWrapper: {
    marginTop: 4,
    gap: 8,
  },
  textInputField: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    minHeight: 52,
    marginTop: 4,
  },
  saveTextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  saveTextButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  saveTextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  choiceContainer: {
    gap: 12,
    marginTop: 20,
  },
  choiceItem: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 4,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  choiceItemSelected: {
    backgroundColor: '#F0F7FF',
    borderColor: '#4CAF50',
  },
  choiceItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  choiceCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  choiceText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#424242',
    flex: 1,
  },
  choiceTextSelected: {
    color: '#2E7D32',
  },
  savedChoiceContainer: {
    backgroundColor: '#F0F7FF',
    borderRadius: 16,
    padding: 20,
  },
  savedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  savedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
  },
  savedChoiceBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  savedChoicePrompt: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  savedChoiceText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E7D32',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 6,
    paddingVertical: 8,
  },
  editButtonText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  celebrationOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -80 }, { translateY: -50 }],
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  celebrationText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4CAF50',
    marginTop: 8,
  },
  // Rejection/Maybe Later status styles
  rejectionInlineWrapper: {
    position: 'relative',
    marginTop: 20,
  },
  rejectionInlineCornerLabel: {
    position: 'absolute',
    top: -8,
    right: 16,
    backgroundColor: '#F87171',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    zIndex: 1,
  },
  rejectionInlineCornerLabelText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rejectionInlineCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
  },
  rejectionInlineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  rejectionInlineIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectionInlineContent: {
    flex: 1,
  },
  rejectionInlineLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },
  rejectionInlineSubtext: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 1,
  },
  rejectionInlineEditButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  rejectionInlineReasonsBox: {
    backgroundColor: '#FEF3F2',
    borderRadius: 8,
    padding: 10,
  },
  rejectionInlineReasonHeader: {
    fontSize: 10,
    fontWeight: '600',
    color: '#EF4444',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rejectionInlineReasonsList: {
    gap: 4,
  },
  rejectionInlineReasonRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  rejectionInlineReasonDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DC2626',
    marginTop: 4,
  },
  rejectionInlineReasonText: {
    fontSize: 12,
    color: '#1F2937',
    flex: 1,
    lineHeight: 16,
  },
  maybeLaterInlineWrapper: {
    position: 'relative',
    marginTop: 20,
  },
  maybeLaterInlineCornerLabel: {
    position: 'absolute',
    top: -8,
    right: 16,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    zIndex: 1,
  },
  maybeLaterInlineCornerLabelText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  maybeLaterInlineCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#FCD34D',
  },
  maybeLaterInlineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  maybeLaterInlineIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  maybeLaterInlineContent: {
    flex: 1,
  },
  maybeLaterInlineLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F59E0B',
  },
  maybeLaterInlineSubtext: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 1,
  },
  maybeLaterInlineInfoBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: 8,
    padding: 10,
  },
  maybeLaterInlineInfoText: {
    fontSize: 12,
    color: '#78350F',
    lineHeight: 16,
  },
});
